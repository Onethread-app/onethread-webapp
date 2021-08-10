import React from 'react';
import Card from '@material-ui/core/Card';
import { Grid } from '@material-ui/core';

import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
// import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
import {
  createSubscription,
  checkCouponValidity,
  getTotalMembers,
} from '../../../../stores/subscriptionBilling/Actions';
import TextField from '@material-ui/core/TextField';

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
import BkashCards from './BkashCards';
import PortwalletIcon from '../../../../resources/LandingImages/portwallet.svg';
import BkashIcon from '../../../../resources/LandingImages/bkash.svg';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import './subscription.scss';

const useStyles = makeStyles({
  root: {
    color: 'white',
    fontSize: 14,
    padding: '6px 16px',
    backgroundColor: '#34b3e9',
    textTransform: 'none',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#34b3e9',
    },
    '&:active': {
      backgroundColor: '#27CB53',
    },
    '&:focus': {
      backgroundColor: '#27CB53',
    },
  },
});

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
  checkCouponValidity: (coupon) => void;
  couponValid: any;
  checkingValidity: boolean;
  coupon: {
    company: {
      _id: string;
      name: string;
    };
    coupon: {
      _id: string;
      name: string;
      discountPercent: number;
    };
    _id: string;
    isUsed: boolean;
    updatedAt: string;
    createdAt: string;
  };
  getTotalMembers: () => void;
  totalMembers: number;
}

