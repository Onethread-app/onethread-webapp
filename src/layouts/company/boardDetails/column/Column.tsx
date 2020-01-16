import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { TaskItem } from '../task/TaskItem';
import { Button, Popover, Menu, MenuItem, Dialog } from '@blueprintjs/core';
import { IColumn } from 'stores/board/Reducer';
import { TaskForm } from '../task/TaskForm';
import { connect } from 'react-redux';
import { Loading } from 'components/Loading';
import { ColumnForm } from './ColumnForm';
import { permit } from 'stores/UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { Field, Form } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

import cancel from '../../../../resources/images/cancel.png';
import doneWhite from '../../../../resources/images/doneWhite.png';

interface ColumnProps {
  key: string;
  column: IColumn;
  index: number;
}

interface ColumnInternalProps extends ColumnProps {
  loading?: boolean;
  company?: CompanyModel;
}

const ColumnComponent = (props: ColumnInternalProps) => {

  const [showColumnFormDialog, setShowColumnFormDialog] = useState(false);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);

  const onSubmit = async (values: string) => {
    setShowTaskInput(!showTaskInput);
  };

  return (
    <>
      <div className="pl2 pb2 dib h-100 w-23-l w-50-m overflow-y-auto">
        <div className="flex flex-column h-100 pr2">
          <div>
            <div className="flex">
              <h3
                className="ma0 flex-grow-1 ws-normal ws-break"
              >
                {props.column.name}
              </h3>
              {props.company && permit(props.company.role) === true ?
                <Popover
                  content={
                    <Menu>
                      <MenuItem
                        text="Edit"
                        onClick={(e: any) => setShowColumnFormDialog(true)}
                      />
                    </Menu>
                  }
                  target={
                    <Button
                      style={{
                        transform: 'rotate(90deg)',
                        OTransform: 'rotate(90deg)',
                        msTransform: 'rotate(90deg)',
                        WebkitTransform: 'rotate(90deg)'
                      }}
                      icon="more"
                      minimal={true}
                      small={true}
                    />
                  }
                />
                : undefined}
            </div>
            {props.company && permit(props.company.role) === true ?
              <div className="overflow-hidden ph2 pt2">
                <Button
                  className="grow h2 mb2 pointer bp3-minimal"
                  style={{
                    background: '#3F61C5',
                    outline: 'none',
                    color: 'white'
                  }}
                  text="Add Task"
                  fill={true}
                  onClick={() => setShowTaskInput(!showTaskInput)}
                />
              </div>
              : undefined}
            <div>
              {showTaskInput && (
                <div className="overflow-hidden ph2 pt2">
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
                        <form
                          onSubmit={handleSubmit}
                        >
                          <div>
                            <Field<string>
                              name="name"
                              validate={required}
                              render={({ input, meta }) =>
                                  <InputGroupFieldWithError
                                    id="name"
                                    className={`bw1 pb2 br0 b--lightBlue'}`}
                                    value={input.value}
                                    onChange={input.onChange}
                                    style={{
                                      boxShadow: 'none',
                                      fontSize: '18px',
                                    }}
                                    error={checkError(meta) && (meta.error || meta.submitError)}
                                    placeHolder="Task Name"
                                  />
                              }
                            />
                            <div className="flex justify-end">
                              <button
                                className="pa1 ma0 b--none pointer outline-0"
                                type="submit"
                                style={{background: '#F5F6FA'}}
                                onClick={() => setShowTaskInput(!showTaskInput)}
                              >
                                <img
                                  style={{ width: '25px', height: '25px' }}
                                  src={cancel}
                                />
                              </button>
                              <button
                                className="pa1 ma0 b--none pointer outline-0"
                                type="submit"
                                style={{background: '#F5F6FA', outline: 'none'}}
                              >
                                <img
                                  style={{ width: '25px', height: '25px' }}
                                  src={doneWhite}
                                />
                              </button>
                            </div>

                          </div>
                        </form>
                      )}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="h-100" style={{ background: '#F6F6F6' }}>
            <div className={` flex-grow-1 flex flex-column`}>
              {props.loading ? <Loading />
                : <>
                  <Droppable
                    droppableId={props.column._id!}
                    type="task"
                  >
                    {(provided, snapshot) => {
                      const allowedProps = { ref: provided.innerRef };
                      return (
                        <div
                          className={`pa2 flex-grow-1 flex flex-column overflow-auto ${snapshot.isDraggingOver ? 'bg-lightest-blue' : ''}`}
                          style={{
                            transition: 'background-color 0.2s ease',
                            // height: '25rem', 
                            minHeight: '100px',
                            whiteSpace: 'normal'
                          }}
                          {...provided.droppableProps}
                          {...allowedProps}
                        >
                          <div className="flex-grow-1">
                            {props.column.tasks!.map((task, index) =>
                              <TaskItem
                                key={task._id!}
                                task={task}
                                index={index}
                              />
                            )}
                          </div>
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </>
              }
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
        <Dialog
          onClose={() => setShowColumnFormDialog(!showColumnFormDialog)}
          title="Edit Column"
          isOpen={showColumnFormDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ColumnForm
            setShowColumnFormDialog={setShowColumnFormDialog}
            column={props.column}
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    loading: state.taskManagementReducer.boardReducer.dragTaskLoading,
    company: state.companyReducer.currentCompany
  };
};

export const Column = connect(mapStateToProps, null)(ColumnComponent);