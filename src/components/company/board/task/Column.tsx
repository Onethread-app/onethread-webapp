import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { TaskItem } from './TaskItem'
import { Button, Popover, Menu, MenuItem, Dialog } from '@blueprintjs/core'
import { IColumn } from 'stores/board/Reducer'
import { TaskForm } from './TaskForm'
import { connect } from 'react-redux'
import { Loading } from 'components/common/field/Loading'

interface ColumnProps {
  key: string
  column: IColumn;
  index: number;
}

interface ColumnInternalProps extends ColumnProps {
  loading?: boolean
}

const ColumnComponent = (props: ColumnInternalProps) => {

  const [showColumnFormDialog, setShowColumnFormDialog] = useState(false);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  return (
    <>
      <div className="pl2 pb2 dib bg-white h-100 w-34 w-50-m">
        <div className="flex flex-column h-100 b--black-20 ba br2 bw1">
          <div className="flex bb b--black-10">
            <h3
              className="pa2 ma0 flex-grow-1"
            >
              {props.column.name}
            </h3>
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
                  icon="more"
                  minimal={true}
                  small={true}
                />
              }
            />
          </div>
          <div className={` flex-grow-1 flex flex-column`}>
            {props.loading ? <Loading />
              : <>
                <Droppable
                  droppableId={props.column._id!}
                  type="task"
                >
                  {(provided, snapshot) => {
                    const allowedProps = { ref: provided.innerRef }
                    return (
                      <div
                        className={`pa2 flex-grow-1 flex flex-column h5 overflow-auto ${snapshot.isDraggingOver ? 'bg-lightest-blue' : 'bg-white'}`}
                        style={{ transition: 'background-color 0.2s ease', minHeight: '100px', whiteSpace: 'normal' }}
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
                    )
                  }}
                </Droppable>
                <div className="overflow-hidden ph2">
                  <Button
                    className="grow h2 mb2 pointer bp3-minimal"
                    style={{
                      background: "#0fa3a3",
                      outline: "none",
                      color: 'white'
                    }}
                    text="Add Task"
                    fill={true}
                    onClick={() => setShowTaskFormDialog(!showTaskFormDialog)}
                  />
                </div>
              </>
            }
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
          {/* <ColumnForm 
            setShowColumnFormDialog={setShowColumnFormDialog}
            boardColumn={props.column}
          /> */}
          Column edit form
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.taskManagementReducer.boardReducer.dragTaskLoading,
  }
}

export const Column = connect(mapStateToProps, null)(ColumnComponent);