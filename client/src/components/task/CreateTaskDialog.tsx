import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import Select from 'react-select';

import { Field, Form } from 'react-final-form';
import { Button, Tag } from '@blueprintjs/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DateInput } from '@blueprintjs/datetime';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SuggestField } from 'components/fields/SuggestField';
import {
  checkError,
  composeValidators,
  maxValue,
  required,
} from 'components/final-form/utils';
import { useLiveSearch } from 'components/useLiveSearch';

import { tigrowApi } from 'config';
import { createTask } from 'stores/board/Actions';
import { ICompanyTeamMembers } from 'stores/company/Reducer';
import { tokenConfig, priorityColor } from 'stores/UtilsActions';
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
  const [username, setUsername] = useState('');
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
  let minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const userRequestFactory = async (userName: string) => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `/tasks/suggest-member?pid=${props.projectId}`,
      headers,
    );
    return response.data;
  };

  let result: any = useMemo(() => [], []);
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

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

  const handleSelect = (selected: any) => {
    setSelectedOption(selected);
  };

  const onSubmit = (values) => {
    if (selectedTeamMember.length) {
      const modifiedTask = {
        ...values,
        priority: selectedOption.value,
        boardId: props.currentBoardId,
        columnId: props.columnId,
      };
      props.createTask(modifiedTask);
      setCreatingTask(true);
    } else setAssignedUserError(true);
  };

  useEffect(() => {
    if (selectedTeamMember.length) {
      setAssignedUserError(false);
    }
  }, [selectedTeamMember]);

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
                      onChange={input.onChange}
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
                    />
                  </div>
                )}
              />
              <Field<string>
                name="assignmembers"
                render={({ input, meta }) => (
                  <div className="mb3">
                    <div className="flex items-center w-50">
                      <label
                        style={{
                          width: '150px',
                        }}
                      >
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
                      <SuggestField
                        onChange={(query: string) => {
                          setUsername(query);
                        }}
                        items={teamMembers}
                        selectedItems={selectedTeamMember}
                        setSelectedItems={(item) => {
                          setSelectedTeamMember(item);
                          input.onChange(
                            item.map(
                              (member: ICompanyTeamMembers) =>
                                member._id,
                            ),
                          );
                        }}
                        multipleItemSelect={true}
                      />
                    </div>
                    {selectedTeamMember.length > 0 && (
                      <div className="w-100">
                        <div
                          className="overflow-auto br2 mt2"
                          style={{
                            border: '1px solid #10161a33',
                            // maxHeight: '120px',
                            display: 'flex',
                            gap: '.5rem',
                            padding: '.25rem',
                            marginLeft: '102px',
                          }}
                        >
                          {selectedTeamMember.map((item) => (
                            <div key={item._id}>
                              <Tag
                                key={item._id}
                                className="pa1"
                                interactive={true}
                                style={{ background: '#34b3e9' }}
                                onRemove={(e) => {
                                  const filteredItems = selectedTeamMember.filter(
                                    (selectedItem) =>
                                      item.name !== selectedItem.name,
                                  );
                                  setSelectedTeamMember([
                                    ...filteredItems,
                                  ]);
                                  input.onChange(
                                    isEmpty(filteredItems)
                                      ? undefined
                                      : filteredItems.map(
                                          (
                                            member: ICompanyTeamMembers,
                                          ) => member._id,
                                        ),
                                  );
                                }}
                                large={true}
                                intent="primary"
                              >
                                {item.name}
                              </Tag>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
              <div
                className="flex items-center mb3"
                style={{ width: '80%' }}
              >
                <Field<string>
                  name="dueDate"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className="flex items-center w-100 mr3">
                      <label
                        style={{
                          width: '145px',
                        }}
                      >
                        Due Date:
                        <div>
                          {checkError(meta) && (
                            <small
                              className="mv3"
                              style={{ color: 'red' }}
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
                        placeholder="dd/mm/yyyy"
                        parseDate={(str: string) => new Date(str)}
                        onChange={input.onChange}
                        canClearSelection={false}
                        value={
                          input.value ? new Date(input.value) : null
                        }
                        popoverProps={{
                          targetClassName: 'w-100',
                        }}
                        minDate={minDate}
                      />
                    </div>
                  )}
                />
                <div className="flex items-center w-100">
                  <label
                    style={{
                      width: '80px',
                    }}
                  >
                    Priority:
                  </label>
                  <div className="w-100">
                    <Select
                      className="priority-select-option"
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
                    <label
                      style={{
                        width: '130px',
                      }}
                    >
                      Description:
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        width: '100%',
                        height: '150px',
                        boxShadow:
                          'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        border: 'none',
                        padding: '0.5rem',
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
                        style={{ color: 'white' }}
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
});

export default connect(mapStateToProps, { createTask })(
  CreateTaskDialog,
);
