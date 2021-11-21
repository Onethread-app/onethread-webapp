import { useEffect, useState } from 'react';
import Creatable from 'react-select/creatable';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { tigrowApi } from 'config';
import { ICompanyTeamMembers } from 'stores/company/Reducer';
import {
  createTask,
  getAllTaskStatusInProject,
  getAllUserTasks,
} from 'stores/task/Actions';
import { saveTaskForm } from 'stores/taskForm/Actions';
import { priorityColor, formTokenConfig } from 'stores/UtilsActions';

import { getCompanyDetails } from 'stores/company/Actions';
import { createProjectInCompanySuccess } from 'stores/project/Actions';
import { IProject } from 'stores/project/Reducer';
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
import { returnErrorText } from 'helpers/HandleSagaErrors';
import {
  errorToaster,
  successToaster,
} from 'components/toast/Toaster';
import { SmallTextAvatar } from 'components/avatar/TextAvatar';
import { ITaskStatus } from 'stores/task/Reducer';

interface ICreateTaskDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICreateTaskDialogInternalProps
  extends ICreateTaskDialogProps {
  projectId: string;
  creatingTask: boolean;
  errorOnCreatingTask: string;
  createTask: (task: any) => void;
  saveTaskForm: any;
  previousData: any;
  projects: [];
  companies: any;
  getCompanyDetails: (arg0: string) => void;
  createProjectInCompanySuccess: (project: IProject) => void;
  getAllUserTasks: () => void;
  userProjects: IProject[];
  getAllTaskStatusInProject: (args: {
    projectId: string;
    companyId: string;
  }) => void;
  taskStatusList: ITaskStatus[];
}

export interface IOption {
  value: string | number;
  label: string;
}

