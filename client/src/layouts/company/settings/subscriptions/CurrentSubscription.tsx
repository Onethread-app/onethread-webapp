import React from 'react';

import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import {
  changeCompanyName,
  clearChangeCompanyNameError,
} from '../../../../stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { History } from 'history';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getCurrentSubscription } from '../../../../stores/subscriptionBilling/Actions';

// import { companyPermit } from 'stores/UtilsActions';

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

  React.useEffect(() => {
    props.getCurrentSubscription();
  }, []);
  return (
    <div>
      <div>
        <h3>Subscriptions and Billings</h3>
      </div>
      {props.currentComonent === 'base' && (
        <div>
          <div className="pt1">
            <h4>Current Subscriptin Plan</h4>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <label className="pl1">
                  {props.currentSubscriptions
                    ? props.currentSubscriptions
                    : 'Trail'}
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
                  Change
                </Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <h4>Payment Due Date</h4>
            <label className="pl1">June 13 2020</label>
          </div>
          <div>
            <h4>Payment History</h4>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <label className="pl1">
                  Last Charge April 3, 2020
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
                  View all history
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
  };
};

export const CurrentSubscription = connect(mapStateToProps, {
  changeCompanyName,
  clearChangeCompanyNameError,
  getCurrentSubscription,
})(withRouter(_CurrentSubscription));
