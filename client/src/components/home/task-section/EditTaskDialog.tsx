import { useEffect, useState } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';

import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// import { ICompanyTeamMembers } from 'stores/company/Reducer';
import {
  updateTask,
  getAllTaskStatusInProject,
} from 'stores/task/Actions';
import { priorityColor } from 'stores/UtilsActions';
import {
  checkError,
  composeValidators,
  maxValue,
  required,
} from 'components/final-form/utils';

import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import './Task.scss';
import {
  StyledButton,
  Container,
  ModalContainer,
  SimpleButton,
} from './TaskSection.styles';
import {
  errorToaster,
  successToaster,
} from 'components/toast/Toaster';
// import { SmallTextAvatar } from 'components/avatar/TextAvatar';
import { ITask, ITaskStatus } from 'stores/task/Reducer';
import { addTaskMember } from 'stores/taskMembers/Action';

interface IUpdateTaskDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  task: ITask;
}

interface IUpdateTaskDialogInternalProps
  extends IUpdateTaskDialogProps {
  getAllTaskStatusInProject: (args: {
    projectId: string;
    companyId: string;
  }) => void;
  taskStatusList: ITaskStatus[];
  errorOnUpdatingTask: string;
  updatingTask: boolean;
  updateTask: (args: {
    name: string;
    description: string;
    priority: number;
    statusId: string;
    dueDate: string;
    taskId: string;
    projectId: string;
    companyId: string;
    assignedMembers: string[];
  }) => void;
  addTaskMember: ({
    taskId,
    projectId,
    companyId,
    assignmembers,
  }: {
    taskId: string;
    projectId: string;
    companyId: string;
    assignmembers: string[];
  }) => void;
}

export interface IOption {
  value: string | number;
  label: string;
}

