import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Dialog, Navbar, Drawer } from '@blueprintjs/core';
import addIcon from '../../resources/images/addIcon.png';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import { getCompanyAnnouncement } from 'stores/company/Actions';
import { makeStyles } from '@material-ui/core/styles';
// import { Text } from '@blueprintjs/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';

import {
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
} from 'stores/company/Types';
import { MobileView } from 'react-device-detect';
import { MobileListView } from 'layouts/company/MobileListView';
import user from './../../resources/images/profilePhoto.svg';
import moment from 'moment';

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
}

const DashboardViewComponent = (props: DashBoardViewProps) => {
  const [
    showAnnouncementDialog,
    setShowAnnouncementDialog,
  ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(Object);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  useEffect(() => {
    async function getAPI() {
      const headers = tokenConfig();
      try {
        const response = await tigrowApi.get(
          `company/${props.company!._id}/dashboard`,
          headers,
        );
        dispatch({
          type: ADD_TOTAL_ASSOCIATE,
          payload: response.data.data.totalAssociates,
        });
        dispatch({
          type: ADD_TOTAL_MEMBER,
          payload: response.data.data.totalEmployee,
        });
        await setDashboard(response.data.data);
        await props.getCompanyAnnouncement();
        await setLoading(false);
      } catch (error) {
        await setLoading(false);
      }
    }
    getAPI();
  }, [props.company._id]);

  return (
    <>
      {loading === false ? (
        <>
          <MobileView>
            <Navbar
              fixedToTop
              className="flex justify-between items-center shadow-4"
              style={{ height: '55px' }}
            >
              <h1 className="f3">My Dashboard</h1>
              <img
                src={
                  props.user.profileImage
                    ? props.user.profileImage
                    : user
                }
                className="dim v-mid dib br-100 pointer"
                style={{
                  width: '2rem',
                  height: '2rem',
                  objectFit: 'cover',
                }}
                alt="user"
                onClick={() => setShowDialog(true)}
              />
            </Navbar>
          </MobileView>
          <div className="mh4-ns mh2 mt5 mt0-ns pb6 pb0-ns">
            <div className="flex-ns justify-between">
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Total running project</h1>
                <h1 className="mv0">{dashboard.totalProject}</h1>
              </Card>
              <Card className="w-25-ns w-90 ma2">
                <h1 className="f6 fw6">Completed project</h1>
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
                                  ? announcement.memberId
                                      .designations[0].division
                                  : 'Admin'
                              }`}
                            </Typography>
                          </Paper>
                          <Paper
                            className={classes.secondaryHeading}
                            elevation={0}
                          >
                            {/* <Typography className="">Date</Typography> */}
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
                  <small>No announcements.</small>
                )}
              </div>
            </div>
          </div>
          <div>
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
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '70%' }}
        >
          <div>
            <MobileListView
              showDialog={showDialog}
              setShowDialog={setShowDialog}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
  };
};

export const DashboardView = connect(mapStateToProps, {
  getCompanyAnnouncement,
})(DashboardViewComponent);
