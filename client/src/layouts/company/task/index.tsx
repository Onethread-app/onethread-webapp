import React from 'react';
import { connect } from 'react-redux';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { ITask, TaskBoard } from 'stores/board/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { isMobileOnly } from 'react-device-detect';
import { Loading } from 'components/Loading';
import Modal from 'react-modal';
import ErrorText from '../settings/ErrorText';
import { useTranslation } from 'react-i18next';
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
  fetchingTask;
}

const TaskPageComponent = (props: TaskInternalProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = React.useState(false);
  function closeModal() {
    setOpenModal(false);
  }
  React.useEffect(() => {
    setOpenModal(props.subscriptiontExpired);
  }, [props.subscriptiontExpired]);

  return (
    <div className="cf ph3">
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
      {props.fetchingTask === true ? (
        <Loading />
      ) : (
        <div className="task-activity-container">
          <div className="w-100 w-70-l pa2">
            <TaskDetails />
            {isMobileOnly ? null : <ActivityView />}
          </div>
          <div
            className="w-100 w-30-l flex justify-center pa4 task-info-view"
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
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
    company: state.companyReducer.currentCompany,
    currentProject: state.projectReducer.projectDetails,
    fetchingTask: state.boardIndexReducer.boardReducer.fetchingTask,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};

export const TaskPage = connect(
  mapStateToProps,
  null,
)(TaskPageComponent);

export default TaskPage;
