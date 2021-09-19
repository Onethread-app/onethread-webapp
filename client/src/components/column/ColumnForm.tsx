import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { TaskBoard, IColumn } from 'stores/task/Reducer';
import { createColumn, updateColumn } from 'stores/task/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
  checkTaskName,
} from 'components/final-form/utils';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';

interface ColumnFormProps {
  setShowColumnFormDialog: (val: boolean) => void;
  column?: IColumn;
}

interface ColumnFormInternalProps extends ColumnFormProps {
  currentBoard: TaskBoard;
  createColumn: (columnInfo: any) => void;
  updateColumn: (columnIndo: any) => void;
}

const ColumnFormComponent = (props: ColumnFormInternalProps) => {
  const onSubmit = async (values: any) => {
    const columnInfo = {
      ...values,
      _id: props.column ? props.column._id : undefined,
      positionInBoard:
        props.column && isEmpty(props.column.name) === false
          ? props.column.positionInBoard
          : props.currentBoard.columns
          ? props.currentBoard.columns.length + 1
          : 1,
      boardId: props.currentBoard._id,
    };
    if (props.column && isEmpty(props.column.name) === false) {
      // edit column name
      await props.updateColumn(columnInfo);
    } else {
      // New column create
      await props.createColumn(columnInfo);
    }
    if (props.setShowColumnFormDialog) {
      props.setShowColumnFormDialog(false);
    }
    return {};
  };

  return (
    <div className="pa3">
      <div style={{ marginTop: '7rem' }}>
        {props.column ? <h3>Edit Column</h3> : <h3>Create Column</h3>}
      </div>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: props.column ? props.column.name : undefined,
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
            <div className="pv3 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(
                  required,
                  maxValue(60),
                  checkTaskName,
                )}
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                  >
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      label="Column Name"
                      autoFocus={true}
                    />
                  </div>
                )}
              />
              <div className="fr">
                <Button
                  className="grow pointer white bp3-minimal w4 mt2 mr3"
                  style={{
                    background: '#34b3e9',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  {props.column ? 'Update' : 'Create'}
                </Button>
                <Button
                  className="w4 grow h2 pointer"
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '1px solid #34b3e9',
                    color: '#34b3e9',
                  }}
                  onClick={(e: any) => {
                    if (props.setShowColumnFormDialog) {
                      props.setShowColumnFormDialog(false);
                    }
                  }}
                >
                  cancel
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
  };
};

export const ColumnForm = connect(mapStateToProps, {
  createColumn,
  updateColumn,
})(ColumnFormComponent);
