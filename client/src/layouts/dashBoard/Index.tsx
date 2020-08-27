import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Dialog } from '@blueprintjs/core';
import addIcon from '../../resources/images/addIcon.png';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig, companyPermit } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import { getCompanyAnnouncement } from 'stores/company/Actions';
import { makeStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { webPush } from '../../stores/notifications/Action';
import { setSubscriptionExpire } from '../../stores/subscriptionBilling/Actions';
import { setSubscriptionNotExpire } from '../../stores/subscriptionBilling/Actions';

import firebase from '../../firebase';
import {
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
} from 'stores/company/Types';
import moment from 'moment';
import { NavbarCompany } from 'components/NavbarCompany';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

interface DashBoardViewProps {
  user: User;
  company: ICompany;
  getCompanyAnnouncement: () => void;
  webPush: (token) => void;
  setSubscriptionExpire: () => void;
  subscriptiontExpired: boolean;
  setSubscriptionNotExpire: () => void;
}

const DashboardViewComponent = (props: DashBoardViewProps) => {
  const [
    showAnnouncementDialog,
    setShowAnnouncementDialog,
  ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(Object);
  const dispatch = useDispatch();
  const classes = useStyles();

  const getTokenFromGCM = () => {
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((token: string) => props.webPush(token))
      .catch((err: string) => console.log(err));
  };
  useEffect(() => {
    getTokenFromGCM();
    async function getAPI() {
      const headers = tokenConfig();
      // try {
      await tigrowApi
        .get(`company/${props.company!._id}/dashboard`, headers)
        .then((response) => {
          dispatch({
            type: ADD_TOTAL_ASSOCIATE,
            payload: response.data.data.totalAssociates,
          });
          dispatch({
            type: ADD_TOTAL_MEMBER,
            payload: response.data.data.totalEmployee,
          });
          setDashboard(response.data.data);
          props.setSubscriptionNotExpire();
          props.getCompanyAnnouncement();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.status === 403) {
            props.setSubscriptionExpire();
            if (props.subscriptiontExpired) {
              props.company.role === 'superAdmin'
                ? window.location.replace(
                    `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
                  )
                : window.location.replace(
                    `${window.location.origin}/${props.user.name}/home`,
                  );
            }
          }
        });

      // } catch (error) {
      //

      //   console.log(error);
      // }
    }
    getAPI();
  }, [props.company._id]);

  const desigmationMap = {
    director: 'Director',
    cxo: 'CXO',
    seniorManager: 'Senior Manager',
    middleManager: 'Middle Manager',
    operationalEmployee: 'Operational Employee',
  };

  return (
    <>
      {loading === false ? (
        <>
          <NavbarCompany title="My Dashboard" />
          <div className="mh4-ns mh2 mt5 mt0-ns pb6 pb0-ns">
            <div className="flex-ns justify-between">
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Total Running Project</h1>
                <h1 className="mv0">{dashboard.totalProject}</h1>
              </Card>
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Completed Project</h1>
                <h1 className="mv0">0</h1>
              </Card>
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Total Employee</h1>
                <h1 className="mv0">{dashboard.totalEmployee}</h1>
              </Card>
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Total Associates</h1>
                <h1 className="mv0">{dashboard.totalAssociates}</h1>
              </Card>
            </div>
            <div>
              <div className="w-50-l ma2">
                <h1 className="f5">Company Announcement</h1>
                {props.company.announce &&
                props.company.announce.length > 0 ? (
                  props.company.announce.map((announcement: any) => (
                    <div className="mt2">
                      <ExpansionPanel>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Paper
                            className={classes.heading}
                            elevation={0}
                          >
                            <Typography className="">
                              {`From ${
                                announcement.memberId &&
                                announcement.memberId.designations
                                  .length > 0
                                  ? desigmationMap[
                                      announcement.memberId
                                        .designations[0].division
                                    ]
                                  : 'Admin'
                              }`}
                            </Typography>
                          </Paper>
                          <Paper
                            className={classes.secondaryHeading}
                            elevation={0}
                          >
                            <Typography className="">
                              {announcement.createdAt &&
                                moment(
                                  announcement.createdAt,
                                ).calendar()}
                            </Typography>
                          </Paper>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography>{announcement.text}</Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  ))
                ) : (
                  <small>No Announcement.</small>
                )}
              </div>
            </div>
          </div>
          <div>
            {companyPermit(props.company.role) && (
              <img
                onClick={() =>
                  setShowAnnouncementDialog(!showAnnouncementDialog)
                }
                src={addIcon}
                className={`fixed pointer addButton`}
                style={{
                  boxShadow: '0px 6px 6px #00000029',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
      {showAnnouncementDialog && (
        <Dialog
          onClose={() =>
            setShowAnnouncementDialog(!showAnnouncementDialog)
          }
          isOpen={showAnnouncementDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={true}
        >
          <div>
            <AnnouncementEditor
              setShowDialog={setShowAnnouncementDialog}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};

export const DashboardView = connect(mapStateToProps, {
  getCompanyAnnouncement,
  webPush,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
})(DashboardViewComponent);
