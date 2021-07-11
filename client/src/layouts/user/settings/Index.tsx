import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Dialog, Button } from '@blueprintjs/core';
import { ChangePasswordComponent } from 'layouts/user/settings/ChangePasswordComponent';
import { getLocation } from 'helpers/utils';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

export const ProfileSettingsComponent = () => {

  const [showDialog, setShowDialog] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="bl b--black-05 bw1 pl3-ns pl1 vh-50">
      <Button
        type="submit"
        className="grow pointer outline-0 shadow-0-ns h2 changepass"
        style={{
          background: '#3F61C5',
          color: 'white',
        }}
        onClick={() => setShowDialog(true)}
      >
        {t('app.user.User-settings.Password')}
        {/* Change Password */}
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const LanguageSettingsComponent = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [language, setLanguage] =useState('');
  const classes = useStyles();

  useEffect(() => {

    getLocation().then((data) => {
      const country = data.data.country;

      localStorage.setItem('city', data.data.city);
      localStorage.setItem('country', country);

      if (country === 'Bangladesh') {
        setLanguage('bn')
        changeLanguage('bn');
      } else {
        setLanguage('en')
        changeLanguage('en');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === 'bn') {
      setLanguage('bn')
      changeLanguage('bn');
    }
    if (value === 'en') {
      setLanguage('en')
      changeLanguage('en');
    }
  };

  return (
  <FormControl className={classes.formControl}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          onChange={handleChange}
        >
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'bn'}>বাংলা</MenuItem>
        </Select>
      </FormControl>
  );
};


const ProfileSettingsPageComponent = () => {
  const { t } = useTranslation();
  return(
    <div className="bg-white mh4 mv5 br3 pa4-ns h-75 shadow-4-ns w-90-ns">
      <Tabs id="TabsExample" vertical={true}>
        <Tab
          id="profile_settings"
          title={t('app.user.User-settings.Profile')}
          // title="Profile Settings"
          panel={<ProfileSettingsComponent />}
          className="outline-0 w-100"
        />
        <Tab
          id="language_settings"
          title={t('app.user.User-settings.Language-Settings')}
          // title="Language Settings"
          panel={<LanguageSettingsComponent />}
          className="outline-0 w-100"
        />
      </Tabs>
    </div>
  )
};

// const ProfileSettingsPageComponent = () => (
//   <div className="bg-white mh4 mv5 br3 pa4-ns h-75 shadow-4-ns w-90-ns">
//     <Tabs id="TabsExample" vertical={true}>
//       <Tab
//         id="profile_settings"
//         // title={t('app.user.User-settings.Profile')}
//         title="Profile Settings"
//         panel={<ProfileSettingsComponent />}
//         className="outline-0 w-100"
//       />
//     </Tabs>
//   </div>
// );

export const ProfileSettingsPage = connect(
  null,
  null,
)(ProfileSettingsPageComponent);
