import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { ProjectOutlineEditor } from './ProjectOutlineEditor';

interface IProjectDescriptionViewProps {
  headline: string;
  projectOutline: string;
}

export const ProjectOutlineView = (props: IProjectDescriptionViewProps ) => {
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
        <ProjectOutlineEditor
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() => setEditDescriptionDialog(!editDescriptionDialog)}
        /> : undefined}
      <p className="pr2">{props.projectOutline}</p>
    </>
  );
};