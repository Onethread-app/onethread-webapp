import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent/CardContent';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import CardActions from '@material-ui/core/CardActions/CardActions';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { getSubscription } from '../../../../stores/subscriptionBilling/Actions';

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
  const [dense] = useState(true);
  const classes = useStyles();

  useEffect(() => {
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
          <Grid container>
            {props.subscriptions.map((subscription, i) => {
              return (
                <Grid container spacing={2} key={subscription._id}>
                  <Grid item sm={12} md={6} lg={4}>
                    <Card style={{ marginBottom: '10px' }}>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <CardContent>
                            <h3
                              style={{
                                color: '#08A0F7',
                                marginBottom: '0',
                              }}
                            >
                              {subscription.name.toUpperCase()}
                            </h3>
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
                                  Validity {subscription.validity}{' '}
                                  days
                                </div>
                              </ListItem>
                              ,
                            </List>
                          </CardContent>
                        </Grid>

                        <Grid item xs={6}>
                          <CardActions className="h-100 v-mid">
                            <div className="mt4 center">
                              <h3 className="mb1">
                                ${subscription.pricing}
                              </h3>
                              {subscription.pricing !== 0 && (
                                <>
                                  <span className="fw6">Or</span>
                                  <h3 className="mt1">
                                    BDT {subscription.pricing * 85}
                                  </h3>
                                </>
                              )}
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
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <Card style={{ marginBottom: '10px' }}>
                <CardContent>
                  <h3>ENTERPRISE</h3>
                </CardContent>
                <CardContent>
                  <h3>Sales</h3>
                  <label>Contact us at contact@onethread.app</label>
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
