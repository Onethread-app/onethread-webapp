import React, { useState } from 'react';
import dueDate from 'resources/images/dueDate.png';
import addMembers from 'resources/images/addMembers.png';
import attachFiles from 'resources/images/attachFiles.png';
import priority from 'resources/images/priority.png';

import { ITask } from 'stores/board/Reducer';
import { FormGroup, Button, EditableText, Popover, FileInput } from '@blueprintjs/core';
import { InputGroupField } from 'components/fields/InputGroupField';
import { connect } from 'react-redux';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
}

const TaskDetailsComponent = (props: TaskDetailsInternalProps) => {

  const [nameEdit, setNameEdit] = useState(false);

  return (
    <div className="fl w-100">
      <div className="fl w-70">
        <div className="fl w-100 b">
          <FormGroup
            className="b"
            label={<span className="f7">Title</span>}
            labelFor="task_title"
          >
            {nameEdit === true ?
              <div className="flex">
                <InputGroupField
                  id="task_title"
                  value={props.currentTask!.name}
                // value="Demo task name"
                // onChange={handleChange('name')}
                />
                <Button
                  text="Save"
                  className="pointer ml2"
                  onClick={() => setNameEdit(false)}
                />
              </div>
              :
              <>
                <label>{props.currentTask!.name}</label>
                {/* <label>Demo task name</label> */}
                <p className="mb0 f7">
                  <Button
                    text={
                      <span
                        className="f7"
                        style={{ color: '#0fa3a3' }}
                      >
                        Edit
                              </span>
                    }
                    small={true}
                    minimal={true}
                    className="pointer"
                    onClick={() => setNameEdit(true)}
                  />
                </p>
              </>
            }
          </FormGroup>
        </div>
        <div className="fl w-100">
          <div className="flex">
            <div className="white ph2 br2" style={{ background: '#FDB64E' }}>
              <p className="fw7 pt2">In Progress</p>
            </div>
            <p className="pt2 pl3 fw6">5 days remaining</p>
          </div>
          <h1 className="f6">Description</h1>
          <EditableText multiline={true} minLines={2} value="AWS registration. we want to integrate into cloud aws." />
        </div>
        <div className="fl w-100">
          <div className="mt2">
            <h1 className="f6">Assigned to</h1>
            <div className="pa1 dib">
              <img
                src="http://tachyons.io/img/logo.jpg"
                className="br2 h2 w2" alt="avatar" />
            </div>
            <div className="pa1 dib">
              <img
                src="http://tachyons.io/img/logo.jpg"
                className="br2 h2 w2" alt="avatar" />
            </div>
          </div>
        </div>

      </div>
      <div className="fl w-30">
        {/* <div className="mt2 dt">
                  <h1 className="f6">Due Date</h1>
                  <DateInput
                    formatDate={date => date.toLocaleDateString()}
                    parseDate={str => new Date(str)}
                    placeholder={"M/D/YYYY"}
                  />
                </div> */}
        {/* <div className="mt3 dt">
                  <h1 className="f6">Attach Files</h1>
                  <p
                    className="pa2 br3"
                    style={{ backgroundColor: "#F2FAFA" }}
                  >
                    company.tsx
                  </p>
                </div> */}

        <div className="fl w-100">
          <div className="fr">
            <div>
              <Popover
                content={
                  <div className="pa3 cf bg-white">
                    <h1 className="f5">Due Date</h1>
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
                  <div className="flex br2 mb2 pt2 ph3" style={{ background: '#C1DEDE', width: '150px' }}>
                    <img style={{ height: '15px' }} src={dueDate} />
                    <p className="pl3 f7">Due Date</p>
                  </div>
                }
              />
            </div>
            <div>
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
                  <div className="flex br2 mb2 pt2 ph3" style={{ background: '#C1DEDE', width: '150px' }}>
                    <img style={{ height: '15px' }} src={attachFiles} />
                    <p className="pl3 f7">Attach Files</p>
                  </div>
                }
              />
            </div>
            <div>
              <Popover
                content={
                  <div className="pa3 cf bg-white">
                    <h1 className="f5">Members</h1>
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
                  <div className="flex br2 mb2 pt2 ph3" style={{ background: '#C1DEDE', width: '150px' }}>
                    <img style={{ height: '15px' }} src={addMembers} />
                    <p className="pl3 f7">Members</p>
                  </div>
                }
              />
            </div>
            <div>
              <Popover
                content={
                  <div className="pa3 cf bg-white">
                    <h1 className="f5">Priority</h1>
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
                  <div className="flex br2 mb2 pt2 ph3" style={{ background: '#C1DEDE', width: '150px' }}>
                    <img style={{ height: '15px' }} src={priority} />
                    <p className="pl3 f7">Priority</p>
                  </div>
                }
              />
            </div>
          </div>
          {/* <div className="fr">
                    <Popover
                      content={<AddTeamMemberForm />}
                      target={
                        <Button
                          className="outline-0 bp3-minimal grow mb2"
                          text="Members"
                          icon="people"
                          style={{ backgroundColor: "#c1dede" }}
                        />
                      }
                    />
                  </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardReducer.currentTask,
  };
};

export const TaskDetails = connect(mapStateToProps, null)(TaskDetailsComponent);