function _Checkout(props: ICheckout) {
  const [value] = React.useState('bangladesh');
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
  const [showPortwallet, setShowPortwallet] = React.useState(true);
  const [showBkash, setShowBkash] = React.useState(false);
  const [couponClick, setCouponClick] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');
  const [discountPrice, setDiscountPrice] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [finalAmount, setFinalAmount] = React.useState(0);
  const [totalMembers, setTotalMembers] = React.useState(0);
  const stripe = useStripe();
  const elements = useElements();
  const headers = tokenConfig();

  const CouponButton = () => {
    const classes = useStyles();
    return (
      <div>
        <Button onClick={handleCouponApply} className={classes.root}>
          Apply
        </Button>
      </div>
    );
  };

  const handleCouponChange = (e) => {
    e.preventDefault();
    setCouponClick(false);
    setDiscountPrice(0);
    setCouponCode(e.target.value);
  };

  const handleCouponApply = async (e) => {
    e.preventDefault();
    setCouponClick(true);
    await props.checkCouponValidity(couponCode);
  };

  React.useEffect(() => {
    const loadMembers = async () => {
      await props.getTotalMembers();
    };
    loadMembers();
  }, []);

  React.useEffect(() => {
    if (props.totalMembers > 0) {
      setTotalMembers(props.totalMembers);
    }
  }, [props.totalMembers]);

  React.useEffect(() => {
    if (totalMembers) {
      setTotal(props.plan.pricing * totalMembers);
    }
  });

  React.useEffect(() => {
    if (props.coupon && couponClick) {
      setDiscountPrice(
        Number(
          (
            (total * props.coupon.coupon.discountPercent) /
            100
          ).toFixed(2),
        ),
      );
    }
  }, [props.coupon, total]);

  React.useEffect(() => {
    if (discountPrice > 0) {
      setFinalAmount(Number((total - discountPrice).toFixed(2)));
    } else {
      setFinalAmount(total);
    }
  }, [total, discountPrice]);

  // to-do add type
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
        finalAmount,
      ));
    stripeSuccess && setSuccess(stripeSuccess);
    value === 'bangladesh' &&
      (props.coupon
        ? portWalletCheckout(
            formValues,
            finalAmount * 85,
            props.plan._id,
            props.companyName,
            props.coupon._id,
          )
        : portWalletCheckout(
            formValues,
            finalAmount * 85,
            props.plan._id,
            props.companyName,
          ));
  };

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setValue((event.target as HTMLInputElement).value);
  // };
  return (
    <div className="Checkout">
      {props.currentComponent === 'checkOut' && (
        <div>
          <div className="mb1">
            <Button
              //   className={classes.button}
              startIcon={<ArrowBackIosIcon />}
              onClick={() => props.changeComponentTo('base')}
              style={{
                textTransform: 'capitalize',
                fontWeight: 'bold',
              }}
            >
              Subscription Plan
            </Button>
          </div>
          <div className="mt3 flex flex-column">
            <label htmlFor="team-members" className="fw6 mb2">
              Company Members
            </label>
            <TextField
              autoComplete="off"
              className="w-30-ns w-70"
              id="outlined-basic"
              variant="outlined"
              defaultValue={totalMembers}
              error={totalMembers < props.totalMembers}
              onChange={(e) => {
                if (Number(e.target.value) >= props.totalMembers) {
                  setTotalMembers(Number(e.target.value));
                }
              }}
              type="number"
              inputProps={{ min: props.totalMembers }}
            />
          </div>
          <div className="couponCode mt3">
            <label className="fw6">Coupon Code</label> <br />
            <form className="mt2">
              <div className="flex">
                <TextField
                  onChange={handleCouponChange}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault();
                      handleCouponApply(ev);
                    }
                  }}
                  autoComplete="off"
                  className="w-30-ns w-70 mr5"
                  id="outlined-basic"
                  variant="outlined"
                />
                <div className="w1"></div>
                <CouponButton />
              </div>
              {couponClick && !props.checkingValidity ? (
                props.couponValid ? (
                  <div className="mt4 o-70 flex flex-row items-center">
                    <CheckIcon style={{ color: '#38C671' }} />
                    <label>{`Coupon Code ${couponCode} applied successfully`}</label>
                  </div>
                ) : (
                  <div className="mt4 o-70 flex flex-row items-center">
                    <ErrorOutlineIcon style={{ color: '#f73947' }} />
                    <label>{`Coupon Code ${couponCode} is not valid`}</label>
                  </div>
                )
              ) : null}
            </form>
          </div>

          <h3 className="mt4">Total Payable Bill</h3>
          <Grid xs={12} sm={6}>
            <div className="shadow-1 totalBill">
              <br />
              <h4 className="b" style={{ color: '#34b3e9' }}>
                Package Name
              </h4>
              <Grid justify="space-between" container>
                <Grid item>
                  <h4 className="">Workspaces</h4>
                </Grid>
                <Grid item>
                  <h4>
                    <span className="mr2 fw4 f7">{`${totalMembers}x`}</span>
                    ${props.plan.pricing}
                  </h4>
                </Grid>
              </Grid>

              {discountPrice > 0 && (
                <div className="flex justify-between">
                  <h4>Discount</h4>
                  <h4>
                    <span className="mr1">-</span>$
                    {discountPrice.toFixed(2)}
                  </h4>
                </div>
              )}

              <Grid
                justify="space-between"
                container
                style={{
                  backgroundColor: '#34b3e9',
                  color: 'white',
                }}
              >
                <Grid item>
                  <h4 className="b">Total</h4>
                </Grid>

                <Grid item>
                  <h4>${finalAmount}</h4>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <h3 className="mt4">Select Payment Method</h3>

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
            <div className="mt4">
              <Button
                onClick={() => {
                  setShowPortwallet(true);
                  setShowBkash(false);
                }}
                style={{
                  backgroundImage: `url(${PortwalletIcon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  height: '43px',
                  width: '123px',
                  marginRight: '1vw',
                }}
                className={
                  !showPortwallet ? 'btn-gray' : 'btn-border'
                }
              />
              <Button
                onClick={() => {
                  setShowPortwallet(false);
                  setShowBkash(true);
                }}
                style={{
                  backgroundImage: `url(${BkashIcon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  height: '43px',
                  width: '123px',
                }}
                className={!showBkash ? 'btn-gray' : 'btn-border'}
              />
              {showPortwallet ? (
                <PortwalletCardSaction
                  handleSubmit={handleSubmit}
                  getPortWalletFormData={getPortWalletFormData}
                />
              ) : null}
              {showBkash ? <BkashCards /> : null}
            </div>
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
  couponValid: state.subscriptionReducer.couponValid,
  checkingValidity: state.subscriptionReducer.checkingValidity,
  coupon: state.subscriptionReducer.coupon,
  totalMembers: state.subscriptionReducer.totalMembers,
});

const Checkout = connect(mapStateToProps, {
  createSubscription,
  checkCouponValidity,
  getTotalMembers,
})(_Checkout);

export default Checkout;
