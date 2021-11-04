import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useAsyncDebounce,
  usePagination,
} from 'react-table';

import { getAllProjects } from 'stores/project/Actions';
import { IProject } from 'stores/project/Reducer';
import { ProjectTableColumns } from './ProjectTableColumns';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import ProjectsTable from './ProjectsTable';
import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledInput,
  StyledFilterPopover,
} from 'components/table/StyledTable.styles';
import ProjectsTableSkeleton from './ProjectsTableSkeleton';
import { AlignCenter } from 'components/UtilComponents';
import { Dialog } from '@blueprintjs/core';
import ProjectDialog from 'components/home/project-section/ProjectDialog';

interface ICompanyProjects {
  projectList: IProject[];
  gettingAllProjects: boolean;
  gettingCompanyDetails: boolean;
  errorOnGettingAllProjects: string;
  uniqueCompanyName: string;
  getAllProjects: () => void;
}

const CompanyProjects = (props: ICompanyProjects) => {
  const {
    projectList,
    gettingAllProjects,
    gettingCompanyDetails,
    errorOnGettingAllProjects,
    uniqueCompanyName,
  } = props;
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const data = useMemo(() => projectList, [projectList]);
  const columns = useMemo(() => ProjectTableColumns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    allColumns,
    state,
    setGlobalFilter,
    page,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize:
          window.innerHeight > 1079
            ? 12
            : window.innerHeight > 800
            ? 8
            : 6,
        hiddenColumns: ['createdAt'],
        // sortBy: [{ id: 'createdAt', desc: true }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  useEffect(() => {
    if (uniqueCompanyName) {
      props.getAllProjects();
    }
  }, [uniqueCompanyName]);

  useEffect(() => {
    if (gettingCompanyDetails === false) {
      if (
        loadingData === true &&
        gettingAllProjects === false &&
        errorOnGettingAllProjects === ''
      ) {
        setLoadingData(false);
      }
      if (
        loadingData === true &&
        gettingAllProjects === false &&
        errorOnGettingAllProjects !== ''
      ) {
        setLoadingData(false);
        setError(
          'There was an error fetching project list, try reloading the page.',
        );
      }
    } else {
      setLoadingData(true);
    }
  }, [
    loadingData,
    gettingAllProjects,
    errorOnGettingAllProjects,
    gettingCompanyDetails,
  ]);

  return (
    <Container>
      <HeaderContainer>
        <Header>
          Projects{' '}
          {projectList.length > 0 && (
            <span>({projectList.length})</span>
          )}
        </Header>
        <SortAndFilter>
          <ClickAwayListener
            onClickAway={() => {
              if (globalFilter === '' || globalFilter === undefined) {
                setShowInputField(false);
              }
            }}
          >
            <AlignCenter onClick={() => setShowInputField(true)}>
              {showInputField ? (
                <StyledInput onChange={handleSearchChange} />
              ) : (
                <Icon icon="search" />
              )}
              Search
            </AlignCenter>
          </ClickAwayListener>
          <Popover
            interactionKind="click"
            position="bottom-right"
            content={
              <StyledFilterPopover>
                <p className="bb">Customize Table</p>
                {allColumns.map((column) => (
                  <div key={column.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={column.isVisible}
                        disabled={column.id === 'name'}
                        {...column.getToggleHiddenProps()}
                      />{' '}
                      {column.Header}
                    </label>
                  </div>
                ))}
              </StyledFilterPopover>
            }
            target={<MoreVertIcon fontSize="small" />}
          />
        </SortAndFilter>
      </HeaderContainer>
      {projectList.length === 0 ? (
        loadingData ? (
          <ProjectsTableSkeleton />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>No Projects</div>
        )
      ) : (
        <ProjectsTable
          getTableProps={getTableProps}
          getTableBodyProps={getTableBodyProps}
          headerGroups={headerGroups}
          rows={rows}
          prepareRow={prepareRow}
          visibleColumns={visibleColumns}
          page={page}
          gotoPage={gotoPage}
          pageSize={pageSize}
          pageIndex={pageIndex}
          setPageSize={setPageSize}
          setOpenProjectDialog={setOpenProjectDialog}
        />
      )}
      <Dialog
        canOutsideClickClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        className="w-auto h-auto pb0"
        onClose={() => setOpenProjectDialog(false)}
        isOpen={openProjectDialog}
      >
        <ProjectDialog setOpenProjectDialog={setOpenProjectDialog} />
      </Dialog>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  projectList: state.projectReducer.allProjects,
  gettingAllProjects: state.projectReducer.gettingAllProjects,
  errorOnGettingAllProjects:
    state.projectReducer.errorOnGettingAllProjects,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
});

export default connect(mapStateToProps, { getAllProjects })(
  CompanyProjects,
);
