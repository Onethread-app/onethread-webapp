import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { TaskItem } from '../task/TaskItem';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Dialog,
  Icon,
} from '@blueprintjs/core';
import { IColumn, TaskBoard } from 'stores/board/Reducer';
import { TaskForm } from '../task/TaskForm';
import { connect } from 'react-redux';
import { ColumnForm } from './ColumnForm';
import { projectPermit } from 'stores/UtilsActions';
import { ICompany } from 'stores/company/Reducer';
import { Field, Form } from 'react-final-form';
import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { createTask } from 'stores/board/Actions';
import { RightSidebar } from 'components/RightSidebar';

interface ColumnProps {
  key: string;
  column: IColumn;
  index: number;
}

interface ColumnInternalProps extends ColumnProps {
  loading?: boolean;
  company?: ICompany;
  createTask: (task: any) => void;
  currentBoard?: TaskBoard;
}

const ColumnComponent = (props: ColumnInternalProps) => {
  const [showColumnFormDialog, setShowColumnFormDialog] = useState(
    false,
  );
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);

  const onSubmit = async (values: any) => {
    const modifiedTask = {
      ...values,
      boardId: props.currentBoard!._id,
      columnId: props.column._id,
    };
    await props.createTask(modifiedTask);
    if (showTaskInput) {
      setShowTaskInput(false);
    }
    return;
  };

  return (
    <>
      <div
        className="dib h-100 w-23-l w-50-m"
        style={{ minWidth: '270px' }}
      >
        <div className="flex flex-column h-100 pr3 w-100">
          <div className="w-100">
            <div className="flex pb1 w-100">
              <Popover
                interactionKind="hover-target"
                popoverClassName="bg-white"
                className="w-90 bg-white"
                content={
                  <p className="ws-break ma2">{props.column.name}</p>
                }
                target={
                  <h3
                    className="pl1 overflow-hidden ma0 fw6 flex-grow-1 ws-normal ws-break pv1"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: '220px',
                    }}
                  >
                    {props.column.name}
                  </h3>
                }
              />
              {props.company &&
              projectPermit(props.company.role) === true ? (
                <Popover
                  className="w-10"
                  content={
                    <Menu>
                      <MenuItem
                        text="Edit"
                        onClick={(e: any) =>
                          setShowColumnFormDialog(true)
                        } // TODO change ui
                      />
                    </Menu>
                  }
                  target={
                    <Button
                      style={{
                        transform: 'rotate(90deg)',
                        OTransform: 'rotate(90deg)',
                        msTransform: 'rotate(90deg)',
                        WebkitTransform: 'rotate(90deg)',
                      }}
                      icon="more"
                      minimal={true}
                    />
                  }
                />
              ) : undefined}
            </div>
            {props.company &&
            projectPermit(props.company.role) === true ? (
              <div
                className="overflow-hidden ph2 pt2"
                style={{
                  background: '#F6F6F6',
                  borderRadius: '5px 5px 0 0',
                }}
              >
                <Button
                  className="grow h2 mb2 pointer bp3-minimal"
                  style={{
                    background: '#3F61C5',
                    outline: 'none',
                    color: 'white',
                  }}
                  text="Add Task"
                  fill={true}
                  onClick={() => setShowTaskInput(!showTaskInput)}
                />
              </div>
            ) : undefined}
            <div>
              {showTaskInput && (
                <div className="overflow-hidden">
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
                        <div
                          className="ph2 pt2"
                          style={{ background: '#F6F6F6' }}
                        >
                          <Field<string>
                            name="name"
                            validate={composeValidators(
                              required,
                              maxValue(60),
                            )}
                            render={({ input, meta }) => (
                              <InputGroupFieldWithError
                                id="name"
                                className={`bw1 pb2 br0 b--lightBlue ph2}`}
                                value={input.value}
                                onChange={input.onChange}
                                style={{
                                  boxShadow: 'none',
                                  fontSize: '12px',
                                }}
                                error={
                                  checkError(meta) &&
                                  (meta.error || meta.submitError)
                                }
                                placeHolder="Task Name"
                                autoFocus={true}
                              />
                            )}
                          />
                          <div className="flex justify-end">
                            <Button
                              className="mr2"
                              style={{ background: 'transparent' }}
                              icon="cross"
                              onClick={() =>
                                setShowTaskInput(!showTaskInput)
                              }
                            />
                            <Button
                              type="submit"
                              style={{ background: '#0FA3A3' }}
                              loading={submitting}
                              icon={
                                <Icon
                                  icon="tick"
                                  iconSize={20}
                                  style={{ color: 'white' }}
                                />
                              }
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="h-100 mb1 overflow-y-auto"
            style={{
              background: '#F6F6F6',
              borderRadius: '0 0 5px 5px',
            }}
          >
            <div className="flex-grow-1 flex flex-column h-100">
              <Droppable droppableId={props.column._id!} type="task">
                {(provided, snapshot) => {
                  const allowedProps = { ref: provided.innerRef };
                  return (
                    <div
                      className={`pa2 flex-grow-1 flex
                          flex-column overflow-auto 
                          ${
                            snapshot.isDraggingOver
                              ? 'bg-lightest-blue'
                              : ''
                          }`}
                      style={{
                        transition: 'background-color 0.2s ease',
                        minHeight: '100px',
                        whiteSpace: 'normal',
                      }}
                      {...provided.droppableProps}
                      {...allowedProps}
                    >
                      <div className="flex-grow-1">
                        {props.column.tasks!.map((task, index) => (
                          <TaskItem
                            key={task._id!}
                            task={task}
                            index={index}
                          />
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          </div>
        </div>
      </div>
      {showTaskFormDialog && (
        <Dialog
          onClose={() => setShowTaskFormDialog(!showTaskFormDialog)}
          title="Create Task"
          isOpen={showTaskFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <TaskForm
            setShowTaskFormDialog={setShowTaskFormDialog}
            column={props.column}
          />
        </Dialog>
      )}
      {showColumnFormDialog && (
        <RightSidebar
          onClose={() =>
            setShowColumnFormDialog(!showColumnFormDialog)
          }
        >
          <ColumnForm
            setShowColumnFormDialog={setShowColumnFormDialog}
            column={props.column}
          />
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
  };
};

export const Column = connect(mapStateToProps, { createTask })(
  ColumnComponent,
);