const EditTaskDialog = (props: IUpdateTaskDialogInternalProps) => {
  const { task } = props;

  //   const [selectedTeamMember, setSelectedTeamMember] = useState(
  //     [] as ICompanyTeamMembers[],
  //   );
  //   const [teamMembers, setTeamMembers]: any = useState([]);
  //   const [memberValue, setMemberValue]: any = useState([]);
  const [options] = useState<IOption[]>(
    priorityColor.map((pc) => {
      return {
        value: pc.code,
        label: pc.name,
      };
    }),
  );
  const [selectedOption, setSelectedOption] = useState(options[2]);
  const [updatingTask, setUpdatingTask] = useState(false);
  //   const [assignedUserError, setAssignedUserError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [memberLoading, setMemberLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const onSubmit = (values) => {
    // if (selectedTeamMember.length) {
    const modifiedTask = {
      ...values,
      priority: selectedOption.value,
      status: task.status._id,
      taskId: task._id,
      projectId: task.project._id,
      companyId: task.company._id,
    };
    //   const assignedMembers = memberValue.map(
    //     (member) => member.value,
    //   );
    props.updateTask(modifiedTask);
    //   props.addTaskMember({
    //     taskId: task._id,
    //     projectId: task.project._id,
    //     companyId: task.company._id,
    //     assignmembers: assignedMembers,
    //   });
    setUpdatingTask(true);
    setLoading(true);
    setSuccessMessage(`The task ${values.name} has been updated`);
    // } else setAssignedUserError(true);
  };

  const handleSelect = (selected: any) => {
    setSelectedOption(selected);
  };

  //   const handleMember = (selected: any) => {
  //     let x = difference(selected, memberValue);
  //     console.log(x);
  //     setMemberValue(selected);
  //     const memberList = selected.map((member: any) => ({
  //       _id: member.value,
  //       name: member.label,
  //     }));
  //     setSelectedTeamMember(memberList);
  //   };

  //   const mdfy = (members) => {
  //     const membersList = members?.map((m) => ({
  //       value: m?._id,
  //       label: m?.name,
  //     }));
  //     return membersList;
  //   };

  useEffect(() => {
    const priority = options.filter(
      (p) => p.value === task.priority,
    )[0];
    setSelectedOption(priority);
  }, []);

  //   useEffect(() => {
  //     const loadTeamMembers = async () => {
  //       const headers = formTokenConfig(task.company._id);
  //       const response = await tigrowApi.get(
  //         `/tasks/suggest-member?pid=${task.project._id}`,
  //         headers,
  //       );
  //       const modifiedTeamMembers = mdfy(response.data);
  //       setTeamMembers(modifiedTeamMembers);
  //       setMemberValue(
  //         task.members.map((m) =>
  //           modifiedTeamMembers.find(
  //             (tm) => tm.value === m.account._id,
  //           ),
  //         ),
  //       );
  //     };
  //     setMemberLoading(true);
  //     loadTeamMembers();
  //     setMemberLoading(false);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   useEffect(() => {
  //     if (selectedTeamMember.length) {
  //        setAssignedUserError(false);
  //     }
  //   }, [selectedTeamMember]);

  useEffect(() => {
    if (
      updatingTask === true &&
      props.updatingTask === false &&
      props.errorOnUpdatingTask !== ''
    ) {
      setLoading(false);
      setSuccessMessage('');
      // setErrorMessage(props.errorOnUpdatingTask);
      errorToaster(props.errorOnUpdatingTask);
      setUpdatingTask(false);
    }
    if (
      updatingTask === true &&
      props.updatingTask === false &&
      props.errorOnUpdatingTask === ''
    ) {
      setLoading(false);
      successToaster(successMessage);
      props.setShowDialog(false);
      // props.getAllUserTasks();
      setUpdatingTask(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingTask, props.updatingTask, props.errorOnUpdatingTask]);

  return (
    <ModalContainer>
      <Container>
        <Form
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            form,
            submitting,
            pristine,
            values,
            submitError,
            hasValidationErrors,
            ...rest
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-column justify-center ml-auto mr-auto">
                <Field<string>
                  name="name"
                  validate={composeValidators(
                    required,
                    maxValue(150),
                  )}
                  defaultValue={task.name}
                  render={({ input, meta }) => (
                    <div className="mb2">
                      <InputGroupFieldWithError
                        id="name"
                        value={input.value}
                        onChange={(e) => {
                          input.onChange(e);
                        }}
                        style={{
                          border: '0px',
                          boxShadow: 'none',
                          fontSize: '22px',
                          paddingLeft: '0px',
                        }}
                        error={
                          checkError(meta) &&
                          (meta.error || meta.submitError)
                        }
                        placeHolder="Task Name"
                        autoFocus={true}
                      />
                    </div>
                  )}
                />
                {/* <div className="row flex items-center w-100 mb3">
                  <Field<string>
                    name="assignmembers"
                    render={({ input, meta }) => (
                      <div className="flex items-center w-100">
                        <label className="text-width">
                          Assign to:
                          <div>
                            {assignedUserError && (
                              <small
                                style={{
                                  color: 'red',
                                  margin: '1rem 0rem',
                                }}
                              >
                                Required
                              </small>
                            )}
                          </div>
                        </label>

                        <Select
                          isMulti
                          className="w-100 react-select"
                          name="assignmembers"
                          isLoading={memberLoading}
                          value={memberValue}
                          options={teamMembers}
                          onChange={handleMember}
                          formatOptionLabel={(data) => (
                            <div className="flex items-center">
                              {typeof data.label === 'string' ? (
                                <SmallTextAvatar
                                  name={data.label.slice(0, 2)}
                                />
                              ) : null}
                              <span className="ml2">
                                {data.label}
                              </span>
                            </div>
                          )}
                        />
                      </div>
                    )}
                  />
                </div> */}
                <div className="duedate-priority-container">
                  <Field<string>
                    name="dueDate"
                    defaultValue={String(task.dueDate)}
                    validate={required}
                    render={({ input, meta }) => (
                      <div className="flex items-center w-100 mb3">
                        <label className="text-width">
                          Due Date:
                          <div>
                            {checkError(meta) && (
                              <small
                                className="mv3"
                                style={{
                                  color: 'red',
                                }}
                              >
                                {meta.error || meta.submitError}
                              </small>
                            )}
                          </div>
                        </label>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDateTimePicker
                            disablePast
                            inputVariant="outlined"
                            id="date-picker-dialog"
                            format="MM/dd/yyyy"
                            value={
                              input.value
                                ? new Date(input.value)
                                : null
                            }
                            onChange={input.onChange}
                            className="due-date-input due-date-subtask"
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            placeholder="Enter a date"
                            minDate={new Date()}
                            style={{ width: '250px' }}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    )}
                  />
                  <div className="flex items-center w-100 mb3">
                    <label className="ml2 mr2">Priority:</label>
                    <div className="w-100">
                      <Select
                        className="w-100 react-select"
                        options={options}
                        value={selectedOption}
                        onChange={handleSelect}
                      />
                    </div>
                  </div>
                </div>
                <Field<string>
                  name="description"
                  defaultValue={task.description}
                  render={({ input, meta }) => (
                    <div className="w-100 flex">
                      <label className="text-width">
                        Description:
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={input.value}
                        onChange={(e) => {
                          input.onChange(e);
                        }}
                        placeholder="Add some details about the task"
                      />
                    </div>
                  )}
                />
                <div className="flex justify-between mt3">
                  <StyledButton type="submit">
                    {loading ? (
                      <>
                        Updating Task{' '}
                        <CircularProgress className="ml1" size={12} />
                      </>
                    ) : (
                      'Update Task'
                    )}
                  </StyledButton>
                  <SimpleButton
                    onClick={() => {
                      props.setShowDialog(false);
                    }}
                    type="button"
                  >
                    Cancel
                  </SimpleButton>
                </div>
              </div>
            </form>
          )}
        />
      </Container>
    </ModalContainer>
  );
};

const mapStateToProps = (state: any) => ({
  errorOnUpdatingTask:
    state.taskIndexReducer.taskReducer.errorOnUpdatingTask,
  taskStatusList: state.taskIndexReducer.taskReducer.taskStatusList,
  updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
});

export default connect(mapStateToProps, {
  updateTask,
  getAllTaskStatusInProject,
  addTaskMember,
})(EditTaskDialog);
