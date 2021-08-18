import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Spinner } from '@blueprintjs/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
  },
}));

const ReportForm = (props: {
  setShowButtonReport: (val: boolean) => void;
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    status: 0,
    message: '',
  });
  const [issue, setIssue] = useState('');
  const [required, setRequired] = useState('');
  const [values, setValues] = useState({
    title: '',
    issueDetails: '',
    issueType: '',
    imageUrl: '',
  });

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleChangeType = (event) => {
    setRequired('');
    setIssue(event.target.value);
    setValues({ ...values, issueType: event.target.value });
  };

  const [imageName, setImageName] = useState({}) as any;
  const [imageError, setImageError] = useState('');

  const checkMimetype = [
    'image/apng',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/svg',
  ];

  const imageChangeHandler = async (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (!checkMimetype.includes(event.target.files[0].type)) {
          setImageName('');
          setImageError('This file format is not supported');
          return false;
        } else if (event.target.files[0].size / 1024 / 1024 > 5) {
          setImageName('');
          setImageError(`Image size can't be greater than 5 MB`);
          return false;
        } else {
          const data = new FormData();
          data.append(
            'file',
            event.target.files[0],
            event.target.files[0].name,
          );
          setImageName(event.target.files[0]);
          const headers = tokenConfig();
          const response = await tigrowApi.post(
            'files/upload/reportImage',
            data,
            headers,
          );
          setValues({ ...values, imageUrl: response.data.link });
          setImageError('');
        }
      }
    }

    return false;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (values.issueType === '') {
      setRequired(`${t('app.user.User-settings.Required')}`);
    } else {
      setLoading(true);
      const headers = tokenConfig();
      const response = await tigrowApi.post(
        'reports/',
        values,
        headers,
      );
      if (response) {
        setResponse({
          status: response.status,
          message: response.data.message,
        });
        setShowSnackbar(true);
        setTimeout(() => {
          props.setShowButtonReport(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <form className="fl w-100 pa4" onSubmit={onSubmit}>
        <h1 className="f4 lh-title tigrow-lightBlue mb4">
          {t('app.user.User-settings.Report-Issue')}
          {/* Report A Issue */}
        </h1>
        <div className="mb3">
          <h1 className="f6">
            {t('app.user.User-settings.Select-type')}
            {/* Please select a type */}
          </h1>
          <FormControl className={classes.formControl} required>
            <Select
              value={issue}
              onChange={handleChangeType}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={'None'}>None of them</MenuItem>
              <MenuItem value={'Bug'}>Bug</MenuItem>
            </Select>
            <small
              style={{
                color: '#ec3f3f',
              }}
              className="mb1"
            >
              {required}
            </small>
          </FormControl>
        </div>
        <div className="mb3">
          <div className="flex">
            <div className="bp3-input-group bp3-fill br0">
              <h1 className="f6 mb1">
                {t('app.user.User-settings.Tittle')}
              </h1>
              {/* <h1 className="f6">Tittle</h1> */}
              <input
                type="text"
                onChange={handleChange('title')}
                className="bp3-input"
                name="title"
                required
                style={{
                  paddingLeft: '0.6rem',
                }}
              />
            </div>
          </div>
        </div>
        <div className="mb3">
          <h1 className="f6 mb1">
            {t('app.user.User-settings.Details')}
          </h1>
          {/* <h1 className="f6">Details</h1> */}
          <textarea
            className="bp3-input w-100"
            name="issueDetails"
            id="issue-details"
            onChange={handleChange('issueDetails')}
            required
          />
        </div>
        <div className="mb3">
          <h1 className="f6 mb1">
            {t('app.user.User-settings.Add-Screenshot-Video')}{' '}
            {/* Add a Screenshot or Video */}
          </h1>
          <label className="bp3-file-input .modifier bp3-fill">
            <input
              type="file"
              accept=".gif, .jpg, .apng, .jpeg, .bmp, .svg, .png"
              onChange={(e) => imageChangeHandler(e)}
              required
            />
            <span className="bp3-file-upload-input">
              {imageName.name ? (
                imageName.name
              ) : (
                <p>{t('app.user.User-settings.Choose-file')}...</p>
                // <p>choose your file...</p>
              )}
            </span>
          </label>
          {imageError && (
            <small style={{ color: 'red' }}>{imageError}</small>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            style={{
              background: '#fff',
              outline: 'none',
              border: '1px solid #34b3e9',
              color: '#34b3e9',
            }}
            className="bp3-button w4 grow h2 pointer mr3"
            onClick={() => props.setShowButtonReport(false)}
          >
            {t('app.user.User-settings.Cancel')}
            {/* Cancel */}
          </button>
          <button
            type="submit"
            style={{
              background: '#34B3E9',
              outline: 'none',
              color: 'white',
            }}
            className="bp3-button w4 grow h2 pointer"
          >
            {loading ? (
              <Spinner size={15} />
            ) : (
              `${t('app.user.User-settings.Submit')}`
            )}
            {/* Submit */}
          </button>
        </div>
      </form>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MuiAlert
          severity={response.status === 201 ? 'success' : 'error'}
        >
          {response.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ReportForm;
