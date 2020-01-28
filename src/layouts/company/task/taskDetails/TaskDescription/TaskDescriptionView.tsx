import React, { useState } from 'react';
import { TaskDescriptionEditor } from './TaskDescriptionEditor';
import { Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';

interface TaskDescriptionViewInternalProps {
  description?: string;
}

export const TaskDescriptionViewComponent = (props: TaskDescriptionViewInternalProps) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(false);
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="f6">Description</h1>
        </div>
        <div>
          <Icon className="fr mv3 tigrow-lightBlue pointer mr4"
            icon="edit"
            onClick={() => setEditDescriptionDialog(true)}
          />
        </div>
      </div>
      {editDescriptionDialog ?
        <TaskDescriptionEditor
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={e => setEditDescriptionDialog(!editDescriptionDialog)}
        /> :

        props.description ?
          <div className="pr2">{props.description}</div> : 'Description has not been given yet'
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    description: state.boardIndexReducer.boardReducer.currentTask.description,
  };
};

export const TaskDescriptionView = connect(mapStateToProps, null)(TaskDescriptionViewComponent);
