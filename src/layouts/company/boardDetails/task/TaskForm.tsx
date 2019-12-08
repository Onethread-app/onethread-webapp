import React, { useState } from 'react'
import { InputGroupField } from 'components/fields/InputGroupField';
import { Button, TextArea, Intent, Spinner, FormGroup, HTMLSelect } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { TaskBoard, IColumn } from 'stores/board/Reducer';
import { createTask } from 'stores/board/Actions';

interface TaskFormProps {
  setShowTaskFormDialog: (val: boolean) => void;
  column?: IColumn
}

interface TaskFormInternalProps extends TaskFormProps {
  loading: boolean;
  currentBoard: TaskBoard;
  createTask: (task: any) => void;
}

export const TaskFormComponent = (props: TaskFormInternalProps) => {

  const [task, setTask] = useState({
    name: "",
    description: "",
    columnId: props.column ? props.column._id : ""
  });

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setTask({ ...task, [name]: value });
  };

  const isTaskFormEmpty = () => (
    // isEmpty(task.name) || isEmpty(task.description)
    isEmpty(task.name) || isEmpty(task.columnId)
  );

  return (
    <div className="pa3">
      <div className="mb3 w-100">
        <FormGroup
          className="b"
          label="Task name"
          labelFor="task_name"
          labelInfo="(required)"
        >
          <InputGroupField
            id="task_name"
            className={`br0 bb b--lightBlue`}
            value={task.name}
            onChange={handleChange('name')}
            placeHolder="task title"
            leftIcon="clipboard"
            style={{
              boxShadow: 'none'
            }}
          />
        </FormGroup>
      </div>
      <div className="mb3 w-100">
        <FormGroup
          className="b"
          label="Task description"
          labelFor="task_description"
        >
          <TextArea
            id="task_description"
            large={true}
            intent={Intent.PRIMARY}
            onChange={handleChange('description')}
            value={task.description}
            fill={true}
            style={{ resize: 'none' }}
          />
        </FormGroup>
      </div>
      <div className="mb3 w-100">
        <FormGroup
          className="b"
          label="Column"
          labelFor="task_column"
          labelInfo="(required)"
        >
          <HTMLSelect
            className=" bb b--lightBlue"
            fill={true}
            minimal={true}
            disabled={props.column ? true : false}
            value={props.column ? props.column._id : task.columnId}
            onChange={e => setTask({ ...task, columnId: e.currentTarget.value })}
            style={{
              boxShadow: 'none',
              borderRadius: '0px',
              backgroundColor: 'white',
              flex: '1',
              outline: 'none'
            }}
          >
            <option selected value=''>Please select column</option>
            {props.currentBoard.columns!.map(column => (
              <option value={column._id}>{column.name}</option>
            ))}
          </HTMLSelect>
        </FormGroup>
      </div>
      <div className="flex justify-end">
        <Button
          className="grow pointer white bp3-minimal w4"
          type="submit"
          style={isTaskFormEmpty() === false ?
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
          disabled={props.loading ? true : isTaskFormEmpty()}
          text={props.loading ? <Spinner size={15} /> : 'Create Task'}
          onClick={async (e: any) => {
            e.preventDefault();
            const modifiedTask = {
              ...task,
              columnId: props.column ? props.column._id : task.columnId,
              boardId: props.currentBoard._id
            }
            await props.createTask(modifiedTask);
            setTask({
              name: "",
              description: "",
              columnId: props.currentBoard.columns![0]._id!
            });
            if (props.setShowTaskFormDialog) {
              props.setShowTaskFormDialog(false);
            }
          }}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.taskManagementReducer.boardReducer.boardTaskLoading,
    currentBoard: state.taskManagementReducer.boardReducer.currentBoard
  }
}

export const TaskForm = connect(mapStateToProps, { createTask })(TaskFormComponent);
