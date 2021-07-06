import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Slider, TextArea } from '@blueprintjs/core';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';

import './FeedbackForm.styles.scss';
import { useTranslation } from 'react-i18next';

interface IFeedbackForm {
  uniqueCompanyName: string;
}

const FeedbackForm = (props: IFeedbackForm) => {
  const [sliderValue, setSliderValue] = React.useState(1);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [response, setResponse] = React.useState({
    status: 0,
    message: '',
  });
  const [values, setValues] = React.useState({
    bug: '',
    improve: '',
    usefulFeature: '',
    wishFeature: '',
  });

  const history = useHistory();

  const handleSliderChange = (val: number) => {
    setSliderValue(val);
  };

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const renderLabel = (val: number) => {
    return `${val}`;
  };

  const handleClear = () => {
    setValues({
      improve: '',
      bug: '',
      usefulFeature: '',
      wishFeature: '',
    });
    setSliderValue(1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = { ...values, rating: sliderValue };

    const headers = tokenConfig();

    if ((headers as any).headers.Authorization) {
      const res = await tigrowApi.post('/feedback', payload, headers);
      if (res) {
        setResponse({
          status: res.status,
          message: res.data.message,
        });
        handleClear();
        setShowSnackbar(true);
      }
    }
  };

  React.useEffect(() => {
    let timeout: any;
    if (response.status === 201) {
      timeout = setTimeout(() => {
        setResponse({
          status: 0,
          message: '',
        });
        history.push(`/company/${props.uniqueCompanyName}/feedback`);
      }, 4000);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const { t } = useTranslation();

  return (
    <>
      <div className="feedback-form flex flex-column items-center justify-center pa4 ma1">
        <h2>{t('app.company.Feedback.Feedback')}</h2>
        {/* <h2>Feedback</h2> */}
        <form className="flex flex-column">
          <div className="flex flex-column">
            <label
              htmlFor="recommend"
              style={{ marginBottom: '1rem' }}
            >
              <span>{t('app.company.Feedback.Opinion-1.Number')}</span>{t('app.company.Feedback.Opinion-1.text')}
              {/* <span>1. </span>On a scale of 1-10, how likely are you
              to recommend our product to a friend/colleague? */}
            </label>
            <Slider
              min={1}
              max={10}
              stepSize={1}
              onChange={handleSliderChange}
              labelRenderer={renderLabel}
              showTrackFill={true}
              value={sliderValue}
              vertical={false}
              className="w-80 self-center"
              intent={
                sliderValue < 4
                  ? 'danger'
                  : sliderValue < 6
                  ? 'warning'
                  : sliderValue < 8
                  ? 'primary'
                  : 'success'
              }
            />
          </div>
          <div>
            <p className="f6 fw6 mv2">
              {t('app.company.Feedback.Optional')}
              {/* Please help us understand your rating by answering the
              following questions (Optional): */}
            </p>
          </div>
          <div className="flex flex-column">
            <label htmlFor="improve">
              <span>{t('app.company.Feedback.Opinion-2.Number')}</span>{t('app.company.Feedback.Opinion-2.text')}
              {/* <span>2. </span>What feature can we improve? */}
            </label>
            <TextArea
              growVertically={true}
              large={true}
              onChange={handleChange}
              name="improve"
              value={values.improve}
              className="w-80"
            />
          </div>
          <div className="flex flex-column">
            <label htmlFor="usefulFeature">
              <span>{t('app.company.Feedback.Opinion-3.Number')}</span>{t('app.company.Feedback.Opinion-3.text')}
              {/* <span>3. </span>What feature was useful? */}
            </label>
            <TextArea
              growVertically={true}
              large={true}
              onChange={handleChange}
              name="usefulFeature"
              value={values.usefulFeature}
              className="w-80"
            />
          </div>
          <div className="flex flex-column">
            <label htmlFor="wishFeature">
              <span>{t('app.company.Feedback.Opinion-4.Number')}</span>{t('app.company.Feedback.Opinion-4.text')}
              {/* <span>4. </span>What feature do you wish we could
              provide? */}
            </label>
            <TextArea
              growVertically={true}
              large={true}
              onChange={handleChange}
              name="wishFeature"
              value={values.wishFeature}
              className="w-80"
            />
          </div>
          <div
            className="feedback-form-buttons flex self-end"
            style={{
              marginRight: '20%',
            }}
          >
            <Button onClick={handleClear} className="grow">
              {t('app.company.Feedback.Clear')}
              {/* Clear */}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="grow"
            >
              {t('app.company.Feedback.Submit')}
              {/* Submit */}
            </Button>
          </div>
        </form>
      </div>
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

const mapStateToProps = (state: any) => ({
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
});

export default connect(mapStateToProps, {})(FeedbackForm);
