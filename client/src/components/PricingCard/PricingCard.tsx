import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import { Dialog } from '@blueprintjs/core';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// import { OTButton } from 'components/button/Button';
import ContactUs from '../contact-us/ContactUs';
import tick from 'resources/images/tick.svg';
import './PricingCard.styles.scss';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

interface IPricingCard {
  data: {
    name: string;
    type: string;
    options: string[];
    price: string;
  };
}

const PricingCard = (props: IPricingCard) => {
  const [showContactUs, setShowContactUs] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [response, setResponse] = React.useState({
    status: 0,
    message: '',
  });

  React.useEffect(() => {
    if (response.status === 201) {
      setShowSnackbar(true);
      setShowContactUs(false);
    }
  }, [response]);

  const { data } = props;

  const { t } = useTranslation();

  const history = useHistory();
  const signUP = () => {
    history.push('/signup');
  };

  return (
    <>
      <div
        className={`pricing-card flex flex-column items-center h-100 ${
          data.type === 'startup' && 'pricing-card-startup'
        }`}
      >
        <div className="pricing-card-package">
          {data.type === 'startup' && (
            <div className="pricing-plan-badge">
              {t('app.company.Pricing.startup-discount')}
            </div>
          )}

          <h3 className="pricing-card-package-name">
            {t(`app.company.Pricing.${data.type}.name`)}
          </h3>
          <p className="pricing-card-package-price">
            {data.type === 'enterprise' ? (
              <p
                className="flex items-center justify-center pointer contact-us-text"
                style={{ height: '49px' }}
                onClick={() => setShowContactUs(true)}
              >
                {/* <h3> Contact Us for Quotation</h3> */}
                <h3>{t('app.company.Pricing.Quotation')}</h3>
              </p>
            ) : (
              <p
                className="flex items-center justify-center"
                style={{ height: '49px', fontSize: '25px' }}
              >
                {t(`app.company.Pricing.${data.type}.price`)}
              </p>
            )}
          </p>
        </div>

        <div className="pricing-card-options flex flex-column items-start w-100 ml4">
          {data.options.map((op, i) => (
            <div className="flex items-center mv1" key={i}>
              <img
                src={tick}
                alt=""
                className="mr1"
                // style={{ width: '14px', height: '14px' }}
              />
              <p className="ma0">
                {t(
                  `app.company.Pricing.${data.type}.option-${i + 1}`,
                )}
              </p>
            </div>
          ))}
        </div>

        {/* <OTButton to="/signup">
          {t('app.company.Pricing.Start-Free')}
        </OTButton> */}

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
          canOutsideClickClose={true}
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
