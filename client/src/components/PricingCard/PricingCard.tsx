import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import { Dialog } from '@blueprintjs/core';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { OTButton } from 'components/button/Button';
import ContactUs from '../contact-us/ContactUs';
import tick from 'resources/images/tick.svg';
import './PricingCard.styles.scss';

interface IPricingCard {
  data: {
    name: string;
    type: string;
    options: string[];
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

  return (
    <>
      <div className="pricing-card flex flex-column items-center">
        <div className="pricing-card-package">
          <h3 className="pricing-card-package-name">{data.name}</h3>
          <p className="pricing-card-package-price">
            {data.type === 'startup' ? (
              <p
                className="flex items-center justify-center"
                style={{ height: '49px' }}
              >
                ${' '}
                <span
                  style={{ fontSize: '42px', lineHeight: '49px' }}
                >
                  1
                </span>
                /user/mon
              </p>
            ) : data.type === 'free' ? (
              <p
                className="flex items-center justify-center"
                style={{ height: '49px' }}
              >
                ${' '}
                <span
                  style={{ fontSize: '42px', lineHeight: '49px' }}
                >
                  0
                </span>
              </p>
            ) : (
              <p
                className="flex items-center justify-center pointer contact-us-text"
                style={{ height: '49px' }}
                onClick={() => setShowContactUs(true)}
              >
                <h3> Contact Us for Quotation</h3>
              </p>
            )}
          </p>
        </div>
        <div className="pricing-card-divider"></div>

        <OTButton to="/signup">Start For Free</OTButton>

        <div className="pricing-card-divider"></div>
        <div className="pricing-card-options flex flex-column items-start w-100 ml4">
          {data.options.map((op, i) => (
            <div className="flex items-center mv1" key={i}>
              <img
                src={tick}
                alt=""
                className="mr1"
                // style={{ width: '14px', height: '14px' }}
              />
              <p className="ma0">{op}</p>
            </div>
          ))}
        </div>
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
