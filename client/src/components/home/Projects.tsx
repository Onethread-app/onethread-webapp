import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import { Dialog } from '@blueprintjs/core';
import CreateProjectDialog from 'components/project/CreateProjectDialog';

const Projects = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <>
      <div className="your-projects">
        <div className="flex justify-between w-100">
          <div>
            <h3>Your Project</h3>
          </div>
        </div>
        <div>
          <button onClick={() => setShowDialog(true)}>
            Create Project
          </button>
        </div>
      </div>
      {showDialog && (
        <Dialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          style={{
            width: isMobileOnly ? '95%' : '544px',
            maxWidth: '508px',
            height: '537px',
            background: '#ffffff',
            borderRadius: '10px',
          }}
        >
          <CreateProjectDialog setShowDialog={setShowDialog} />
        </Dialog>
      )}
    </>
  );
};

export default Projects;
