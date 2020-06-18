import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Dialog, Button } from '@blueprintjs/core';
import { ChangePasswordComponent } from 'layouts/user/settings/ChangePasswordComponent';

export const ProfileSettingsComponent = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="bl b--black-05 bw1 pl3-ns pl1 vh-50">
      <Button
        type="submit"
        className="grow pointer outline-0 shadow-0-ns h2 changepass"
        style={{
          background: '#0fa3a3',
          color: 'white',
        }}
        onClick={() => setShowDialog(true)}
      >
        Change Password
      </Button>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
          className="ma2"
        >
          <div>
            <ChangePasswordComponent setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </div>
  );
};

const ProfileSettingsPageComponent = () => (
  <div className="bg-white mh4 mv5 br3 pa4-ns h-75 shadow-4-ns w-90-ns">
    <Tabs id="TabsExample" vertical={true}>
      <Tab
        id="profile_settings"
        title="Profile Settings"
        panel={<ProfileSettingsComponent />}
        className="outline-0 w-100"
      />
    </Tabs>
  </div>
);
export const ProfileSettingsPage = connect(
  null,
  null,
)(ProfileSettingsPageComponent);
