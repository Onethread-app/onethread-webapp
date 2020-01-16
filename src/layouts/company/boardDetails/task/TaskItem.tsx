import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { isEmpty } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { TaskBoard, ITask } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { getSelectedTaskDetails } from 'stores/board/Actions';

interface TaskItemProps {
  key: string;
  task: ITask;
  index: number;
}

interface TaskItemInternalProps extends TaskItemProps {
  currentBoard?: TaskBoard;
  company?: CompanyModel;
  getSelectedTaskDetails: (task: string | undefined) => Promise<any>;
}

const TaskItemComponent = (props: TaskItemInternalProps & RouteComponentProps) => {

  return (
    <>
      <Draggable
        draggableId={props.task._id!}
        index={props.index}
      >
        {(provided, snapshot) => {
          const allowedProps = { ref: provided.innerRef };
          return (
            <div
              className={`ba b--black-20 br2 pa2 mb2
              ${snapshot.isDragging ? 'bg-light-green' : 'bg-white'}`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...allowedProps}
              onClick={async () => {
                const responseTask = await props.getSelectedTaskDetails(props.task._id);
                if (responseTask._id) {
                  props.history.push(`/company/${props.company!.name}/board/${props.currentBoard!._id}/task/${props.task._id}`);
                }
              }}
            >
              <h1 className="f6 ws-break">{props.task.name}</h1>
              {isEmpty(props.task.description) === false ?
                <div>
                  <p
                    className="pa2 ws-break"
                    style={{ backgroundColor: 'aliceblue' }}
                  >
                    {props.task.description}
                  </p>
                </div>
                : undefined}
              {/* <div className="flex justify-between">
                <div className="flex ">
                  <div className="cf mr3" >
                    <Icon className="dib mr1" icon="link" iconSize={14} />
                    <h1 className="f7 dib">3</h1>
                  </div>
                  <div className="cf mr3">
                    <Icon className="dib mr1" icon="tick" iconSize={14} />
                    <h1 className="f7 dib">3</h1>
                  </div>
                  <div className="cf mr3">
                    <Icon className="dib mr1" icon="people" iconSize={14} />
                    <h1 className="f7 dib">3</h1>
                  </div>
                </div>
                <div className="mr0">
                  <p className="bg-washed-red ph2 pv1 red br2 mv1">urgent</p>
                </div>
              </div> */}
            </div>
          );
        }}
      </Draggable>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentBoard: state.taskManagementReducer.boardReducer.currentBoard,
    company: state.companyReducer.currentCompany
  };
};

export const TaskItem = connect(mapStateToProps, { getSelectedTaskDetails })(withRouter(TaskItemComponent));
