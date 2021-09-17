import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { ChangePasswordComponent } from 'layouts/user/settings/ChangePasswordComponent';
import { LanguageSettings } from '../LanguageSettingsComponent/LanguageSettingsComponent';

export const ProfileSettingsComponent = () => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="bl b--black-05 bw1 pl3-ns pl1 vh-50">
      <Button
        type="submit"
        className="grow pointer outline-0 shadow-0-ns h2 changepass"
        style={{
          background: '#34b3e9',
          color: 'white',
        }}
        onClick={() => setShowDialog(true)}
      >
        {t('app.user.User-settings.Password')}
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

const ProfileSettingsPageComponent = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white mh4 mv5 br3 pa4-ns h-75 shadow-4-ns w-90-ns">
      <Tabs id="TabsExample" vertical={true}>
        <Tab
          id="profile_settings"
          title={t('app.user.User-settings.Profile')}
          panel={<ProfileSettingsComponent />}
          className="outline-0 w-100"
        />
        <Tab
          id="language_settings"
          title={t('app.user.User-settings.Language-Settings')}
          panel={<LanguageSettings />}
          className="outline-0 w-100"
        />
      </Tabs>
    </div>
  );
};

export const ProfileSettingsPage = connect(
  null,
  null,
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
