import { Link } from 'react-router-dom';
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
import { Container, Header, Row } from './ProjectSection.styles';
import ProjectDialog from './ProjectDialog';
import { Dialog } from '@blueprintjs/core';
import ProjectsTableSkeleton from 'components/project/ProjectsTableSkeleton';
import { ProjectTableColumns } from 'components/project/ProjectTableColumns';
import ProjectsTable from 'components/project/ProjectsTable';

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
        Recent projects
        <img src={Hamburger} alt="" />
      </Header>
      {projects.length === 0 ? (
        loading ? (
          <ProjectsTableSkeleton />
        ) : (
          <Row>
            No project has been created.{' '}
            <Link
              to="#"
              onClick={() => setOpenProjectDialog(!openProjectDialog)}
            >
              Create Project
            </Link>
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
        />
      )}
      <Dialog
        canOutsideClickClose={false}
        autoFocus
        style={{ borderRadius: '1rem' }}
        className="w-auto h-auto pb0"
        isOpen={openProjectDialog}
      >
        <ProjectDialog
          // setProjects={setProjects}
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
