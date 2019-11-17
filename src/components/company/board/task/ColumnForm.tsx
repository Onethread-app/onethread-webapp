import React, { useState } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup'
import { Button, Spinner } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { createColumn } from 'stores/board/Actions';
import { TaskBoard } from 'stores/board/Reducer';

interface ColumnFormProps {
  setShowColumnFormDialog: (val: boolean) => void;
}

interface ColumnFormInternalProps extends ColumnFormProps {
  loading: boolean;
  currentBoard: TaskBoard;
  createColumn: (columnInfo: any) => void;
}

const ColumnFormComponent = (props: ColumnFormInternalProps) => {

  const [columnName, setColumnName] = useState('');

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
          disabled={props.loading ? true : isEmpty(columnName)}
          text={props.loading ? <Spinner size={15} /> : 'Create Column'}
          onClick={async (e: any) => {
            e.preventDefault();
            const columnInfo = {
              name: columnName,
              positionInBoard: props.currentBoard.columns ? props.currentBoard.columns.length + 1 : 1,
              boardId: props.currentBoard._id
            }
            await props.createColumn(columnInfo);
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

export const ColumnForm = connect(mapStateToProps, { createColumn })(ColumnFormComponent);