import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { ProgressBar } from '@blueprintjs/core/lib/esm/components/progress-bar/progressBar';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { IconNames } from '@blueprintjs/icons';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import { ISubTask } from 'stores/subtask/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { ITask } from 'stores/task/Reducer';
import { deleteTask, updateTask } from 'stores/task/Actions';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Loading } from 'components/Loading';
import SubTaskMemberIcon from './SubTaskMemberIcon';
import { SubTaskCreator, SubTaskDelete } from './SubTaskEditor';
import AddSubtaskMember from './AddMember';
import DueDateEditor from './DueDateEditor';
import { deleteMember } from 'stores/taskMembers/Action';

interface ISubTaskViewInternalProps {
  subTaskList: ITask[];
  company?: ICompany;
  currentTask: ITask;
  updateTask: (payload) => void;
  deleteTask: (payload: {
    taskId: string;
    projectId: string;
    companyId: string;
    type: string;
    taskList: string[];
  }) => void;
  deleteMember: (payload: {
    taskId: string;
    projectId: string;
    companyId: string;
    assignedMemberId: string;
  }) => void;
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
  const [subtask, setSubtask] = useState(Object);
  const [membersPopover, setMembersPopover] = useState({
    _id: '',
    open: false,
  });
  const [expandSubtask, setExpandSubtask] = useState<boolean>(false);
  // const [dueDatePopover, setDueDatePopover] = useState({
  //   _id: '',
  //   open: false,
  // });

  const toggleMembersPopover = (id: string) => {
    setMembersPopover({ _id: id, open: !membersPopover.open });
  };

  // const toggleDueDatePopover = (id: string) => {
  //   setDueDatePopover({ _id: id, open: !dueDatePopover.open });
  // };

