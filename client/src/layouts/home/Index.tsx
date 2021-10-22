import { isMobileOnly } from 'react-device-detect';
import { useEffect, useState } from 'react';

import VideoConference from 'components/home/VideoConference';
import { Tasks } from 'components/home/Tasks';
import Projects from 'components/home/Projects';
import Subtasks from 'components/home/Subtasks';

import {
  Avatar,
  Container,
  ErrorToaster,
  Row,
  SuccessToaster,
} from './Index.styles';
import './Index.styles.scss';
import CompanySection from 'components/home/company-section/CompanySection';
import ProjectSection from 'components/home/project-section/ProjectSection';
import TaskSection from 'components/home/task-section/TaskSection';
import { connect, useDispatch } from 'react-redux';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
// import { getProjectsIndividual } from 'stores/project/Actions';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import { getCompanyDetails } from 'stores/company/Actions';
import { getAllUserTasks } from 'stores/task/Actions';

const Index = (props: any) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const useToaster = () => {
    return {
      showToaster,
      successMessage,
      errorMessage,
      setShowToaster,
      setErrorMessage,
      setSuccessMessage,
    };
  };

  useEffect(() => {
    if (props.user._id && props.companies.length === 0) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    // props.getProjectsIndividual();
  }, [props.user]);

  useEffect(() => {
    if (props.currentCompany.name === '') {
      props.getCompanyDetails(props.companies[0]?.company.uniqueName);
    }
  }, [props.companies, props.currentCompany]);

  useEffect(() => {
    props.getAllUserTasks();
  }, [props.currentCompany]);

  return isMobileOnly ? (
    <div className="home-container">
      <div>
        <Tasks />
      </div>
      <div>
        <Subtasks />
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <VideoConference />
      </div>
      {/* <div>
        <ProfileProgress />
      </div> */}
    </div>
  ) : (
    <Container>
      <span>PERSONAL DASHBOARD</span>
      <Row justify="flex-start">
        <Avatar>{props.user?.firstName?.substring(0, 2)}</Avatar> Hi,{' '}
        {props.user.firstName}
      </Row>
      <CompanySection useToaster={useToaster} />
      <ProjectSection useToaster={useToaster} />
      <TaskSection useToaster={useToaster} />
      {Boolean(showToaster && errorMessage) ? (
        <ErrorToaster>{errorMessage}</ErrorToaster>
      ) : null}
      {Boolean(showToaster && successMessage) ? (
        <SuccessToaster>{successMessage}</SuccessToaster>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  currentCompany: state.companyReducer.currentCompany,
  companies: state.userReducer.user.companies,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  getCompanyDetails,
  getAllUserTasks,
})(Index);
