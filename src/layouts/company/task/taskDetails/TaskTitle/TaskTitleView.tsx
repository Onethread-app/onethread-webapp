import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { TaskTitleEditor } from './TaskTitleEditor';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
}

export const TaskTitleViewComponent = (props: TaskDetailsInternalProps) => {
  const [nameEdit, setNameEdit] = useState(false);

  return (
    <>
      {nameEdit ? (
        <TaskTitleEditor
          nameEdit={nameEdit}
          setNameEdit={e => setNameEdit(!nameEdit)}
        />
      )
        :
        (<h3 className="f4" onClick={() => setNameEdit(true)}>{props.currentTask!.name}</h3>)
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
  };
};

export const TaskTitleView = connect(mapStateToProps, null)(TaskTitleViewComponent);