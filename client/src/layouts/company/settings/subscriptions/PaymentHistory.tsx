import React from 'react';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
// import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { getPaymentHistory } from '../../../../stores/subscriptionBilling/Actions';
import { connect } from 'react-redux';
import moment from 'moment';

interface IHistory {
  _id: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface IPaymentHistory {
  currentComponent: string;
  changeComponentTo: (componentName: string) => any;
  getPaymentHistory: () => void;
  paymentHistory: [IHistory];
}

const _PaymentHistory = (props: IPaymentHistory) => {
  // const classes = useStyles();
  React.useEffect(() => {
    props.getPaymentHistory();
  }, []);

  return (
    <div>
      {props.currentComponent === 'paymentHistory' && (
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
          <h4>Payment History</h4>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <div className="b">Invoice No.</div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className="b">Date</div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className="b">Payment Status</div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className="b">Amount</div>
            </Grid>
          </Grid>
          {props.paymentHistory &&
            props.paymentHistory.map((payment, i) => {
              return (
                <Card style={{ marginTop: '10px', padding: '10px' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <div className="ml1">{payment._id}</div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <div className="ml1">
                        {moment(payment.createdAt).format(
                          'MMMM Do YYYY',
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <div className="ml1">{payment.status}</div>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <div className="ml1">{payment.amount}</div>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  paymentHistory: state.subscriptionReducer.paymentHistory,
});

const PaymentHistory = connect(mapStateToProps, {
  getPaymentHistory,
})(_PaymentHistory);

export default PaymentHistory;
