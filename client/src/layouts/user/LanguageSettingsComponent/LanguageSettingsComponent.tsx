import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tigrowApi } from 'config';
import { connect } from 'react-redux';

import FormControl from '@material-ui/core/FormControl/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { tokenConfig } from 'stores/UtilsActions';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const LanguageSettingsComponent = (props: any) => {
  const classes = useStyles();
  const headers = tokenConfig();
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [language, setLanguage] = useState('');

  const handleLanguage = async () => {
    if (props.user.language) {
      setLanguage(props.user.language);
      changeLanguage(props.user.language);
    } else {
      setLanguage('en');
      changeLanguage('en');
    }
  };

  const handleChange = async (event) => {
    const value = event.target.value;
    let data = {
      language: value,
    };
    const response = await tigrowApi.post(
      'accounts/save-language/',
      data,
      headers,
    );
    if (response) {
      setLanguage(value);
      changeLanguage(value);
    } else {
      setLanguage('en');
      changeLanguage('en');
    }
  };

  useEffect(() => {
    handleLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const LanguageSettings = connect(mapStateToProps)(
  LanguageSettingsComponent,
);
