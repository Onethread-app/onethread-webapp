import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Dialog } from '@blueprintjs/core';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig, companyPermit } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import { getCompanyAnnouncement } from 'stores/company/Actions';
import Typography from '@material-ui/core/Typography';
import { webPush } from '../../stores/notifications/Action';
import { setSubscriptionExpire } from '../../stores/subscriptionBilling/Actions';
import { setSubscriptionNotExpire } from '../../stores/subscriptionBilling/Actions';
import DashboardSummery from 'components/dashboard/dashboard-summary/DashboardSummary';
import TotalInfo from 'components/dashboard/total-info/TotalInfo';
import ProjectStatus from 'components/dashboard/project-status/ProjectStatus';
import Progressbar from 'components/dashboard/progressbar/Progressbar';
import CompanyAnnouncements from 'components/dashboard/company-announcements/CompanyAnnouncements';
import firebase from '../../firebase';
import {
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
} from 'stores/company/Types';
import moment from 'moment';
import { NavbarCompany } from 'components/NavbarCompany';

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
          console.log(err);
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
    }
    getAPI();
  }, [props.company._id]);

  const designationMap = {
    director: 'Director',
    cxo: 'CXO',
    seniorManager: 'Senior Manager',
    middleManager: 'Middle Manager',
    operationalEmployee: 'Operational Employee',
  };

  const width = {
    width: '100%',
  };

  return (
    <>
      {loading === false ? (
        <>
          <NavbarCompany title="My Dashboard" />
          <div className="w-90 center mh2 mt4-l mt5 pb5 pb0-l">
            <h3 className="f3-ns f5" style={{ color: '#3F61C5' }}>
              Dashboard
            </h3>
            <div className="flex flex-row-ns flex-column">
              <div className="fl w-80-l w-100 mr4-ns mb-0-ns mb4">
                <Card className="w-100 pa2 shadow-2 br3">
                  <DashboardSummery stat={dashboard} />
                </Card>
              </div>
              <div className="w-20-l w-100 items-start-ns">
                <Card className="w-100 pa2 mb3-ns mb3 shadow-2 br3 totalInfoCard h4-ns">
                  <TotalInfo
                    icon="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/users-icon.svg"
                    content="Total Employees"
                    count={dashboard.totalEmployee}
                  />
                </Card>
                <Card className="w-100 pa2 mb3-ns mb3 shadow-2 br3 totalInfoCard h4-ns">
                  <TotalInfo
                    icon="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/user-card.svg"
                    content="Total Associates"
                    count={dashboard.totalAssociates}
                  />
                </Card>
              </div>
            </div>
            <div>
              <div className="mt5 pb0-ns">
                <h3 className="f3-ns f5" style={{ color: '#3F61C5' }}>
                  Project Status
                </h3>
                <div className="flex-ns justify-between">
                  {dashboard && (
                    <Card className="w-100-l w-100 pa4-ns pa3 shadow-2 br3">
                      {dashboard.projectCompilation ?
                        dashboard.projectCompilation.map(
                          (project) => (
                            <div className="mb4">
                              <ProjectStatus
                                content={project.name}
                                remaining={
                                  project.taskNumbers -
                                  project.doneTask
                                }
                                total={project.taskNumbers}
                              />
                              <Progressbar
                                width={parseInt(width.width)}
                                percent={
                                  project.doneTask /
                                  project.taskNumbers
                                }
                              />
                            </div>
                          ),
                        ): <Typography>You do not have any project at this moment.</Typography>}
                    </Card>
                  )}
                </div>
              </div>
              <div className="mt4 mb4 pb0-ns">
                <div className="flex justify-between items-center">
                  <h3
                    style={{ color: '#3F61C5' }}
                    className="justify-center f3-ns f5"
                  >
                    Company Announcements
                  </h3>

                  {companyPermit(props.company.role) && (
                    <button
                      onClick={() =>
                        setShowAnnouncementDialog(
                          !showAnnouncementDialog,
                        )
                      }
                      className="bp3-button w5 h2 pointer fr"
                      style={{
                        background: '#3F61C5',
                        outline: 'none',
                        color: '#fff',
                      }}
                    >
                      <span>
                        <img
                          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/mic.svg"
                          alt="announcement"
                        />
                      </span>
                      <span className="ml2-ns">
                        Create Announcement
                      </span>
                    </button>
                  )}
                </div>
                {props.company.announce && (
                  <Card
                    className="w-100-l w-100 pa4 shadow-2 br3"
                    style={{ borderLeft: '10px solid #3F61C5' }}
                  >
                    {props.company.announce.length > 0 ? (
                      props.company.announce.map(
                        (announcement: any) => (
                          <CompanyAnnouncements
                            name={
                              announcement.memberId &&
                              announcement.memberId.designations
                                .length > 0
                                ? designationMap[
                                    announcement.memberId
                                      .designations[0].division
                                  ]
                                : 'Admin'
                            }
                            date={moment(
                              announcement.createdAt,
                            ).calendar()}
                            content={announcement.text}
                          />
                        ),
                      )
                    ) : (
                      <Typography>No Announcement</Typography>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </div>
          <div></div>
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
