import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Dialog } from '@blueprintjs/core';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig, companyPermit } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import {
  getCompanyAnnouncement,
  getLatestCompletedTasks,
} from 'stores/company/Actions';
import Typography from '@material-ui/core/Typography';
import { webPush } from '../../stores/notifications/Action';
import {
  setSubscriptionExpire,
  setSubscriptionNotExpire,
  getCurrentSubscription,
} from '../../stores/subscriptionBilling/Actions';
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
import tick from '../../resources/images/tick.svg';
import { isMobileOnly } from 'react-device-detect';
import { orderBy } from 'lodash';

interface DashBoardViewProps {
  user: User;
  company: ICompany;
  getCompanyAnnouncement: () => void;
  webPush: (token) => void;
  setSubscriptionExpire: () => void;
  subscriptiontExpired: boolean;
  setSubscriptionNotExpire: () => void;
  getLatestCompletedTasks: () => void;
  getCurrentSubscription: () => void;
  completedTasks: [];
}

interface latestTask {
  _id: string;
  name: string;
  updatedAt: string;
  boardId: {
    name: string;
    _id: string;
  };
  project: {
    name: string;
    _id: string;
  };
}

const DashboardViewComponent = (props: DashBoardViewProps) => {
  const [
    showAnnouncementDialog,
    setShowAnnouncementDialog,
  ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(Object);
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const [
    currentAnnouncementPage,
    setCurrentAnnouncementPage,
  ] = useState(1);
  const [itemsPerPage] = useState(5);
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
          props.getLatestCompletedTasks();
          props.getCompanyAnnouncement();
          setLoading(false);
        })
        .catch(async (err) => {
          setLoading(false);
          if (err.response.data.status === 403) {
            await props.setSubscriptionExpire();
            await props.getCurrentSubscription();
            props.company.role === 'superAdmin'
              ? window.location.replace(
                  `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
                )
              : window.location.replace(
                  `${window.location.origin}/${props.user.name}/home`,
                );
          }
        });
    }
    getAPI();
  }, [props.company._id]);

  const indexOfLastTask = currentTaskPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;

  const allTasks = orderBy(
    props.completedTasks,
    ['updatedAt'],
    ['desc'],
  );

  const currentTasks = allTasks.slice(
    indexOfFirstTask,
    indexOfLastTask,
  );

  const indexOfLastAnnouncement =
    currentAnnouncementPage * itemsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - itemsPerPage;
  let currentAnnouncements: any;
  if (props.company.announce) {
    const allAnnouncements = orderBy(
      props.company.announce,
      ['createdAt'],
      ['desc'],
    );
    currentAnnouncements = allAnnouncements.slice(
      indexOfFirstAnnouncement,
      indexOfLastAnnouncement,
    );
  }

  const nextTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage + 1);
  };

  const prevTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage - 1);
  };

  const nextAnnouncementPage = (e) => {
    e.preventDefault();
    setCurrentAnnouncementPage(currentAnnouncementPage + 1);
  };

  const prevAnnouncementPage = (e) => {
    e.preventDefault();
    setCurrentAnnouncementPage(currentAnnouncementPage - 1);
  };

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
                  Latest Completed Tasks
                </h3>
                <div className="flex-ns justify-between">
                  <Card className="w-100-l w-100 pa3-ns pa2 shadow-1 br2">
                    {props.completedTasks.length > 0 ? (
                      currentTasks.map((task: latestTask) => (
                        <div
                          className="flex flex-row-ns flex-column mb2"
                          key={task._id}
                        >
                          <div className="flex flex-row mb1">
                            <img
                              src={tick}
                              alt="tick"
                              className="mr2"
                              style={{
                                height: '18px',
                                width: '18px',
                              }}
                            />
                            <div className="w-100 flex flex-row justify-between">
                              <span
                                className="fw6 mr2 ba b-light-gray br2 ph2"
                                style={{ color: '#BBBBBB' }}
                              >
                                {task.project.name}
                              </span>
                              {isMobileOnly ? (
                                <span style={{ color: '#B4B4B4' }}>
                                  {moment(task.updatedAt).fromNow()}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <div>
                            <span
                              className="fw6 mr3"
                              style={{ color: '#656565' }}
                            >
                              <span
                                className="ttc"
                                style={{ color: '#3F61C5' }}
                              >
                                {task.name}
                              </span>{' '}
                              from {task.boardId.name} has been marked
                              as complete.
                            </span>
                            {isMobileOnly ? null : (
                              <span style={{ color: '#B4B4B4' }}>
                                {moment(task.updatedAt).fromNow()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <Typography>
                        None of the tasks have been marked as done.
                      </Typography>
                    )}
                    {props.completedTasks.length > 5 && (
                      <div className="flex flex-row items-end w-100 justify-end">
                        <div
                          className="f6 fw5 flex flex-row items-center"
                          style={{ color: '#BBBBBB' }}
                        >
                          {currentTaskPage > 1 && (
                            <span
                              className="mr2 pointer f4"
                              style={{ color: '#656565' }}
                              onClick={prevTaskPage}
                            >
                              &lt;
                            </span>
                          )}
                          {currentTaskPage} of{' '}
                          {Math.ceil(
                            props.completedTasks.length /
                              itemsPerPage,
                          )}
                          {currentTaskPage <
                            Math.ceil(
                              props.completedTasks.length /
                                itemsPerPage,
                            ) && (
                            <span
                              className="ml2 pointer f4"
                              style={{ color: '#656565' }}
                              onClick={nextTaskPage}
                            >
                              &#707;
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
              <div className="mt5 pb0-ns">
                <h3 className="f3-ns f5" style={{ color: '#3F61C5' }}>
                  Project Status
                </h3>
                <div className="flex-ns justify-between">
                  {dashboard && (
                    <Card className="w-100-l w-100 pa4-ns pa3 shadow-1 br2">
                      {dashboard.projectCompilation &&
                      dashboard.projectCompilation.length > 0 ? (
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
                        )
                      ) : (
                        <Typography>
                          You do not have any project at this moment.
                        </Typography>
                      )}
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
                    className="w-100-l w-100 pa4 shadow-1 br2"
                    style={{ borderLeft: '10px solid #3F61C5' }}
                  >
                    {props.company.announce.length > 0 ? (
                      currentAnnouncements.map(
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
                            key={announcement._id}
                          />
                        ),
                      )
                    ) : (
                      <Typography>No Announcement</Typography>
                    )}
                    {props.company.announce.length > 5 && (
                      <div className="flex flex-row items-end w-100 justify-end">
                        <div
                          className="f6 fw5 flex flex-row items-center"
                          style={{ color: '#BBBBBB' }}
                        >
                          {currentAnnouncementPage > 1 && (
                            <span
                              className="mr2 pointer f4"
                              style={{ color: '#656565' }}
                              onClick={prevAnnouncementPage}
                            >
                              &lt;
                            </span>
                          )}
                          {currentAnnouncementPage} of{' '}
                          {Math.ceil(
                            props.company.announce.length /
                              itemsPerPage,
                          )}
                          {currentAnnouncementPage <
                            Math.ceil(
                              props.company.announce.length /
                                itemsPerPage,
                            ) && (
                            <span
                              className="ml2 pointer f4"
                              style={{ color: '#656565' }}
                              onClick={nextAnnouncementPage}
                            >
                              &#707;
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
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
    completedTasks: state.companyReducer.completedTasks,
  };
};

export const DashboardView = connect(mapStateToProps, {
  getCompanyAnnouncement,
  webPush,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
  getLatestCompletedTasks,
  getCurrentSubscription,
})(DashboardViewComponent);
