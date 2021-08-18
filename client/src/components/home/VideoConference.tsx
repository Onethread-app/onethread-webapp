import React from 'react';

import { isMobileOnly } from 'react-device-detect';
import { Dialog } from '@blueprintjs/core';
import LinkGeneratorPopup from 'components/conference/LinkGeneratorPopup';
import { useTranslation } from 'react-i18next';

// import Conference from 'resources/svg/Conference.svg';

const VideoConference = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const { t } = useTranslation();
  return (
    <div className="video-conference">
      <div className="flex justify-between w-100">
        <div>
          <h3>{t('app.Video-Conferences.Video-Conferences')}</h3>
          <p>{t('app.Video-Conferences.Make-Team-align')}</p>
          {/* <h3>Video Conferences</h3>
          <p>Make Your Team align</p> */}
        </div>
      </div>
      {/* <div>
        <img
          src={Conference}
          alt="conference"
          className="pointer"
          onClick={() => setShowDialog(true)}
        />
      </div> */}
      <div>
        <button onClick={() => setShowDialog(true)}>
          {t('app.Video-Conferences.Create-link')}
          {/* Create link */}
        </button>
      </div>
      {showDialog && (
        <Dialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          style={{
            width: isMobileOnly ? '95%' : '544px',
            maxWidth: '544px',
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
