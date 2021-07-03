import React from 'react';

import { Dialog } from '@blueprintjs/core';

import LinkGeneratorPopup from 'components/conference/LinkGeneratorPopup';

import More from 'resources/svg/More.svg';
import Conference from 'resources/svg/Conference.svg';

const VideoConference = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  return (
    <div className="video-conference">
      <div className="flex justify-between w-100">
        <div>
          <h3>Video Conferences</h3>
          <p>Make Your Team align</p>
        </div>
        <div>
          <img src={More} alt="more" className="pointer" />
        </div>
      </div>
      <div>
        <img
          src={Conference}
          alt="conference"
          className="pointer"
          onClick={() => setShowDialog(true)}
        />
      </div>
      <div>
        <button onClick={() => setShowDialog(true)}>
          Create link
        </button>
      </div>
      {showDialog && (
        <Dialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          style={{
            width: '544px',
            height: '273px',
            background: '#ffffff',
            borderRadius: '20px',
          }}
        >
          <LinkGeneratorPopup />
        </Dialog>
      )}
    </div>
  );
};

export default VideoConference;
