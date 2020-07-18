import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid } from '@material-ui/core';

import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
// import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// import { makeStyles } from '@material-ui/core/styles';
import { createSubscription } from '../../../../stores/subscriptionBilling/Actions';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
// import axios from 'axios';
import Modal from 'react-modal';
// import { getPaymentIntent } from '../../../../stores/subscriptionBilling/Actions';
import {
  tokenConfig,
  portWalletCheckout,
} from '../../../../stores/UtilsActions';
import { tigrowApi } from '../../../../config';

// import { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import StripeCardSection from './StripeCardSection';
import PortwalletCardSaction from './PortwalletCardSaction';
import StripeSuccess from './StripeSuccess';
import { stripeCheckout } from 'stores/UtilsActions';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface IPlan {
  _id: string;
  pricing: number;
}

interface ICheckout {
  currentComponent: string;
  clientSecret: string;
  userFirstName: string;
  userLastName: string;
  changeComponentTo: (componentName: string) => any;
  company: string;
  plan: IPlan;
  createSubscription: (subID) => void;
  companyName: string;
}

function _Checkout(props: ICheckout) {
  const [value, setValue] = React.useState('bangladesh');
  const [success, setSuccess] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    city: '',
    state: '',
    house: '',
  });
  const stripe = useStripe();
  const elements = useElements();
  const headers = tokenConfig();

  //to-do add type
  const getPortWalletFormData = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevState: any) => ({
      ...prevState,
      [id]: value,
    }));
  };

  function closeModal() {
    setSuccess(false);
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> master
    const getSubscription = await tigrowApi.post(
      'subscriptions',
      { companyId: props.company, plan: props.plan._id },
      headers,
    );
    props.createSubscription(getSubscription.data.subscription);
    const getway =
      value === 'international' ? 'stripe' : 'portwallet';

    const stripeSuccess =
      value === 'international' &&
      (await stripeCheckout(
        stripe,
        props.company,
        getway,
        props.userLastName,
        props.userFirstName,
        CardElement,
        elements,
        getSubscription,
        props.plan.pricing,
      ));
    stripeSuccess && setSuccess(stripeSuccess);
    value === 'bangladesh' &&
      portWalletCheckout(
        formValues,
        props.plan.pricing,
        props.plan._id,
        props.companyName,
      );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValue((event.target as HTMLInputElement).value);
  };
  return (
    <div>
      {props.currentComponent === 'checkOut' && (
        <div>
          <div className="mb1">
            <Button
              //   className={classes.button}
              startIcon={<ArrowBackIosIcon />}
              onClick={() => props.changeComponentTo('base')}
            >
              subscription and billing
            </Button>
          </div>
          <h4>Total Payable Bill</h4>
          <Grid container>
            <Grid item xs={4}>
              <Card>
                <Grid justify="space-between" container>
                  <Grid item>
                    <CardContent>
                      <p className="b">Package Name</p>
                      <label>Small</label>
                    </CardContent>
                  </Grid>

                  <Grid item>
                    <CardContent
                      style={{
                        marginTop: '26px',
                        marginLeft: '15px',
                      }}
                    >
                      <label>$0.99</label>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Card style={{ marginTop: '1px' }}>
                <Grid justify="space-between" container>
                  <Grid item>
                    <CardContent>
                      <label>Promo</label>
                    </CardContent>
                  </Grid>

                  <Grid item>
                    <CardContent style={{ marginLeft: '15px' }}>
                      <label>$0.00</label>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Card style={{ marginTop: '1px' }}>
                <Grid justify="space-between" container>
                  <Grid item>
                    <CardContent>
                      <label className="b">Total</label>
                    </CardContent>
                  </Grid>

                  <Grid item>
                    <CardContent style={{ marginLeft: '15px' }}>
                      <label>$0.99</label>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <Card style={{ marginTop: '10px' }}>
                <Grid justify="space-between" container>
                  <Grid item>
                    <CardContent style={{ marginTop: '12px' }}>
                      <TextField
                        id="standard-basic"
                        // label="Standard"
                        placeholder="Add Promo (optional)"
                      />
                    </CardContent>
                  </Grid>

                  <Grid item>
                    <CardContent style={{ marginLeft: '15px' }}>
                      <Button variant="contained" color="primary">
                        Add
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <h4>Payment Option</h4>
          <RadioGroup
            aria-label="payment"
            name="gender1"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="international"
              control={<Radio />}
              label="International"
            />
            <FormControlLabel
              value="bangladesh"
              control={<Radio />}
              label="Bangladesh"
            />
          </RadioGroup>
          {value === 'international' && (
            <div style={{ marginTop: '10px' }}>
              <label className="b mt5">Card Details</label>
              <div className="mt3">
                <Grid container>
                  <Grid item xs={6}>
                    <Card style={{ marginTop: '10px' }}>
                      <CardContent style={{ marginTop: '12px' }}>
                        <StripeCardSection />
                        <Button
                          style={{ marginTop: '15px' }}
                          fullWidth
                          onClick={(e) => handleSubmit(e)}
                          variant="contained"
                          color="primary"
                        >
                          Pay Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
          {value === 'bangladesh' && (
            <PortwalletCardSaction
              handleSubmit={handleSubmit}
              getPortWalletFormData={getPortWalletFormData}
            />
          )}
        </div>
      )}
      {success && (
        <Modal
          isOpen={success}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <StripeSuccess text="We have recieved your payment" />
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  clientSecret: state.subscriptionReducer.paymentId,
  userFirstName: state.userReducer.user.firstName,
  userLastName: state.userReducer.user.lastName,
  company: state.companyReducer.currentCompany._id,
  companyName: state.companyReducer.currentCompany.name,
});

const Checkout = connect(mapStateToProps, { createSubscription })(
  _Checkout,
);

export default Checkout;
