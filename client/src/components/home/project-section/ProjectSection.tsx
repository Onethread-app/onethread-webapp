import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { ICompanyByUser, User } from 'stores/user/Reducer';
import { IProject } from 'stores/project/Reducer';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { createProjectInCompany } from 'stores/project/Actions';
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
  allProjects: IProject[];
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
}

const Index = (props: IProps) => {
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    setProjects(props.allProjects);
  }, [props.allProjects]);

  return (
    <Container>
      <Header>
        Recent projects
        <img src={Hamburger} alt="" />
      </Header>
      {projects.length === 0 ? (
        <Row>
          No project has been created.{' '}
          <Link
            to="#"
            onClick={() => setOpenProjectDialog(!openProjectDialog)}
          >
            Create Project
          </Link>
        </Row>
      ) : (
        <Row>
          {projects.length} project found.{' '}
          <Link
            to="#"
            onClick={() => setOpenProjectDialog(!openProjectDialog)}
          >
            Create Project
          </Link>
        </Row>
      )}
      <Dialog
        canOutsideClickClose={false}
        autoFocus
        style={{ borderRadius: '1rem' }}
        className="w-auto h-auto pb0"
        isOpen={openProjectDialog}
      >
        <ProjectDialog
          setProjects={setProjects}
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
  previousData: state.projectFormReducer.data,
  allProjects: state.projectReducer.allProjects,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  createProjectInCompany,
  clearErrorOnCompanyCreate,
  saveProjectForm,
  createCompanyActionSuccess,
  createCompanyActionFailure,
})(Index);
