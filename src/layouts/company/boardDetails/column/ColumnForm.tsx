import React from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { createColumn, updateColumn } from 'stores/board/Actions';
import { TaskBoard, IColumn } from 'stores/board/Reducer';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';

interface ColumnFormProps {
  setShowColumnFormDialog: (val: boolean) => void;
  column?: IColumn;
}

interface ColumnFormInternalProps extends ColumnFormProps {
  currentBoard: TaskBoard;
  createColumn: (columnInfo: any) => void;
  updateColumn: (columnIndo: any) => Promise<any>;
}

const ColumnFormComponent = (props: ColumnFormInternalProps) => {

  const onSubmit = async (values: any) => {
    const columnInfo = {
      ...values,
      _id: props.column ? props.column._id : undefined,
      positionInBoard: props.column && isEmpty(props.column.name) === false ?
        props.column.positionInBoard : props.currentBoard.columns ? props.currentBoard.columns.length + 1 : 1,
      boardId: props.currentBoard._id
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
        {props.column ?
          <h3>Edit Column</h3>
          : <h3>Create Column</h3>
        }
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
                      label="Column Name"
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
                  {props.column ? 'Update' : 'Create'}
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
    currentBoard: state.boardReducer.currentBoard
  };
};

export const ColumnForm = connect(mapStateToProps, { createColumn, updateColumn })(ColumnFormComponent);