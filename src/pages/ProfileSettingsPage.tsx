import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Dialog, Button } from '@blueprintjs/core';
import { ChangePasswordComponent } from 'components/common/ChangePasswordComponent';

const ProfileSettingsPageComponent = () => (
  <div className="bg-white mh4 mv5 br3 pa3">
    <Tabs
      id="TabsExample"
      className=""
      vertical={true}
    >
      <Tab
        id="profile_settings"
        title="Profile Settings"
        panel={<ProfileSettingsComponent />}
        className="outline-0 w-100"
      />
    </Tabs>
  </div>
);

export const ProfileSettingsPage = connect(null, null)(ProfileSettingsPageComponent)

export const ProfileSettingsComponent = () => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <div className="bl b--black-05 bw1 pl3">
      <Button
        className="br3 grow ph4 pointer pv2 f7 bg-white ba b--lightBlue tigrow-lightBlue outline-0"
        onClick={() => setShowDialog(true)}
      >
        Change Password
      </Button>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
          title="Change Password"
          canOutsideClickClose={false}
        >
          <div>
            <ChangePasswordComponent setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </div>
  )
}