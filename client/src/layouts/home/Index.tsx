import { isMobileOnly } from 'react-device-detect';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

// import { getProjectsIndividual } from 'stores/project/Actions';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import { capitalizeFirstLetter } from 'helpers/utils';

import VideoConference from 'components/home/VideoConference';
import { Tasks } from 'components/home/Tasks';
import Projects from 'components/home/Projects';
import Subtasks from 'components/home/Subtasks';
import CompanySection from 'components/home/company-section/CompanySection';
import ProjectSection from 'components/home/project-section/ProjectSection';
import TaskSection from 'components/home/task-section/TaskSection';

import { Avatar, Container, Row } from './Index.styles';
import './Index.styles.scss';
import { User } from 'stores/user/Reducer';
import { clearCurrentTask } from 'stores/task/Actions';

interface IProps {
  user: User;
  clearCurrentTask: () => void;
}

const Index = (props: IProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
    props.clearCurrentTask();
  }, []);

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
        {props.user.profileImage ? (
          <img
            className="profile-pic"
            src={props.user.profileImage}
            alt=""
          />
        ) : (
          <Avatar>{props.user?.firstName?.substring(0, 2)}</Avatar>
        )}{' '}
        Hi, {capitalizeFirstLetter(props.user.firstName)}
      </Row>
      <CompanySection />
      <ProjectSection />
      <TaskSection />
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  clearCurrentTask,
})(Index);
