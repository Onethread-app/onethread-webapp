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

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledInput,
  StyledFilterPopover,
} from 'components/table/StyledTable.styles';
import { AlignCenter } from 'components/UtilComponents';
import TeammatesTable from './TeammatesTable';
import ColleagueTableSkeleton from 'layouts/company/colleagues/ColleagueTableSkeleton';
import { TeammatesTableColumns } from 'layouts/company/colleagues/TeammatesTableColumns';

interface ICompanyProjects {
  projectList: IProject[];
  gettingAllProjects: boolean;
  gettingCompanyDetails: boolean;
  errorOnGettingAllProjects: string;
  uniqueCompanyName: string;
  currentCompanyId: string;
  colleagues: any;
  getAllProjects: (companyId: string) => void;
}

const Teammates = (props: ICompanyProjects) => {
  const {
    colleagues,
    gettingAllProjects,
    gettingCompanyDetails,
    errorOnGettingAllProjects,
    uniqueCompanyName,
  } = props;
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const data = useMemo(() => colleagues, [colleagues]);
  const columns = useMemo(() => TeammatesTableColumns, []);

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
        hiddenColumns: ['position', 'division', 'department'],
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
      props.getAllProjects(props.currentCompanyId);
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
          Teammates{' '}
          {colleagues.length > 0 && (
            <span>({colleagues.length})</span>
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
      {colleagues.length === 0 ? (
        loadingData ? (
          <ColleagueTableSkeleton />
        ) : error ? (
          <div className="mt3">{error}</div>
        ) : (
          <div className="mt3">No Teammates. </div>
        )
      ) : (
        <TeammatesTable
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
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  projectList: state.projectReducer.allProjects,
  gettingAllProjects: state.projectReducer.gettingAllProjects,
  errorOnGettingAllProjects:
    state.projectReducer.errorOnGettingAllProjects,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  currentCompanyId: state.companyReducer.currentCompany.id,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
});

export default connect(mapStateToProps, { getAllProjects })(
  Teammates,
);
