import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import Select from 'react-select';

import { Field, Form } from 'react-final-form';
import { Button, Icon, Tag } from '@blueprintjs/core';
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

const Container = styled.div`
  padding: 1rem 1.5rem;
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
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

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
    if (username) {
      const modifiedTask = {
        ...values,
        priority: selectedOption.value,
        boardId: props.currentBoardId,
        columnId: props.columnId,
      };
      props.createTask(modifiedTask);
      setCreatingTask(true);
    } else setError(true);
  };

  useEffect(() => {
    setError(false);
  }, [username]);

  return (
    <Container>
      <h3 className="tc fw5 f4">Create Task</h3>
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
                  <div className="mv1">
                    <p className="fw5 f5 mb2">
                      Task Name<sup>*</sup>{' '}
                      <span className="f7">(max: 150)</span>
                    </p>
                    <InputGroupFieldWithError
                      id="name"
                      className={`bw1 pb2 br0 b--lightBlue ph2}`}
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow:
                          'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        fontSize: '12px',
                      }}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      autoFocus={true}
                    />
                  </div>
                )}
              />
              <Field<string>
                name="dueDate"
                validate={required}
                render={({ input, meta }) => (
                  <div className={`mb3`}>
                    <label
                      style={{
                        marginBottom: '5px',
                        display: 'inline-block',
                      }}
                    >
                      Due Date<sup>*</sup>
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
                      minDate={new Date()}
                    />
                    {checkError(meta) && (
                      <small className="mv3" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </small>
                    )}
                  </div>
                )}
              />
              <Field<string>
                name="assignmembers"
                render={({ input, meta }) => (
                  <div className={`mb3`}>
                    <div className="fl w-100 pb2">
                      <div className="mb1">
                        <p
                          className="fw5"
                          style={{ fontSize: '.8rem' }}
                        >
                          Assign Members<sup>*</sup>
                        </p>
                      </div>
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
                      <small
                        style={{ color: 'red', margin: '1rem 0rem' }}
                      >
                        {error && 'Required'}
                      </small>
                    </div>
                    {selectedTeamMember.length > 0 && (
                      <div className="w-100">
                        <div
                          className="overflow-auto br2"
                          style={{
                            border: '1px solid #707070',
                            // maxHeight: '120px',
                            display: 'flex',
                            gap: '.5rem',
                            padding: '.25rem',
                          }}
                        >
                          {selectedTeamMember.map((item) => (
                            <div key={item._id}>
                              <Tag
                                key={item._id}
                                className="pa1"
                                interactive={true}
                                style={{ background: '#3484F0' }}
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
              <div className="flex flex-column mb3">
                <label htmlFor="" className="mb2">
                  Priority
                </label>
                <Select
                  options={options}
                  value={selectedOption}
                  onChange={handleSelect}
                />
              </div>
              <div className="flex justify-end mt3">
                <Button
                  className="mr2"
                  style={{
                    background: 'transparent',
                    border: 'none',
                  }}
                  icon="cross"
                  onClick={() => {
                    props.setShowDialog(false);
                  }}
                />
                <Button
                  type="submit"
                  style={{
                    background: '#3F61C5',
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
                    ) : (
                      <Icon
                        icon="tick"
                        iconSize={20}
                        style={{ color: 'white' }}
                      />
                    )
                  }
                >
                  Create
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
