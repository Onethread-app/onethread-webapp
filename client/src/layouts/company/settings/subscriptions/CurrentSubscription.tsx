import { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import { History } from 'history';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ICompany } from 'stores/company/Reducer';
import {
  changeCompanyName,
  clearChangeCompanyNameError,
} from '../../../../stores/company/Actions';
import { getCurrentSubscription } from '../../../../stores/subscriptionBilling/Actions';

interface CurrentSubscription {
  company: ICompany;
  changeCompanyName: (name: string) => void;
  clearChangeCompanyNameError: () => void;
  errorCompanyName: string;
  history: History;
  currentComonent: string;
  changeComponentTo: (componentName: string) => any;
  getCurrentSubscription: () => void;
  currentSubscriptions: string;
  dueDate: string;
  lastPayment: string;
}

const useStyles = makeStyles({
  button: {
    textTransform: 'none',
  },
});

const _CurrentSubscription = (
  props: CurrentSubscription & RouteComponentProps,
) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    props.getCurrentSubscription();
  }, []);

  return (
    <div>
      <div>
        <h3>
          {t('app.company.Subscription-And-Billing.Subscription')}
        </h3>
      </div>
      {props.currentComonent === 'base' && (
        <div>
          <div className="pt1">
            <h4>
              {t('app.company.Subscription-And-Billing.Current')}
            </h4>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <label className="pl1">
                  {props.currentSubscriptions
                    ? props.currentSubscriptions
                    : 'Trial'}
                </label>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="text"
                  className={classes.button}
                  color="primary"
                  onClick={() =>
                    props.changeComponentTo('subscriptionList')
                  }
                >
                  {t('app.company.Subscription-And-Billing.Change')}
                </Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <h4>
              {t('app.company.Subscription-And-Billing.Payment-date')}
            </h4>
            <label className="pl1">
              {props.dueDate &&
                moment(props.dueDate).format('MMMM Do YYYY')}
            </label>
          </div>
          <div>
            <h4>
              {t(
                'app.company.Subscription-And-Billing.Payment-history',
              )}
            </h4>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <label className="pl1">
                  {props.lastPayment ? (
                    moment(props.lastPayment).format('MMMM Do YYYY')
                  ) : (
                    <label className="b moon-gray">
                      {t(
                        'app.company.Subscription-And-Billing.No-Payment',
                      )}
                    </label>
                  )}
                </label>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="text"
                  className={classes.button}
                  color="primary"
                  onClick={() =>
                    props.changeComponentTo('paymentHistory')
                  }
                >
                  {t(
                    'app.company.Subscription-And-Billing.View-history',
                  )}
                </Button>
              </Grid>
            </Grid>
          </div>
          {/* <div>
            <h4>Payment Info</h4>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <label className="pl1">
                  Master Card Ending with 5142
                </label>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="text"
                  className={classes.button}
                  color="primary"
                  onClick={() => changeComponentTo('changeCard')}
                >
                  Change
                </Button>
              </Grid>
            </Grid>
          </div> */}
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    errorCompanyName: state.companyReducer.error,
    currentSubscriptions:
      state.subscriptionReducer.currentSubscriptions &&
      state.subscriptionReducer.currentSubscriptions.plan.name,
    dueDate:
      state.subscriptionReducer.currentSubscriptions &&
      state.subscriptionReducer.currentSubscriptions.expireAt,
    lastPayment:
      state.subscriptionReducer.paymentHistory[0] &&
      state.subscriptionReducer.paymentHistory[0].createdAt,
  };
};

export const CurrentSubscription = connect(mapStateToProps, {
  changeCompanyName,
  clearChangeCompanyNameError,
  getCurrentSubscription,
})(withRouter(_CurrentSubscription));
