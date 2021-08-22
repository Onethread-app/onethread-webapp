import React from 'react';
import { connect } from 'react-redux';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { ActivityView } from './activity/ActivityView';
import { ITask, TaskBoard } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { TaskDetails } from './taskDetails';
import TaskInfoViewComponent from './TaskInfoView/Index';
import { IProject } from 'stores/project/Reducer';
import { Loading } from 'components/Loading';

interface TaskInternalProps {
  currentTask: ITask;
  currentBoard: TaskBoard;
  company: ICompany;
  currentProject: IProject;
  fetchingTask;
}

const TaskPageComponent = (props: TaskInternalProps) => {
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
            <ActivityView />
          </div>
          <div
            className="w-100 w-30-l flex justify-center pa4"
            style={{ background: '#F6F6F6' }}
          >
            <TaskInfoViewComponent />
          </div>
        </div>
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
  };
};

export const TaskPage = connect(
  mapStateToProps,
  null,
)(TaskPageComponent);

export default TaskPage;
