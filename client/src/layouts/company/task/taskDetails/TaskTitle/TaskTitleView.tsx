import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { TaskTitleEditor } from './TaskTitleEditor';
import { ICompany } from 'stores/company/Reducer';
import { projectPermit } from 'stores/UtilsActions';
import { board } from 'stores/board/Types';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
  company?: ICompany;
}

export const TaskTitleViewComponent = (
  props: TaskDetailsInternalProps,
) => {
  const [nameEdit, setNameEdit] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      {nameEdit ? (
        <TaskTitleEditor
          nameEdit={nameEdit}
          setNameEdit={(e) => setNameEdit(!nameEdit)}
        />
      ) : (
        <h3
          title="Click to edit title"
          className="f4 mb0 overflow-hidden w-100 mb1 dim"
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'text',
          }}
          onClick={() => {
            dispatch({type: board.CLEAR_STATUS_CODE});
            props.company && projectPermit(props.company.role)
              ? setNameEdit(true)
              : setNameEdit(false);
          }}
        >
          {props.currentTask!.name}
        </h3>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskTitleView = connect(
  mapStateToProps,
  null,
)(TaskTitleViewComponent);
