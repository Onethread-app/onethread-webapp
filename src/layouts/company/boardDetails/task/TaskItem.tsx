import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { isEmpty } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { TaskBoard, ITask } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { getSelectedTaskDetails } from 'stores/board/Actions';

import attach from './../../../../resources/images/attach.png';
import complete from './../../../../resources/images/complete.png';

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
              className={`ba b--black-20 br2 mb2
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
              <div
                className="br3"
                style={{
                  borderLeft: '4px solid rgb(97, 163, 250)',
                  borderRadius: '3px',
                  height: '40px',
                  marginLeft: '-2px'
                }}>
                <h1 className="f6 ws-break pt2 pl2">{props.task.name}</h1>
              </div>
              {isEmpty(props.task.description) === false ?
                <div>
                  <p
                    className="ph2 pt2 ws-break"
                  >
                    {props.task.description}
                  </p>
                </div>
                : undefined}
              <div className="flex justify-between pa2">
                <div className="flex pt1">
                  <div className="cf flex" style={{ height: '30px', width: '50px' }}>
                    <img
                      style={{ height: '25px', width: '25px' }}
                      src={attach}
                    />
                    <div className="pt1">
                      <p className="f7 dib">3</p>
                    </div>
                  </div>
                  <div className="cf flex" style={{ height: '30px', width: '50px' }}>
                    <img
                      style={{ height: '25px', width: '25px' }}
                      src={complete}
                    />
                    <div className="pt1">
                      <p className="f7 dib">3</p>
                    </div>
                  </div>
                </div>
                <div className="mr0 pt1">
                  <p className="bg-washed-red ph2 pv1 red br2 mv1"
                    style={{ fontSize: '.8rem' }}
                  >10 days left</p>
                </div>
              </div>
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
