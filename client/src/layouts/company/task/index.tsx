import { useState, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

import { ITask, TaskBoard } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
import {
  getSelectedTaskDetails,
  getSelectedBoard,
} from 'stores/task/Actions';

import SuspenseLoader from 'components/loader/SuspenseLoader';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { ActivityView } from './activity/ActivityView';
import { TaskDetails } from './taskDetails';
import TaskInfoViewComponent from './TaskInfoView/Index';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface TaskInternalProps {
  currentTask: ITask;
  currentBoard: TaskBoard;
  company: ICompany;
  currentProject: IProject;
  subscriptiontExpired: boolean;
  fetchingTask: boolean;
  taskError: string;
  getSelectedTaskDetails: (taskId: string) => void;
  getSelectedBoard: (boardId: string) => void;
}

const TaskPageComponent = (props: TaskInternalProps) => {
  const [loading, setLoading] = useState(true);
  // const location: any = useLocation();
  // const params = useParams();
  // const { taskId } = params as any;
  // const background = location.state && location.state.background;

  // useEffect(() => {
  //   props.getSelectedTaskDetails(taskId);
  // }, [taskId]);

  useEffect(() => {
    if (
      loading === true
      && props.fetchingTask === false
      && props.taskError === ''
    ) {
      setLoading(false);
    }
  }, [loading, props.fetchingTask, props.taskError]);

  // useEffect(() => {
  //   if (
  //     props.currentTask._id !== '' &&
  //     props.currentBoard._id === '' &&
  //     props.currentTask.boardId
  //   ) {
  //     props.getSelectedBoard(props.currentTask.boardId);
  //   }
  // }, [props.currentBoard._id, props.currentTask]);

  return (
    <div className='cf h-100' style={{ zIndex: 4 }}>
      <BreadCrumbs
        items={[
          {
            text: 'Board',
            href: `/company/${props.company.uniqueName}/project/${props.currentProject._id}/board`,
          },
          {
            text: `${props.currentBoard!.name}`,
            href: `/company/${props.company.uniqueName}/project/${props.currentProject._id}/board/${props.currentBoard._id}`,
          },
          {
            text: `${props.currentTask.name}`,
            href: `/company/${props.company.uniqueName}/project/${props.currentProject._id}/board/${props.currentBoard._id}/task/${props.currentTask._id}`,
          },
        ]}
      />

      {loading === true ? (
        <SuspenseLoader insideComponent />
      ) : (
        <div className='task-activity-container'>
          <div className='w-100 w-70-l pa2'>
            <TaskDetails />
            {isMobileOnly ? null : <ActivityView />}
          </div>
          <div
            className='w-100 w-30-l flex justify-center task-info-view'
            style={{ background: '#F6F6F6' }}
          >
            <TaskInfoViewComponent />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  currentTask: state.taskIndexReducer.taskReducer.currentTask,
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
  company: state.companyReducer.currentCompany,
  currentProject: state.projectReducer.projectDetails,
  fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
  taskError: state.taskIndexReducer.taskReducer.taskError,
  subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
});

export const TaskPage = connect(mapStateToProps, {
  getSelectedTaskDetails,
  getSelectedBoard,
})(TaskPageComponent);

export default TaskPage;
