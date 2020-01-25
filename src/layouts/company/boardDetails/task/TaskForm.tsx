import React from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { TaskBoard, IColumn } from 'stores/board/Reducer';
import { createTask } from 'stores/board/Actions';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { DropdownFieldErrorWithLabel } from 'components/fields/DropdownField';

interface TaskFormProps {
  setShowTaskFormDialog: (val: boolean) => void;
  column?: IColumn;
}

interface TaskFormInternalProps extends TaskFormProps {
  loading: boolean;
  currentBoard: TaskBoard;
  createTask: (task: any) => void;
}

export const TaskFormComponent = (props: TaskFormInternalProps) => {
  const onSubmit = async (values: any) => {
    const modifiedTask = {
      ...values,
      boardId: props.currentBoard._id
    };
    await props.createTask(modifiedTask);
    if (props.setShowTaskFormDialog) {
      props.setShowTaskFormDialog(false);
    }
    return {};
  };

  return (
    <div className="pa3">
      <div style={{ marginTop: '7rem' }}>
        <h3>Create Task</h3>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            onSubmit={handleSubmit}
          >
            <div className="pv3 justify-content w-100">
              <Field<string>
                name="name"
                validate={required}
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={checkError(meta) && (meta.error || meta.submitError)}
                      label="Task Name"
                    />
                  </div>
                }
              />
              <Field<string>
                name="columnId"
                validate={required}
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <DropdownFieldErrorWithLabel
                      id={input.name}
                      selectedValue={input.value}
                      options={
                        props.currentBoard.columns && props.currentBoard.columns.length > 0 ?
                          props.currentBoard.columns : [] as any
                      }
                      onChange={input.onChange}
                      error={checkError(meta) && (meta.error || meta.submitError)}
                      label="Select Column"
                      className="bn"
                    />
                  </div>
                }
              />
              <div className="fr">
                <Button
                  className="grow pointer white bp3-minimal w4 mt2"
                  style={{
                    background: '#0FA3A3',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Create
              </Button>
              </div>
            </div>
          </form>
        )
        }
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    loading: state.boardReducer.boardTaskLoading,
    currentBoard: state.boardReducer.currentBoard
  };
};

export const TaskForm = connect(mapStateToProps, { createTask })(TaskFormComponent);