  return (
    <>
      {props.loading === false ? (
        <div className="w-100">
          <div className="flex justify-between items-center">
            <h1
              style={{
                color: '#323030',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '28px',
              }}
              className="flex items-center"
            >
              {expandSubtask ? (
                <ArrowDropDownIcon
                  className="mr1"
                  onClick={() => setExpandSubtask(false)}
                />
              ) : (
                <ArrowRightIcon
                  className="mr1"
                  onClick={() => setExpandSubtask(true)}
                />
              )}
              {t('app.project.Project-boards.Subtask')} (
              {props.subTaskList?.length || 0})
            </h1>
            <Icon
              style={{
                color: '#323030',
              }}
              icon={IconNames.PLUS}
              iconSize={20}
              className="pointer"
              onClick={() => {
                setSubtask(null);
                setShowSubTaskForm(true);
              }}
            />
          </div>
          <div className="flex justify-end">
            {expandSubtask && props.subTaskList?.length > 0 && (
              <h1 className="f6 blue">
                {Math.floor(
                  (props.subTaskList.filter(
                    (list) => list.isCompleted === true,
                  ).length /
                    props.subTaskList.length) *
                    100,
                )}
                %
              </h1>
            )}
          </div>
          {showSubtaskForm && (
            <Dialog
              isOpen={showSubtaskForm}
              onClose={() => setShowSubTaskForm(!showSubtaskForm)}
              canEscapeKeyClose={true}
              canOutsideClickClose={true}
              style={{
                background: '#fff',
              }}
            >
              <SubTaskCreator
                showSubtaskForm={showSubtaskForm}
                subtask={subtask}
                setsubtask={setSubtask}
                setShowSubTaskForm={(e) =>
                  setShowSubTaskForm(!showSubtaskForm)
                }
              />
            </Dialog>
          )}
          {expandSubtask ? (
            <div className="mr2">
              {props.subTaskList && props.subTaskList.length > 0 && (
                <div>
                  <ProgressBar
                    stripes={false}
                    intent="primary"
                    value={
                      props.subTaskList.filter(
                        (list) => list.isCompleted === true,
                      ).length / props.subTaskList.length
                    }
                  />
                  <div className="mt3 mb3">
                    {props.subTaskList.map((subTask: ITask) => (
                      <Accordion defaultExpanded key={subTask._id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-label="Expand"
                          aria-controls="additional-actions3-content"
                          id="additional-actions3-header"
                        >
                          <div className="flex items-center justify-between w-100">
                            <FormControlLabel
                              aria-label="Mark As Done"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              onFocus={(event) =>
                                event.stopPropagation()
                              }
                              control={
                                <Checkbox
                                  checked={subTask.isCompleted}
                                  color="primary"
                                  onChange={(event: any) => {
                                    props.updateTask({
                                      taskId: subTask._id,
                                      companyId: subTask.company?._id,
                                      projectId: subTask.project?._id,
                                      parentTask: subTask.parentTask,
                                      isCompleted:
                                        event.target.checked,
                                    });
                                  }}
                                />
                              }
                              label={subTask.name}
                            />
                            <div className="flex items-center">
                              <div
                                className={
                                  subTask.members &&
                                  subTask.members?.length > 0
                                    ? 'mr3 flex'
                                    : 'dn'
                                }
                                style={{ width: 'max-content' }}
                              >
                                {subTask.members &&
                                  subTask.members.map((subMember) => (
                                    <SubTaskMemberIcon
                                      key={subMember._id}
                                      deleteSubTaskMember={
                                        props.deleteMember
                                      }
                                      subTaskId={subTask._id}
                                      deletingMember={
                                        props.deletingMember
                                      }
                                      errorOnDeletingMember={
                                        props.errorOnDeletingMember
                                      }
                                      company={props.company}
                                      member={subMember.account}
                                    />
                                  ))}
                              </div>
                              <div>
                                {props.company ? (
                                  <Popover
                                    isOpen={
                                      membersPopover._id ===
                                        subTask._id &&
                                      membersPopover.open
                                    }
                                    position="right"
                                    content={
                                      <div className="pa3 cf bg-white">
                                        <div>
                                          <AddSubtaskMember
                                            setMembersPopover={
                                              setMembersPopover
                                            }
                                            id={
                                              subTask._id
                                                ? subTask._id
                                                : ''
                                            }
                                          />
                                        </div>
                                      </div>
                                    }
                                    target={
                                      <Icon
                                        className="fr pointer mr3 pt1"
                                        style={{
                                          marginTop: 0,
                                          color: 'lightsteelblue',
                                        }}
                                        icon="people"
                                        onClick={() => {
                                          toggleMembersPopover(
                                            subTask._id
                                              ? subTask._id
                                              : '',
                                          );
                                        }}
                                      />
                                    }
                                  />
                                ) : undefined}
                              </div>
                              <div className="mr3">
                                <DueDateEditor
                                  dueDate={
                                    subTask.dueDate || undefined
                                  }
                                  subTask={subTask}
                                />
                              </div>
                              <div>
                                <Icon
                                  className="fr pointer mr3"
                                  style={{
                                    marginTop: 0,
                                    color: 'lightsteelblue',
                                  }}
                                  icon="edit"
                                  onClick={async () => {
                                    setSubtask(subTask);
                                    setShowSubTaskForm(true);
                                  }}
                                />
                              </div>

                              <div className="pt2">
                                <SubTaskDelete
                                  subTask={subTask}
                                  deleteSubTask={props.deleteTask}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography color="textSecondary">
                            {subTask.description
                              ? subTask.description
                              : 'No description Provided'}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
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

const mapStateToProps = (state: any) => {
  return {
    subTaskList:
      state.taskIndexReducer.taskReducer.currentTask.subTasks,
    deletingMember:
      state.taskIndexReducer.subTaskReducer.deletingMember,
    errorOnDeletingMember:
      state.taskIndexReducer.subTaskReducer.errorOnDeletingMember,
    loading: state.taskIndexReducer.subTaskReducer.fetchingSubTask,
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    fetchingTask: state.taskIndexReducer.taskReducer.fetchingTask,
    company: state.companyReducer.currentCompany,
  };
};

export const SubTaskView = connect(mapStateToProps, {
  updateTask,
  deleteTask,
  deleteMember,
})(withRouter(SubTaskViewPageComponent));
