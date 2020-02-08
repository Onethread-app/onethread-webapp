import React, { useState } from 'react';
// import attachFiles from 'resources/images/attachFiles.png';
import { ITask } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { TaskTitleView } from './TaskTitle/TaskTitleView';
import { TaskDescriptionView } from './TaskDescription/TaskDescriptionView';
import { Popover } from '@blueprintjs/core';
import { DueDateEditor } from './DueDate/DueDateEditor';
import { DueDateView } from './DueDate/DueDateView';
import { AssignedMembersView } from './AssignedMembers/AssignedMembersView';
import { AssignedMembersEditor } from './AssignedMembers/AssignedMembersEditor';
import dueDate from 'resources/images/dueDate.png';
import addMembers from 'resources/images/addMembers.png';
import priority from 'resources/images/priority.png';
import { PriorityView } from './Priority/PriorityView';
import { PriorityEditor } from './Priority/PriorityEditor';
import moment from 'moment';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
}

const TaskDetailsComponent = (props: TaskDetailsInternalProps) => {
  const [datePopover, setDatePopover] = useState(false);
  const [membersPopover, setMembersPopover] = useState(false);
  const [priorityPopover, setPriorityPopover] = useState(false);

  return (
    <div className="fl w-100">
      <div className="fl w-100">
        <div className="fl w-100">
          <TaskTitleView />
        </div>
      </div>
      <p style={{ color: '#303030', fontSize: '12px' }}>
        Created by {props.currentTask!.createdBy} on {moment(props.currentTask!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
      </p>
      <div className="fl w-70-ns w-100">
        <div className="fl w-100">
          <div className="flex-ns">
            <div className="white ph2 br2 h-100" style={{ background: '#FDB64E' }}>
              <p className="fw7 pt2-ns overflow-hidden"
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px'
                }}
              >{props.currentTask!.currentColumnName}</p>
            </div>
            {
              props.currentTask!.dueDate && (
                <>
                  {Math.ceil(moment(props.currentTask!.dueDate).diff(moment(), 'days', true)) === 0 ?
                    <p className="pt2 pl3 fw6 red">Deadline ends today</p> :
                    Math.ceil(moment(props.currentTask!.dueDate).diff(moment(), 'days', true)) < 0 ?
                      <p className="pt2 pl3 fw6 red">Expired</p> :
                      <p className="pt2 pl3 fw6">
                        {Math.ceil(moment(props.currentTask!.dueDate).diff(moment(), 'days', true))} days remaining
                    </p>
                  }
                </>
              )
            }
          </div>
          <div className="mt2">
            <AssignedMembersView />
          </div>
          <div>
            <TaskDescriptionView />
          </div>
          <div className="mt3">
            <div className="fl w-100 w-50-ns">
              <DueDateView />
            </div>
            <div className="fl w-100 w-50-ns">
              <PriorityView />
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div className="fl w-30-ns w-100">
        {/* <div className="mt3 dt">
                  <h1 className="f6">Attach Files</h1>
                  <p
                    className="pa2 br3"
                    style={{ backgroundColor: "#F2FAFA" }}
                  >
                    company.tsx
                  </DueDateView>
                </div> */}
        <div className="fl w-100">
          <div className="fr-ns fl">
            <div>
              <Popover
                isOpen={datePopover}
                content={
                  <div className="pa3 cf bg-white">
                    {/* <h1 className="f5">Due Date</h1> */}
                    <DueDateEditor setDatePopover={setDatePopover} />
                  </div>
                }
                target={
                  <div
                    className="flex br2 mb2 pt2 ph3 pointer"
                    style={{ background: '#C1DEDE', width: '130px' }}
                    onClick={() => setDatePopover(true)}>
                    <img style={{ height: '15px' }} src={dueDate} />
                    <p className="pl3 f7">Due Date</p>
                  </div>
                }
              />
            </div>
            {/* <div>
              <Popover
                content={
                  <div className="pa3 cf bg-white">
                    <h1 className="f5">Attach Files</h1>
                    <FileInput text="Choose file..." />
                    <div>
                      <Button
                        type="submit"
                        text="Attach"
                        className="grow h2 pointer w-40 fr mt2"
                        style={{ background: '#0fa3a3', outline: 'none', color: 'white', boxShadow: 'none' }}
                      />
                    </div>
                  </div>
                }
                target={
                  <div className="flex br2 mb2 pt2 ph3" style={{ background: '#C1DEDE', width: '140px' }}>
                    <img style={{ height: '15px' }} src={attachFiles} />
                    <p className="pl3 f7">Attach Files</p>
                  </div>
                }
              />
            </div> */}
            <div>
              <Popover
                isOpen={membersPopover}
                content={
                  <div className="pa3 cf bg-white">
                    {/* <h1 className="f5">Members</h1> */}
                    <div>
                      <AssignedMembersEditor setMembersPopover={setMembersPopover} />
                    </div>
                  </div>
                }
                target={
                  <div
                    className="flex br2 mb2 pt2 ph3 pointer"
                    style={{ background: '#C1DEDE', width: '130px' }}
                    onClick={() => setMembersPopover(true)}
                  >
                    <img style={{ height: '15px' }} src={addMembers} />
                    <p className="pl3 f7">Members</p>
                  </div>
                }
              />
            </div>
            <div>
              <Popover
                isOpen={priorityPopover}
                content={
                  <div className="pa4 cf bg-white" style={{ width: '300px' }}>
                    <PriorityEditor setPriorityPopover={setPriorityPopover} />
                  </div>
                }
                target={
                  <div className="flex br2 mb2 pt2 ph3 pointer"
                    onClick={() => setPriorityPopover(true)}
                    style={{ background: '#C1DEDE', width: '130px' }}>
                    <img style={{ height: '15px' }} src={priority} />
                    <p className="pl3 f7">Priority</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
  };
};

export const TaskDetails = connect(mapStateToProps, null)(TaskDetailsComponent);