const TaskDialog = (props: ICreateTaskDialogInternalProps) => {
  const [selectedTeamMember, setSelectedTeamMember] = useState(
    [] as ICompanyTeamMembers[],
  );
  const [teamMembers, setTeamMembers]: any = useState([]);
  const [memberValue, setMemberValue]: any = useState([]);
  const [options] = useState<IOption[]>(
    priorityColor.map((pc) => {
      return {
        value: pc.code,
        label: pc.name,
      };
    }),
  );
  const [selectedOption, setSelectedOption] = useState(options[2]);
  const [creatingTask, setCreatingTask] = useState(false);
  const [company, setCompany] = useState<any>({});
  const [assignedUserError, setAssignedUserError] = useState(false);
  const [assignedProjectError, setAssignedProjectError] =
    useState(false);
  const [assignedCompanyError, setAssignedCompanyError] =
    useState(false);
  const [data, setData] = useState<any>({});
  const [defaultValues, setDefaultValues] = useState<any>([]);
  const [project, setProject] = useState<any>([]);
  const [projectOptions, setProjectOptions] = useState<any>([{}]);
  const [companyOptions, setCompanyOptions] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [companyLoading, setCompanyLoading] =
    useState<boolean>(false);
  const [projectLoading, setProjectLoading] =
    useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const onSubmit = (values) => {
    if (!company[0].value) {
      setAssignedCompanyError(true);
    }
    if (!project[0].value) {
      setAssignedProjectError(true);
    }
    if (selectedTeamMember.length) {
      const modifiedTask = {
        ...values,
        assignmembers: selectedTeamMember,
        priority: selectedOption.value,
        projectId: project[0]?.value,
        companyId: company[0]?.value,
        status: props.taskStatusList[0]._id,
      };
      props.createTask(modifiedTask);
      setCreatingTask(true);
      props.saveTaskForm({});
      setLoading(true);
      setSuccessMessage(
        `The task ${values.name} has been created in ${project[0]?.label}`,
      );
    } else setAssignedUserError(true);
  };

  const handleProject = async (selected: any) => {
    setProject([{}]);
    if (selected.__isNew__) {
      setProjectLoading(true);
      try {
        const headers = formTokenConfig(company[0].value);
        if ((headers as any).headers.Authorization) {
          const reqBody = {
            name: selected.value,
            companyId: company[0].value,
          };
          const response = await tigrowApi.post(
            `projects/create-project`,
            reqBody,
            headers,
          );
          setProjectOptions([
            ...projectOptions,
            {
              value: response.data.project._id,
              label: response.data.project.name,
            },
          ]);
          setProject([
            {
              value: response.data.project._id,
              label: response.data.project.name,
            },
          ]);
          props.createProjectInCompanySuccess(response.data.project);
          props.getAllTaskStatusInProject({
            companyId: company[0].value,
            projectId: response.data.project._id,
          });
          successToaster(
            `The project ${response.data.project.name} has been created`,
          );
        }
      } catch (err) {
        errorToaster(returnErrorText(err));
      }
      setProjectLoading(false);
    } else {
      setProject([
        {
          value: selected.value,
          label: selected.label,
        },
      ]);
      props.getAllTaskStatusInProject({
        companyId: company[0].value,
        projectId: selected.value,
      });
    }
  };

  const handleSelect = (selected: any) => {
    setData({
      ...data,
      priority: selected,
    });
    setSelectedOption(selected);
  };

  const handleMember = (selected: any) => {
    setMemberValue(selected);
    const memberslit = selected.map((member: any) => ({
      _id: member.value,
      name: member.label,
    }));
    setSelectedTeamMember(memberslit);
    setData({
      ...data,
      memberValue: selected,
      assignmembers: memberslit,
    });
  };

  const mdfy = (members) => {
    const membersList = members?.map((m) => ({
      value: m?._id,
      label: m?.name,
    }));
    return membersList;
  };

  const handleChange = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleCompany = async (selected: any) => {
    if (selected.__isNew__) {
      setCompanyLoading(true);
    } else {
      setCompany([
        {
          value: selected.value,
          label: selected.label,
          uniqueName: selected.uniqueName,
          isSubscribed: selected.isSubscribed,
        },
      ]);
      setProject([{}]);
      const optionsProject = props.userProjects
        .filter(
          (project: IProject) =>
            project.company._id === selected.value,
        )
        .map((project: IProject) => ({
          value: project._id,
          label: project.name,
        }));
      setProjectOptions(optionsProject);
    }
  };

  useEffect(() => {
    const optionsCompany = props.companies.map((company) => {
      return {
        value: company.company._id,
        label: company.company.name,
        uniqueName: company.company.uniqueName,
        isSubscribed: company.company.isSubscribed,
      };
    });
    setCompanyOptions(optionsCompany);
  }, [props.companies]);

  useEffect(() => {
    const loadTeamMembers = async () => {
      const headers = formTokenConfig(company[0].value);
      const response = await tigrowApi.get(
        `/tasks/suggest-member?pid=${project[0].value}`,
        headers,
      );
      setTeamMembers(mdfy(response.data));
    };
    if (project[0]?.value) {
      loadTeamMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project[0]?.value]);

  useEffect(() => {
    if (selectedTeamMember.length) {
      setAssignedUserError(false);
    }
  }, [selectedTeamMember]);

  useEffect(() => {
    setDefaultValues(props.previousData);
  }, []);

  useEffect(() => {
    if (defaultValues.priority) {
      setSelectedOption(defaultValues.priority);
    }
    if (defaultValues.assignmembers) {
      setSelectedTeamMember(defaultValues.assignmembers);
    }
    if (defaultValues.memberValue) {
      setMemberValue(defaultValues.memberValue);
    }
  }, [defaultValues]);

  useEffect(() => {
    props.saveTaskForm(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (
      creatingTask === true &&
      props.creatingTask === false &&
      props.errorOnCreatingTask !== ''
    ) {
      setLoading(false);
      setSuccessMessage('');
      // setErrorMessage(props.errorOnCreatingTask);
      errorToaster(props.errorOnCreatingTask);
      setCreatingTask(false);
    }
    if (
      creatingTask === true &&
      props.creatingTask === false &&
      props.errorOnCreatingTask === ''
    ) {
      setLoading(false);
      successToaster(successMessage);
      props.setShowDialog(false);
      // props.getAllUserTasks();
      setCreatingTask(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatingTask, props.creatingTask, props.errorOnCreatingTask]);

  return (
    <ModalContainer>
      <Container>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            name: defaultValues.name,
            dueDate: defaultValues.dueDate,
            description: defaultValues.description,
          }}
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
                  render={({ input, meta }) => (
                    <div className="mb2">
                      <p
                        style={{
                          fontSize: '10px',
                          color: '#666666',
                          fontWeight: 400,
                        }}
                      >
                        NEW TASK
                      </p>
                      <InputGroupFieldWithError
                        id="name"
                        value={input.value}
                        onChange={(e) => {
                          input.onChange(e);
                          handleChange('name', e.target.value);
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
                <div className="w-100 flex flex-row justify-between items-center mt2 mb3 mr-auto">
                  <div className="w-100 flex justify-start items-center">
                    <label className="text-width">Company:</label>
                    <Select
                      id="company"
                      placeholder="Required"
                      value={company}
                      isLoading={companyLoading}
                      isDisabled={companyLoading}
                      options={companyOptions}
                      onChange={handleCompany}
                      // formatCreateLabel={(userInput) =>
                      //   `New: ${userInput}`
                      // }
                      className="w-100 react-select"
                      isOptionDisabled={(option) => {
                        return option.isSubscribed === false;
                      }}
                      formatOptionLabel={(data) => (
                        <div className="flex items-center">
                          {typeof data.label === 'string' ? (
                            <SmallTextAvatar
                              name={data.label.slice(0, 1)}
                            />
                          ) : null}
                          <span className="ml2">{data.label}</span>
                        </div>
                      )}
                    />
                    {assignedCompanyError && (
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
                  <div className="w-100 flex justify-end items-center">
                    <Field<string>
                      name="assignmembers"
                      render={({ input, meta }) => (
                        <div className="flex items-center">
                          <label className="ml3 w-4 mr3">
                            In:
                            <div>
                              {assignedProjectError && (
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
                          <Creatable
                            className="w-100 react-select"
                            name="projectId"
                            value={project}
                            options={projectOptions}
                            onChange={handleProject}
                            formatCreateLabel={(userInput) =>
                              `New: ${userInput}`
                            }
                            isDisabled={
                              projectLoading
                                ? true
                                : company[0]?.value
                                ? false
                                : true
                            }
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="row flex items-center w-100 mb3">
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
                          value={memberValue}
                          options={teamMembers}
                          onChange={handleMember}
                          isDisabled={
                            project[0]?.value ? false : true
                          }
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
                </div>
                <div className="duedate-priority-container">
                  <Field<string>
                    name="dueDate"
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
                  render={({ input, meta }) => (
                    <div className="w-100 flex">
                      <label className="text-width">
                        Description:
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={input.value ?? ''}
                        onChange={(e) => {
                          input.onChange(e);
                          handleChange('description', e.target.value);
                        }}
                        placeholder="Add some details about the task"
                      />
                    </div>
                  )}
                />
                <div className="flex justify-between mt3">
                  {/* 
                  <div>
                    <SimpleButton>Attach files</SimpleButton>
                  <SimpleButton>Invite members</SimpleButton>
                  <SimpleButton>Create subtask</SimpleButton> 
                  </div>
                  */}
                  <StyledButton type="submit">
                    {loading ? (
                      <>
                        Creating Task{' '}
                        <CircularProgress className="ml1" size={12} />
                      </>
                    ) : (
                      'Create Task'
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
  projectId: state.projectReducer.projectDetails._id,
  projects: state.projectReducer.allProjects,
  userProjects: state.projectReducer.userProjects,
  creatingTask: state.taskIndexReducer.taskReducer.creatingTask,
  errorOnCreatingTask:
    state.taskIndexReducer.taskReducer.errorOnCreatingTask,
  previousData: state.taskFormReducer.data,
  companies: state.userReducer.user.companies,
  taskStatusList: state.taskIndexReducer.taskReducer.taskStatusList,
});

export default connect(mapStateToProps, {
  createTask,
  saveTaskForm,
  getCompanyDetails,
  createProjectInCompanySuccess,
  getAllUserTasks,
  getAllTaskStatusInProject,
})(TaskDialog);
