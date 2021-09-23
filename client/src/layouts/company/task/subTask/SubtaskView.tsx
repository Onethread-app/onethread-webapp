import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { ProgressBar } from '@blueprintjs/core/lib/esm/components/progress-bar/progressBar';
import { Checkbox } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { IconNames } from '@blueprintjs/icons';
// import moment from 'moment';

import { ISubTask } from 'stores/subtask/Reducer';
import { ICompany } from 'stores/company/Reducer';
import {
  deleteSubTaskMember,
  IPayloadForDeletingMember,

  getAllSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from 'stores/subtask/Actions';

import { Loading } from 'components/Loading';
import SubTaskMemberIcon from './SubTaskMemberIcon';
import { SubTaskCreator, SubTaskDelete } from './SubTaskEditor';
import AddSubtaskMember from './AddMember';
import DueDateEditor from './DueDateEditor';

interface ISubTaskViewInternalProps {
  subTaskList: ISubTask[];
  company?: ICompany;
  currentTaskId: string;
  getAllSubTask: () => void;
  createSubTask: (subTask: ISubTask) => void;
  updateSubTask: (subTask: ISubTask) => void;
  deleteSubTask: (subTask: ISubTask) => void;
  deleteSubTaskMember: (payload: IPayloadForDeletingMember) => void;
  deletingMember: boolean;
  errorOnDeletingMember: string;
  loading: boolean;
  fetchingTask: boolean;
}

export const SubTaskViewPageComponent = (
  props: ISubTaskViewInternalProps & RouteComponentProps,
) => {
  const { t } = useTranslation();
  const [showSubtaskForm, setShowSubTaskForm] = useState(false);
  const [subtask, setsubtask] = useState(Object);
  const [membersPopover, setMembersPopover] = useState({
    _id: '',
    open: false,
  });
  // const [dueDatePopover, setDueDatePopover] = useState({
  //   _id: '',
  //   open: false,
  // });

  useEffect(() => {
    async function getAPI() {
      if (props.fetchingTask === false) {
        await props.getAllSubTask();
      }
    }
    getAPI();
  }, [props.fetchingTask, props.currentTaskId]);

  const toggleMembersPopover = (id: string) => {
    setMembersPopover({ _id: id, open: !membersPopover.open });
  };

  // const toggleDueDatePopover = (id: string) => {
  //   setDueDatePopover({ _id: id, open: !dueDatePopover.open });
  // };

  return (
    <>
      {props.loading === false ? (
        <div className='w-100'>
          <div className='flex justify-between items-center'>
            <h1
              style={{
                color: '#323030',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '28px',
              }}
            >
              {t('app.project.Project-boards.Subtask')}
              {' '}
              (
              {props.subTaskList.length}
              )
            </h1>
            <Icon
              style={{
                color: '#323030',
              }}
              icon={IconNames.PLUS}
              iconSize={20}
              className='pointer'
              onClick={() => setShowSubTaskForm(true)}
            />
          </div>
          <div className='flex justify-end'>
            {props.subTaskList.length > 0 && (
              <h1 className='f6 blue'>
                {Math.floor(
                  (props.subTaskList.filter(
                    (list) => list.done === true,
                  ).length
                    / props.subTaskList.length)
                    * 100,
                )}
                %
              </h1>
            )}
          </div>
          {showSubtaskForm && (
            <Dialog
              isOpen={showSubtaskForm}
              onClose={() => setShowSubTaskForm(!showSubtaskForm)}
              canEscapeKeyClose
              canOutsideClickClose
              style={{
                background: '#fff',
              }}
            >
              <SubTaskCreator
                showSubtaskForm={showSubtaskForm}
                subtask={subtask}
                setsubtask={setsubtask}
                setShowSubTaskForm={(e) => setShowSubTaskForm(!showSubtaskForm)}
              />
            </Dialog>
          )}
          {props.subTaskList.length > 0 && (
            <div>
              <ProgressBar
                stripes={false}
                intent='primary'
                value={
                  props.subTaskList.filter(
                    (list) => list.done === true,
                  ).length / props.subTaskList.length
                }
              />
              <div className='mt3 mb3'>
                {props.subTaskList.map((subTask) => (
                  <div
                    className='flex justify-between items-center'
                    key={subTask._id}
                  >
                    <Checkbox
                      className='ws-break'
                      value={subTask._id}
                      checked={subTask.done}
                      label={subTask.name}
                      large
                      style={{
                        textDecoration: subTask.done
                          ? 'line-through'
                          : 'none',
                        minWidth: '220px',
                      }}
                      onChange={(event: any) => {
                        const subtaskData = {
                          _id: event.target.value,
                          done: event.target.checked,
                        };
                        props.updateSubTask(subtaskData);
                      }}
                    />
                    <div className='flex items-center'>
                      <div
                        className={
                          subTask.assignedMembers
                          && subTask.assignedMembers?.length > 0
                            ? 'mr3 flex'
                            : 'dn'
                        }
                        style={{ width: 'max-content' }}
                      >
                        {subTask.assignedMembers
                          && subTask.assignedMembers.map((subMember) => (
                            <SubTaskMemberIcon
                              key={subMember._id}
                              deleteSubTaskMember={
                                props.deleteSubTaskMember
                              }
                              member={subMember}
                              subTaskId={subTask._id}
                              deletingMember={props.deletingMember}
                              errorOnDeletingMember={
                                props.errorOnDeletingMember
                              }
                              company={props.company}
                            />
                          ))}
                      </div>
                      {/* <div
                        className={
                          subTask.dueDate
                            ? ' flex items-start mr3'
                            : 'dn'
                        }
                        style={{ width: 'max-content' }}
                      >
                        <span
                          className="bp3-tag"
                          style={{
                            backgroundColor:
                              moment() > moment(subTask.dueDate)
                                ? 'red'
                                : 'lightsteelblue',
                            color:
                              moment() > moment(subTask.dueDate)
                                ? '#fff'
                                : 'inherit',
                          }}
                        >
                          {moment(subTask.dueDate).fromNow()}
                        </span>
                      </div> */}
                      <div>
                        {props.company ? (
                          <Popover
                            isOpen={
                              membersPopover._id === subTask._id
                              && membersPopover.open
                            }
                            position='right'
                            content={(
                              <div className='pa3 cf bg-white'>
                                <div>
                                  <AddSubtaskMember
                                    setMembersPopover={
                                      setMembersPopover
                                    }
                                    id={
                                      subTask._id ? subTask._id : ''
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            target={(
                              <Icon
                                className='fr pointer mr3 pt1'
                                style={{
                                  marginTop: 0,
                                  color: 'lightsteelblue',
                                }}
                                icon='people'
                                onClick={() => {
                                  toggleMembersPopover(
                                    subTask._id ? subTask._id : '',
                                  );
                                }}
                              />
                            )}
                          />
                        ) : undefined}
                      </div>
                      {/* <div>
                        <Popover
                          isOpen={
                            dueDatePopover._id === subTask._id &&
                            dueDatePopover.open
                          }
                          position="right"
                          content={
                            <div className="pa3 cf bg-white">
                              <div>
                                <DueDateEditor
                                  setDueDatePopover={
                                    setDueDatePopover
                                  }
                                  dueDate={subTask.dueDate}
                                  subTask={subTask}
                                  dueDatePopover={dueDatePopover}
                                />
                              </div>
                            </div>
                          }
                          target={
                            <Icon
                              className="fr mv3 pointer mr4 mv0"
                              style={{
                                marginTop: 0,
                                color: 'lightsteelblue',
                              }}
                              icon="calendar"
                              onClick={() => {
                                toggleDueDatePopover(
                                  subTask._id ? subTask._id : '',
                                );
                              }}
                            />
                          }
                        />
                      </div> */}
                      <div className='mr3'>
                        <DueDateEditor
                          dueDate={subTask.dueDate}
                          subTask={subTask}
                        />
                      </div>
                      <div>
                        <Icon
                          className='fr pointer mr3'
                          style={{
                            marginTop: 0,
                            color: 'lightsteelblue',
                          }}
                          icon='edit'
                          onClick={async () => {
                            await setsubtask(subTask);
                            setShowSubTaskForm(true);
                          }}
                        />
                      </div>

                      <div className='pt2'>
                        <SubTaskDelete
                          subTask={subTask}
                          deleteSubTask={props.deleteSubTask}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            bottom: 10,
            position: 'absolute',
            margin: '0 auto',
            width: '50%',
          }}
        >
          <Loading />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  subTaskList: state.taskIndexReducer.subTaskReducer.subTaskList,
  deletingMember:
      state.taskIndexReducer.subTaskReducer.deletingMember,
  errorOnDeletingMember:
      state.taskIndexReducer.subTaskReducer.errorOnDeletingMember,
  loading: state.taskIndexReducer.subTaskReducer.fetchingSubTask,
  currentTaskId: state.taskIndexReducer.taskReducer.currentTask._id,
  fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
  company: state.companyReducer.currentCompany,
});

export const SubTaskView = connect(mapStateToProps, {
  getAllSubTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  deleteSubTaskMember,
})(withRouter(SubTaskViewPageComponent));
