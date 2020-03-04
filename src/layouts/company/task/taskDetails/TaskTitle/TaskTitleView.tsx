import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { TaskTitleEditor } from './TaskTitleEditor';
import { ICompany } from 'stores/company/Reducer';
import { permit } from 'stores/UtilsActions';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
  company?: ICompany;
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
        (<h3 className="f4 mb0 overflow-hidden w-100 mb1"
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'text'
          }}
          onClick={() => {
            props.company && permit(props.company.role) ?
              setNameEdit(true)
              : setNameEdit(false);
          }}>
          {props.currentTask!.name}
        </h3>)
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    company: state.companyReducer.currentCompany
  };
};

export const TaskTitleView = connect(mapStateToProps, null)(TaskTitleViewComponent);