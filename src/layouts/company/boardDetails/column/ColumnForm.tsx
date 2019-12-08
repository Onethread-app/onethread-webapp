import React, { useState } from 'react'
import { InputGroupField } from 'components/fields/InputGroupField'
import { Button, Spinner } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { createColumn, updateColumn } from 'stores/board/Actions';
import { TaskBoard, IColumn } from 'stores/board/Reducer';

interface ColumnFormProps {
  setShowColumnFormDialog: (val: boolean) => void;
  column?: IColumn;
}

interface ColumnFormInternalProps extends ColumnFormProps {
  loading: boolean;
  currentBoard: TaskBoard;
  createColumn: (columnInfo: any) => void;
  updateColumn: (columnIndo: any) => Promise<any>;
}

const ColumnFormComponent = (props: ColumnFormInternalProps) => {

  const [loading, setLoading] = useState(false);
  const [columnName, setColumnName] = useState(props.column ? props.column.name : '');

  return (
    <div className="pa3">
      <div className="mb3 w-100">
        <InputGroupField
          id="column_name"
          className={`br0 bb b--lightBlue`}
          value={columnName}
          onChange={e => setColumnName(e.target.value)}
          placeHolder="Column title"
          leftIcon="clipboard"
          style={{
            boxShadow: 'none'
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="grow pointer white bp3-minimal w4"
          type="submit"
          style={isEmpty(columnName) === false ?
            {
              background: "#0fa3a3",
              outline: "none",
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: "none",
              color: 'white'
            }
          }
          disabled={props.loading || loading ? true : isEmpty(columnName)}
          text={props.loading || loading ? <Spinner size={15} /> : 'Create Column'}
          onClick={async (e: any) => {
            e.preventDefault();
            setLoading(true);
            const columnInfo = {
              _id: props.column ? props.column._id : undefined,
              name: columnName,
              positionInBoard: props.column && isEmpty(props.column.name) === false ? 
                props.column.positionInBoard : props.currentBoard.columns ? props.currentBoard.columns.length + 1 : 1,
              boardId: props.currentBoard._id
            }
            if (props.column && isEmpty(props.column.name) === false) {
              // edit column name
              await props.updateColumn(columnInfo);
            } else {
              // New column create
              await props.createColumn(columnInfo);
            }
            setLoading(false);
            setColumnName('');
            if (props.setShowColumnFormDialog) {
              props.setShowColumnFormDialog(false);
            }
          }}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.taskManagementReducer.boardReducer.boardColumnLoading,
    currentBoard: state.taskManagementReducer.boardReducer.currentBoard
  }
}

export const ColumnForm = connect(mapStateToProps, { createColumn, updateColumn })(ColumnFormComponent);