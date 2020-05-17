import React, { useState } from 'react';
import { TaskDescriptionEditor } from './TaskDescriptionEditor';
import { Icon } from '@blueprintjs/core';
import { connect, useDispatch } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { projectPermit } from 'stores/UtilsActions';
import { ICompany } from 'stores/company/Reducer';
import { board } from 'stores/board/Types';

interface TaskDescriptionViewInternalProps {
  description?: ITask['description'];
  company?: ICompany;
}

export const TaskDescriptionViewComponent = (
  props: TaskDescriptionViewInternalProps,
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(
    false,
  );
  const dispatch = useDispatch();
  return (
    <>
      <div
        className="flex justify-between"
        style={{ height: '30px' }}
      >
        <div>
          <h1 className="f6">Description</h1>
        </div>
        <div className="pr2" style={{ paddingTop: '10px' }}>
          {props.company && projectPermit(props.company.role) ? (
            <Icon
              className={
                editDescriptionDialog
                  ? 'fr tigrow-lightBlue pointer'
                  : 'fr silver pointer'
              }
              icon="edit"
              onClick={() => {
                dispatch({type: board.CLEAR_STATUS_CODE});
                setEditDescriptionDialog(!editDescriptionDialog);
              }}
            />
          ) : undefined}
        </div>
      </div>
      {editDescriptionDialog ? (
        <TaskDescriptionEditor
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={(e) =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : props.description ? (
        <p
          className="pr2 ws-break"
          style={{ whiteSpace: 'pre-line' }}
        >
          {props.description}
        </p>
      ) : (
        <p className="pr2">Description has not been given yet</p>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    description:
      state.boardIndexReducer.boardReducer.currentTask.description,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskDescriptionView = connect(
  mapStateToProps,
  null,
)(TaskDescriptionViewComponent);
