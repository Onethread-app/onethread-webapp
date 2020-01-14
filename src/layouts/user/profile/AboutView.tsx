import { User } from 'stores/user/Reducer';
import React, { useState } from 'react';
import { Icon, Dialog } from '@blueprintjs/core';
import { AboutEdit } from './AboutEditor';
import { connect } from 'react-redux';

interface AboutViewProps {
  user: User;
}

const AboutViewComponent = (props: AboutViewProps) => {

  const [showDialogAbout, setShowDialogAbout] = useState(false);

  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <div className="cf ">
          <h1
            className="f5 lh-copy dib tigrow-lightGray-1 ws-break"
          >
            About
					</h1>
          <Icon
            className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialogAbout(true)}
          />
        </div>
        <div>
          <pre className="ws-break" style={{ whiteSpace: 'pre-line' }}>
            {props.user.about}
          </pre>
        </div>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <AboutEdit setShowDialog={setShowDialogAbout} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const AboutView = connect(mapStateToProps)(AboutViewComponent);