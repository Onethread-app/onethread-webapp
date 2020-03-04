import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ProjectDescriptionEditor } from './ProjectDescriptionEditor';

interface IProjectDescriptionViewProps {
  headline: string;
}

export const ProjectDescriptionViewComponent = (props: IProjectDescriptionViewProps) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(false);
  return (
    <>
      <div className="flex justify-between" style={{ height: '30px' }}>
        <div>
          <h1 className="f6">{props.headline}</h1>
        </div>
        <div className="pr2" style={{ paddingTop: '10px' }}>
          <Icon className="fr silver pointer"
            icon="edit"
            onClick={() => {
              setEditDescriptionDialog(true);
            }}
          />
        </div>
      </div>
      {editDescriptionDialog ?
        <ProjectDescriptionEditor
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() => setEditDescriptionDialog(!editDescriptionDialog)}
        /> : undefined}
      <p className="pr2 ws-break"
        style={{ whiteSpace: 'pre-line' }}
      ></p>
      <p className="pr2">Description/Outline has not been given yet</p>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    description: state.boardIndexReducer.boardReducer.currentTask.description,
    company: state.companyReducer.currentCompany
  };
};

export const ProjectDescriptionView = connect(mapStateToProps, null)(ProjectDescriptionViewComponent);
