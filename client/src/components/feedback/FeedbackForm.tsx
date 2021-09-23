import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { tigrowApi } from 'config';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import { Slider } from '@blueprintjs/core/lib/esm/components/slider/slider';
import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { tokenConfig } from 'stores/UtilsActions';

import './FeedbackForm.styles.scss';

interface IFeedbackForm {
  uniqueCompanyName: string;
}

const FeedbackForm = (props: IFeedbackForm) => {
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [response, setResponse] = useState({
    status: 0,
    message: '',
  });
  const [values, setValues] = useState({
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

  const renderLabel = (val: number) => `${val}`;

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

  useEffect(() => {
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
  }, [response]);

  return (
    <>
      <div className='feedback-form flex flex-column items-center justify-center pa4 ma1'>
        <h2>{t('app.company.Feedback.Feedback')}</h2>
        <form className='flex flex-column'>
          <div className='flex flex-column'>
            <label
              htmlFor='recommend'
              style={{ marginBottom: '1rem' }}
            >
              <span>
                {t('app.company.Feedback.Opinion-1.Number')}
              </span>
              {t('app.company.Feedback.Opinion-1.text')}
            </label>
            <Slider
              min={1}
              max={10}
              stepSize={1}
              onChange={handleSliderChange}
              labelRenderer={renderLabel}
              showTrackFill
              value={sliderValue}
              vertical={false}
              className='w-80 self-center'
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
            <p className='f6 fw6 mv2'>
              {t('app.company.Feedback.Optional')}
            </p>
          </div>
          <div className='flex flex-column'>
            <label htmlFor='improve'>
              <span>
                {t('app.company.Feedback.Opinion-2.Number')}
              </span>
              {t('app.company.Feedback.Opinion-2.text')}
            </label>
            <TextArea
              growVertically
              large
              onChange={handleChange}
              name='improve'
              value={values.improve}
              className='w-80'
            />
          </div>
          <div className='flex flex-column'>
            <label htmlFor='usefulFeature'>
              <span>
                {t('app.company.Feedback.Opinion-3.Number')}
              </span>
              {t('app.company.Feedback.Opinion-3.text')}
            </label>
            <TextArea
              growVertically
              large
              onChange={handleChange}
              name='usefulFeature'
              value={values.usefulFeature}
              className='w-80'
            />
          </div>
          <div className='flex flex-column'>
            <label htmlFor='wishFeature'>
              <span>
                {t('app.company.Feedback.Opinion-4.Number')}
              </span>
              {t('app.company.Feedback.Opinion-4.text')}
            </label>
            <TextArea
              growVertically
              large
              onChange={handleChange}
              name='wishFeature'
              value={values.wishFeature}
              className='w-80'
            />
          </div>
          <div
            className='feedback-form-buttons flex self-end'
            style={{
              marginRight: '20%',
            }}
          >
            <Button onClick={handleClear} className='grow'>
              {t('app.company.Feedback.Clear')}
            </Button>
            <Button
              type='submit'
              onClick={handleSubmit}
              className='grow'
            >
              {t('app.company.Feedback.Submit')}
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
