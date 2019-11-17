import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { ITask } from 'stores/boardTask/Reducer'
import { Dialog, Icon } from '@blueprintjs/core';
import { TaskDetails } from './TaskDetails';

export const TaskItem = (props: {
  key: string;
  task: ITask;
  index: number;
}) => {

  const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false);

  return (
    <>
      <Draggable
        draggableId={props.task._id!}
        index={props.index}
      >
        {(provided, snapshot) => {
          const allowedProps = { ref: provided.innerRef }
          return (
            <div
              className={`ba b--black-20 br2 pa2 mb2
              ${snapshot.isDragging ? 'bg-light-green' : 'bg-white'}`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...allowedProps}
              onClick={() => setShowTaskDetailsDialog(!showTaskDetailsDialog)}
            >
              <h1 className="f6">{props.task.name}</h1>
              <div>
                <p
                  className="pa2"
                  style={{ backgroundColor: 'aliceblue' }}
                >
                  {props.task.description}
                </p>
              </div>
              <div className="flex justify-between">
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
              </div>
            </div>
          )
        }}
      </Draggable>
      {showTaskDetailsDialog && (
        <Dialog
          onClose={() => setShowTaskDetailsDialog(!showTaskDetailsDialog)}
          title="Task details"
          isOpen={showTaskDetailsDialog}
          style={{ background: '#fff', width: '900px' }}
          canOutsideClickClose={false}
        >
          <TaskDetails />
        </Dialog>
      )}
    </>
  )
}
