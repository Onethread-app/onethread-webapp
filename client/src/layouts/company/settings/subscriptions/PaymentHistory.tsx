import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import moment from 'moment';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Card from '@material-ui/core/Card/Card';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { getPaymentHistory } from '../../../../stores/subscriptionBilling/Actions';

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
  const { t } = useTranslation();

  useEffect(() => {
    props.getPaymentHistory();
  }, []);

  return (
    <div>
      {props.currentComponent === 'paymentHistory' && (
        <div>
          <div className='mb1'>
            <Button
              startIcon={<ArrowBackIosIcon />}
              onClick={() => props.changeComponentTo('base')}
            >
              {t('app.company.Subscription-And-Billing.Current')}
            </Button>
          </div>
          <h4>
            {t(
              'app.company.Subscription-And-Billing.Payment-history',
            )}
          </h4>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <div className='b'>
                {t('app.company.Subscription-And-Billing.Invoice')}
              </div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className='b'>
                {t('app.company.Subscription-And-Billing.Date')}
              </div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className='b'>
                {t('app.company.Subscription-And-Billing.Status')}
              </div>
            </Grid>
            <Grid item xs={6} sm={3}>
              <div className='b'>
                {t('app.company.Subscription-And-Billing.Amount')}
              </div>
            </Grid>
          </Grid>
          {props.paymentHistory
            && props.paymentHistory.map((payment, i) => (
              <Card style={{ marginTop: '10px', padding: '10px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <div className='ml1'>{payment._id}</div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <div className='ml1'>
                      {moment(payment.createdAt).format(
                        'MMMM Do YYYY',
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <div className='ml1'>{payment.status}</div>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <div className='ml1'>{payment.amount}</div>
                  </Grid>
                </Grid>
              </Card>
            ))}
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
