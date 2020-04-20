import React, { useState, useEffect } from 'react';
import {
  ProgressBar,
  Button,
  Icon,
  Checkbox,
} from '@blueprintjs/core';
import { SubTaskCreator, SubTaskDelete } from './SubTaskEditor';
import { ISubTask } from 'stores/subtask/Reducer';
import { connect } from 'react-redux';
import {
  getAllSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from 'stores/subtask/Actions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Loading } from 'components/Loading';

interface ISubTaskViewInternalProps {
  subTaskList: ISubTask[];
  getAllSubTask: () => void;
  createSubTask: (subTask: ISubTask) => void;
  updateSubTask: (subTask: ISubTask) => void;
  deleteSubTask: (subTask: ISubTask) => void;
}

export const SubTaskViewPageComponent = (
  props: ISubTaskViewInternalProps & RouteComponentProps,
) => {
  const [showSubtaskForm, setShowSubTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subtask, setsubtask] = useState(Object);

  useEffect(() => {
    async function getAPI() {
      await props.getAllSubTask();
      await setLoading(false);
    }
    getAPI();
  }, []);
  return (
    <>
      {loading === false ? (
        <div className="fl w-100">
          <div className="mt3">
            <div className="flex">
              <h1 className="f6 flex-auto">SubTask</h1>
              {props.subTaskList.length > 0 && (
                <h1 className="f6 blue">
                  {Math.floor(
                    (props.subTaskList.filter(
                      (list) => list.done === true,
                    ).length /
                      props.subTaskList.length) *
                      100,
                  )}
                  %
                </h1>
              )}
            </div>
            {props.subTaskList.length > 0 && (
              <div>
                <ProgressBar
                  stripes={false}
                  intent="primary"
                  value={
                    props.subTaskList.filter(
                      (list) => list.done === true,
                    ).length / props.subTaskList.length
                  }
                />
                <div
                  className="mt3 mb3"
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                  }}
                >
                  {props.subTaskList.map((list) => (
                    <div className="flex justify-between">
                      <Checkbox
                        className="ws-break"
                        value={list._id}
                        checked={list.done}
                        label={list.name}
                        large={true}
                        style={{
                          textDecoration: list.done
                            ? 'line-through'
                            : 'none',
                        }}
                        onChange={(event: any) => {
                          const subtaskData = {
                            _id: event.target.value,
                            done: event.target.checked,
                          };
                          props.updateSubTask(subtaskData);
                        }}
                      />
                      <div className="flex">
                        <div>
                          <Icon
                            className="fr mv3 pointer mr4 mv0"
                            style={{
                              marginTop: 0,
                              color: 'lightsteelblue',
                            }}
                            icon="edit"
                            onClick={async () => {
                              await setsubtask(list);
                              setShowSubTaskForm(true);
                            }}
                          />
                        </div>

                        <SubTaskDelete
                          subTask={list}
                          deleteSubTask={props.deleteSubTask}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {showSubtaskForm && (
            <SubTaskCreator
              showSubtaskForm={showSubtaskForm}
              subtask={subtask}
              setsubtask={setsubtask}
              setShowSubTaskForm={(e) =>
                setShowSubTaskForm(!showSubtaskForm)
              }
            />
          )}
          <div>
            <Button
              type="submit"
              text="Add SubTask"
              className="grow h2 pointer dib"
              style={{
                background: '#0FA3A3',
                outline: 'none',
                color: 'white',
                borderRadius: '0px',
                boxShadow: 'none',
              }}
              onClick={() => setShowSubTaskForm(true)}
              disabled={showSubtaskForm}
            />
          </div>
        </div>
      ) : (
        <div
          style={{ bottom: 0, position: 'absolute', left: '150px' }}
        >
          <Loading />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    subTaskList: state.boardIndexReducer.subTaskReducer.subTaskList,
  };
};

export const SubTaskView = connect(mapStateToProps, {
  getAllSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
})(withRouter(SubTaskViewPageComponent));
