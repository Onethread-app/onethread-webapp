import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import { useParams, useLocation } from 'react-router';
import { ITask, TaskBoard } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
import {
  getSelectedTaskDetails,
  getSelectedBoard,
} from 'stores/task/Actions';
import { isMobileOnly } from 'react-device-detect';
import Modal from 'react-modal';
import ErrorText from '../settings/ErrorText';
import { useTranslation } from 'react-i18next';
import { ActivityView } from './activity/ActivityView';
import { TaskDetails } from './taskDetails';
import TaskInfoViewComponent from './TaskInfoView/Index';
import SuspenseLoader from 'components/loader/SuspenseLoader';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';

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
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  // const location: any = useLocation();
  // const params = useParams();
  // const { taskId } = params as any;
  // const background = location.state && location.state.background;

  // useEffect(() => {
  //   props.getSelectedTaskDetails(taskId);
  // }, [taskId]);

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingTask === false &&
      props.taskError === ''
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

  function closeModal() {
    setOpenModal(false);
  }
  useEffect(() => {
    setOpenModal(props.subscriptiontExpired);
  }, [props.subscriptiontExpired]);

  return (
    <div className="cf h-100" style={{ zIndex: 4 }}>
      <BreadCrumbs
        items={[
          {
            text: `Board`,
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
        <div className="task-activity-container">
          <div className="w-100 w-70-l pa2">
            <TaskDetails />
            {isMobileOnly ? null : <ActivityView />}
          </div>
          <div
            className="w-100 w-30-l flex justify-center task-info-view"
            style={{ background: '#F6F6F6' }}
          >
            <TaskInfoViewComponent />
          </div>
        </div>
      )}

      {openModal && (
        <Modal
          isOpen={openModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ErrorText
            closeModal={closeModal}
            text={t('app.company.Settings.Expired')}
            subtext={t('app.company.Settings.Expired-text')}
          />
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
    company: state.companyReducer.currentCompany,
    currentProject: state.projectReducer.projectDetails,
    fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
    taskError: state.taskIndexReducer.taskReducer.taskError,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};

export const TaskPage = connect(mapStateToProps, {
  getSelectedTaskDetails,
  getSelectedBoard,
})(TaskPageComponent);

export default TaskPage;
