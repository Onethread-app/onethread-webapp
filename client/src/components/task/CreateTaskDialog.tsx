import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { isEmpty } from 'lodash';
import styled from 'styled-components';
import Select from 'react-select';

import { Field, Form } from 'react-final-form';
import { Button } from '@blueprintjs/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DateInput } from '@blueprintjs/datetime';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import {
  checkError,
  composeValidators,
  maxValue,
  required,
} from 'components/final-form/utils';

import { tigrowApi } from 'config';
import { createTask } from 'stores/board/Actions';
import { ICompanyTeamMembers } from 'stores/company/Reducer';
import { tokenConfig, priorityColor } from 'stores/UtilsActions';
import { saveTaskForm } from 'stores/taskForm/Actions';
import './Task.scss';

const Container = styled.div`
  padding: 2rem;
`;

interface ICreateTaskDialogProps {
  columnId: string;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICreateTaskDialogInternalProps
  extends ICreateTaskDialogProps {
  projectId: string;
  currentBoardId: string;
  creatingTask: boolean;
  errorOnCreatingTask: string;
  createTask: (task: any) => void;
  saveTaskForm: any;
  previousData: any;
}

export interface IOption {
  value: string | number;
  label: string;
}

const CreateTaskDialog = (props: ICreateTaskDialogInternalProps) => {
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

  const [assignedUserError, setAssignedUserError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [data, setData] = useState<any>({});
  const [defaultValues, setDefaultValues] = useState<any>([]);

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
    const membersList = members.map((m) => ({
      value: m._id,
      label: m.name,
    }));
    return membersList;
  };

  const onSubmit = (values) => {
    if (selectedTeamMember.length) {
      const modifiedTask = {
        ...values,
        assignmembers: selectedTeamMember,
        priority: selectedOption.value,
        boardId: props.currentBoardId,
        columnId: props.columnId,
      };
      props.createTask(modifiedTask);
      setCreatingTask(true);
      props.saveTaskForm({});
    } else setAssignedUserError(true);
  };

  const handleChange = (name: string, value: any) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  useEffect(() => {
    const loadTeamMembers = async () => {
      const headers = tokenConfig();
      const response = await tigrowApi.get(
        `/tasks/suggest-member?pid=${props.projectId}`,
        headers,
      );
      setTeamMembers(mdfy(response.data));
    };
    loadTeamMembers();
  }, []);

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
  }, [data]);

  useEffect(() => {
    if (
      creatingTask === true &&
      props.creatingTask === false &&
      props.errorOnCreatingTask !== ''
    ) {
      setErrorText(props.errorOnCreatingTask);
    }
    if (
      creatingTask === true &&
      props.creatingTask === false &&
      props.errorOnCreatingTask === ''
    ) {
      props.setShowDialog(false);
    }
  }, [creatingTask, props.creatingTask, props.errorOnCreatingTask]);

  const timePickerProps = {
    showArrowButtons: false,
    useAmPm: true,
  };

  return (
    <Container>
      <div className="flex justify-end">
        <Button
          style={{
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            width: '25px',
          }}
          icon="cross"
          onClick={() => {
            props.setShowDialog(false);
          }}
        />
      </div>
      {errorText && <h3 className="tc fw5 f4 red">{errorText}</h3>}
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
            <div className="flex flex-column">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(150))}
                render={({ input, meta }) => (
                  <div className="mb3">
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
              <Field<string>
                name="assignmembers"
                render={({ input, meta }) => (
                  <div className="mb3">
                    <div className="flex items-center">
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
                        className="select-option-mdfy"
                        name="assignmembers"
                        value={memberValue}
                        options={teamMembers}
                        onChange={handleMember}
                      />
                    </div>
                  </div>
                )}
              />
              <div className="duedate-priority-container">
                <Field<string>
                  name="dueDate"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className="flex items-center w-100 mb3">
                      <label className="text-width-dueDate">
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
                      <DateInput
                        formatDate={(date: Date) =>
                          date.toLocaleDateString()
                        }
                        timePickerProps={timePickerProps}
                        timePrecision="minute"
                        placeholder="dd/mm/yyyy"
                        parseDate={(str: string) => new Date(str)}
                        onChange={(e) => {
                          input.onChange(e);
                          handleChange('dueDate', e);
                        }}
                        canClearSelection={false}
                        value={
                          input.value ? new Date(input.value) : null
                        }
                        className="task-dueDate"
                        popoverProps={{
                          targetClassName: 'w-100',
                        }}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                />
                <div className="flex items-center w-100 mb3">
                  <label className="text-width">Priority:</label>
                  <div className="w-100">
                    <Select
                      className="select-option-mdfy"
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
                  <div className="mv1 flex">
                    <label className="text-width">Description:</label>
                    <textarea
                      name="description"
                      id="description"
                      value={input.value}
                      onChange={(e) => {
                        input.onChange(e);
                        handleChange('description', e.target.value);
                      }}
                      style={{
                        width: '100%',
                        height: '150px',
                        boxShadow:
                          'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '0.2rem',
                      }}
                      placeholder="Add some details about the task"
                    />
                  </div>
                )}
              />
              <div className="flex justify-end mt3">
                <Button
                  type="submit"
                  style={{
                    background: '#34b3e9',
                    color: '#fff',
                    boxShadow: 'none',
                  }}
                  loading={submitting}
                  rightIcon={
                    props.creatingTask ? (
                      <CircularProgress
                        size={20}
                        style={{
                          color: 'white',
                        }}
                      />
                    ) : null
                  }
                >
                  Create task
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  projectId: state.projectReducer.projectDetails._id,
  currentBoardId:
    state.boardIndexReducer.boardReducer.currentBoard._id,
  creatingTask: state.boardIndexReducer.boardReducer.creatingTask,
  errorOnCreatingTask:
    state.boardIndexReducer.boardReducer.errorOnCreatingTask,
  previousData: state.taskFormReducer.data,
});

export default connect(mapStateToProps, { createTask, saveTaskForm })(
  CreateTaskDialog,
);
