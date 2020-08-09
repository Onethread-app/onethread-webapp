import React from 'react';
import Card from '@material-ui/core/Card';
import {
  CardActions,
  Grid,
  ListItemIcon,
  ListItem,
  List,
} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
import { getSubscription } from '../../../../stores/subscriptionBilling/Actions';
import { connect } from 'react-redux';

interface IPlan {
  _id: string;
  pricing: number;
}
interface ISubscription {
  maxTier: number;
  name: string;
  pricing: number;
  validity: number;
  _id: string;
}
interface ISubscriptionList {
  currentComponent: string;
  changeComponentTo: (componentName: string) => any;
  subscriptions: [ISubscription];
  getSubscription: () => void;
  getPlan: (planId: IPlan) => void;
}
const useStyles = makeStyles({
  button: {
    textTransform: 'none',
  },
});

const _SubscriptionList = (props: ISubscriptionList) => {
  const [dense] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    props.getSubscription();
  }, []);

  return (
    <div>
      {props.currentComponent === 'subscriptionList' && (
        <div>
          <div className="mb1">
            <Button
              className={classes.button}
              startIcon={<ArrowBackIosIcon />}
              onClick={() => props.changeComponentTo('base')}
            >
              Back
            </Button>
          </div>
          {props.subscriptions.map((subscription, i) => {
            return (
              <Grid container>
                <Grid item xs={4}>
                  <Card style={{ marginBottom: '10px' }}>
                    <Grid container>
                      <Grid item xs={6}>
                        <CardContent>
                          <h3>{subscription.name.toUpperCase()}</h3>
                          <List dense={dense}>
                            <ListItem>
                              <ListItemIcon>
                                <CheckIcon />
                              </ListItemIcon>
                              <div>
                                Maximum user {subscription.maxTier}
                              </div>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CheckIcon />
                              </ListItemIcon>
                              <div>
                                Validity {subscription.validity} days
                              </div>
                            </ListItem>
                            ,
                          </List>
                        </CardContent>
                      </Grid>

                      <Grid item xs={6}>
                        <CardActions>
                          <div className="mt5 center">
                            <h3>${subscription.pricing}</h3>
                            <Button
                              className={classes.button}
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                await props.getPlan(subscription);
                                props.changeComponentTo('checkOut');
                              }}
                            >
                              Pay Bill
                            </Button>
                          </div>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            );
          })}
          <Grid container>
            <Grid item xs={4}>
              <Card style={{ marginBottom: '10px' }}>
                <CardContent>
                  <h3>ENTERPRISE</h3>
                </CardContent>
                <CardContent>
                  <h3>Sales</h3>
                  <label>Contact us at sales@tigrow.info</label>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  subscriptions: state.subscriptionReducer.subscriptions,
});

const SubscriptionList = connect(mapStateToProps, {
  getSubscription,
})(_SubscriptionList);

export default SubscriptionList;
