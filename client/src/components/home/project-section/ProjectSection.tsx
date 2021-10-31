import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  // useAsyncDebounce,
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

import Hamburger from '../../../resources/images/hamburger.png';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Container, Header, Row } from './ProjectSection.styles';
import ProjectDialog from './ProjectDialog';
import { Dialog } from '@blueprintjs/core';
import ProjectsTableSkeleton from 'components/project/ProjectsTableSkeleton';
import { ProjectTableColumns } from 'components/project/ProjectTableColumns';
import ProjectsTable from 'components/project/ProjectsTable';
import { CreatableItem } from 'components/table/StyledTable.styles';

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
  useToaster: () => {
    showToaster: boolean;
    successMessage: string;
    errorMessage: string;
    setShowToaster: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  };
  getAllUserProjects: () => void;
}

const Index = (props: IProps) => {
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(true);

  const data = useMemo(() => projects, [projects]);
  const columns = useMemo(() => ProjectTableColumns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    // allColumns,
    state,
    // setGlobalFilter,
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

  const {
    // globalFilter,
    pageSize,
    pageIndex,
  } = state;

  useEffect(() => {
    if (props.user._id) {
      props.getAllUserProjects();
      setLoading(true);
    }
  }, [props.user._id]);

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingUserProjects === false &&
      props.errorOnFetchingUserProjects === ''
    ) {
      setProjects(props.userProjects);
      setLoading(false);
    }
  }, [
    props.userProjects,
    loading,
    props.fetchingUserProjects,
    props.errorOnFetchingUserProjects,
  ]);
  return (
    <Container>
      <Header>
        <span className="flex items-center">
          Recent projects{' '}
          {expand ? (
            <ExpandLessIcon
              className="ml3 pointer"
              onClick={() => setExpand(false)}
            />
          ) : (
            <ExpandMoreIcon
              className="ml3 pointer"
              onClick={() => setExpand(true)}
            />
          )}
        </span>
        <img src={Hamburger} alt="" />
      </Header>
      {expand ? (
        <>
          {projects.length === 0 ? (
            loading ? (
              <ProjectsTableSkeleton />
            ) : (
              <Row>
                No project has been created.{' '}
                <CreatableItem
                  onClick={() => setOpenProjectDialog(true)}
                >
                  <span>+ </span> Create Project
                </CreatableItem>
              </Row>
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
        <ProjectDialog
          useToaster={props.useToaster}
          setOpenProjectDialog={setOpenProjectDialog}
        />
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
  fetchingUserProjects: state.projectReducer.fetchingUserProjects,
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
