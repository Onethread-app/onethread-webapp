import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { ProjectDescriptionEditor } from './ProjectDescriptionEditor';
// import { projectPrefaceDescriptionUpdate } from '../../../stores/project/Actions';

interface IProjectDescriptionViewProps {
  headline: string;
  description: string;
}

export const ProjectDescriptionView = (props: IProjectDescriptionViewProps) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(false);
  return (
    <>
      <div className='flex justify-between' style={{ height: '30px' }}>
        <div>
          {console.log(props)}
          <h1 className='f6'>{props.headline}</h1>
        </div>
        <div className='pr2' style={{ paddingTop: '10px' }}>
          <Icon
            className='fr silver pointer'
            icon='edit'
            onClick={() => {
              setEditDescriptionDialog(true);
            }}
          />
        </div>
      </div>
      {editDescriptionDialog ? (
        <ProjectDescriptionEditor
          // projectPrefaceDescriptionUpdate={projectPrefaceDescriptionUpdate}
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : (
        undefined
      )}
      <p className='pr2'>{props.description}</p>
    </>
  );
};
