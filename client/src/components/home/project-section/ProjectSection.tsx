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

import { ICompanyByUser, User } from 'stores/user/Reducer';
import { IProject } from 'stores/project/Reducer';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import {
  createProjectInCompany,
  getAllUserProjects,
} from 'stores/project/Actions';
import {
  clearErrorOnCompanyCreate,
  createCompanyActionFailure,
  createCompanyActionSuccess,
} from 'stores/company/Actions';
import { saveProjectForm } from 'stores/projectForm/Actions';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Container, Header } from './ProjectSection.styles';
import ProjectDialog from './ProjectDialog';
import { Dialog, Icon, Popover } from '@blueprintjs/core';
import ProjectsTableSkeleton from 'components/project/ProjectsTableSkeleton';
import { ProjectTableColumns } from 'components/project/ProjectTableColumns';
import ProjectsTable from 'components/project/ProjectsTable';
import {
  CreatableItem,
  HeaderContainer,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
} from 'components/table/StyledTable.styles';
import { ClickAwayListener } from '@material-ui/core';
import { AlignCenter } from 'components/UtilComponents';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { isEmpty, isNil } from 'lodash';

interface INewCompanyResponse {
  message: string;
  company: {
    _id: string;
    name: string;
    uniqueName: string;
    type: string;
    email: string;
    address: string;
    legalOwnerName: string;
    legalOwnerMail: string;
    role: string;
  };
}

interface IProps {
  user: User;
  companies: ICompanyByUser[];
  projectLoading: boolean;
  getAllCompaniesByUserId: (id: string) => void;
  createProjectInCompany: (val: {}) => void;
  clearErrorOnCompanyCreate: () => void;
  companyName: string;
  creatingCompany: boolean;
  errorOnCreatingCompany: string;
  errorOnCreatingProject: string;
  currentCompany: any;
  saveProjectForm: any;
  previousData: any;
  userProjects: IProject[];
  fetchingUserProjects: boolean;
  errorOnFetchingUserProjects: string;
  createCompanyActionSuccess: (arg: INewCompanyResponse) => void;
  createCompanyActionFailure: (arg: string) => void;
  getAllUserProjects: () => void;
}

const Index = (props: IProps) => {
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(true);

  const data = useMemo(() => projects, [projects]);
  const columns = useMemo(() => ProjectTableColumns, []);
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
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
        pageSize: 6,
        hiddenColumns: ['createdAt'],
        // sortBy: [{ id: 'status', desc: true }],
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
    if (props.user._id) {
      props.getAllUserProjects();
    }
  }, [props.user._id]);

  useEffect(() => {
    if (loading === true &&
      props.fetchingUserProjects === false) {
      setLoading(false);
    }
  }, [loading,
    props.fetchingUserProjects,
    props.errorOnFetchingUserProjects]);

  useEffect(() => {
    (!isNil(props.userProjects) &&
      !isEmpty(props.userProjects)) &&
      setProjects(props.userProjects);
  }, [props.userProjects]);
  return (
    <Container>
      <HeaderContainer>
        <Header>
          <span className="flex items-center">
            {expand ? (
              <ArrowDropDownIcon
                className="mr2 pointer"
                onClick={() => setExpand(false)}
              />
            ) : (
              <ArrowRightIcon
                className="mr2 pointer"
                onClick={() => setExpand(true)}
              />
            )}
          </span>
          Recent projects
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
      {expand ? (
        <>
          {projects.length === 0 ? (
            loading ? (
              <ProjectsTableSkeleton />
            ) : (
              <div className="flex flex-column">
                <span className="mb2 mt2">
                  No project has been created.{' '}
                </span>
                <CreatableItem
                  onClick={() => setOpenProjectDialog(true)}
                >
                  <span>+ </span> Create Project
                </CreatableItem>
              </div>
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
        </>
      ) : null}
      <Dialog
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        className="w-auto h-auto pb0"
        isOpen={openProjectDialog}
        onClose={() => setOpenProjectDialog(false)}
      >
        <ProjectDialog setOpenProjectDialog={setOpenProjectDialog} />
      </Dialog>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  companies: state.userReducer.user.companies,
  user: state.userReducer.user,
  projectLoading: state.projectReducer.projectLoading,
  companyName: state.companyReducer.currentCompany.uniqueName,
  currentCompany: state.companyReducer.currentCompany,
  creatingCompany: state.companyReducer.creatingCompany,
  errorOnCreatingCompany: state.companyReducer.errorOnCreatingCompany,
  errorOnCreatingProject: state.projectReducer.error,
  fetchingUserProjects: state.projectReducer.fetchingAllUserProjects,
  errorOnFetchingUserProjects:
    state.projectReducer.errorOnFetchingUserProjects,
  previousData: state.projectFormReducer.data,
  userProjects: state.projectReducer.userProjects,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  createProjectInCompany,
  clearErrorOnCompanyCreate,
  saveProjectForm,
  createCompanyActionSuccess,
  createCompanyActionFailure,
  getAllUserProjects,
})(Index);
