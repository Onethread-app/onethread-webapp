import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import tick from 'resources/images/tick.svg';

import ContactUs from '../contact-us/ContactUs';

import './PricingCard.styles.scss';

interface IPricingCard {
  data: {
    name: string;
    type: string;
    options: string[];
    price: string;
  };
}

const PricingCard = (props: IPricingCard) => {
  const { data } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const [showContactUs, setShowContactUs] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [response, setResponse] = useState({
    status: 0,
    message: '',
  });

  const signUP = () => {
    history.push('/signup');
  };

  useEffect(() => {
    if (response.status === 201) {
      setShowSnackbar(true);
      setShowContactUs(false);
    }
  }, [response]);

  return (
    <>
      <div
        className={`pricing-card flex flex-column items-center h-100 ${
          data.type === 'startup' && 'pricing-card-startup'
        }`}
      >
        <div className='pricing-card-package'>
          {data.type === 'startup' && (
            <div className='pricing-plan-badge'>
              {t('app.company.Pricing.startup-discount')}
            </div>
          )}

          <h3 className='pricing-card-package-name'>
            {t(`app.company.Pricing.${data.type}.name`)}
          </h3>
          <p className='pricing-card-package-price'>
            {data.type === 'enterprise' ? (
              <p
                className='flex items-center justify-center pointer contact-us-text'
                style={{ height: '49px' }}
                onClick={() => setShowContactUs(true)}
              >
                <h3>{t('app.company.Pricing.Quotation')}</h3>
              </p>
            ) : (
              <p
                className='flex items-center justify-center'
                style={{ height: '49px', fontSize: '25px' }}
              >
                {t(`app.company.Pricing.${data.type}.price`)}
              </p>
            )}
          </p>
        </div>

        <div className='pricing-card-options flex flex-column items-start w-100 ml4'>
          {data.options.map((op, i) => (
            <div className='flex items-center mv1' key={i}>
              <img src={tick} alt='' className='mr1' />
              <p className='ma0'>
                {t(
                  `app.company.Pricing.${data.type}.option-${i + 1}`,
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={signUP}
          className={`${
            data.type === 'startup'
              ? 'start-button-startup'
              : 'start-button'
          }`}
        >
          {t('app.company.Pricing.Start-Free')}
        </button>
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
      {showContactUs && (
        <Dialog
          onClose={() => setShowContactUs(false)}
          isOpen={showContactUs}
          style={{
            background: '#fff',
            width: isMobileOnly ? '350px' : '600px',
          }}
          canOutsideClickClose
        >
          <div>
            <ContactUs
              setShowContactUs={setShowContactUs}
              setShowSnackbar={setShowSnackbar}
              setResponse={setResponse}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default PricingCard;
