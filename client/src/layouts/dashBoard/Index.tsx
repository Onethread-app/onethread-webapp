import { Card } from '@blueprintjs/core';
import Typography from '@material-ui/core/Typography';
import CompanyAnnouncementsList from 'components/dashboard/company-announcements-list/CompanyAnnouncementsList';
// import DashboardSummery from 'components/dashboard/dashboard-summary/DashboardSummary';
// import TotalInfo from 'components/dashboard/total-info/TotalInfo';
import { ProjectStatus } from 'components/dashboard/project-status/ProjectStatus';
// import { tokenConfig, companyPermit } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import Navbar from 'components/navbar/Navbar';
import { orderBy } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  getCompanyAnnouncement,
  getLatestCompletedTasks,
} from 'stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import tick from '../../resources/images/tick.svg';
import {
  getCurrentSubscription,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
} from '../../stores/subscriptionBilling/Actions';

interface DashBoardViewProps {
  user: User;
  company: ICompany;
  getCompanyAnnouncement: () => void;
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
  const [loading, setLoading] = useState(true);
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const [taskItemsPerPage] = useState(5);
  const indexOfLastTask = currentTaskPage * taskItemsPerPage;
  const indexOfFirstTask = indexOfLastTask - taskItemsPerPage;

  const allTasks = orderBy(
    props.completedTasks,
    ['updatedAt'],
    ['desc'],
  );

  const currentTasks = allTasks.slice(
    indexOfFirstTask,
    indexOfLastTask,
  );

  // const indexOfLastAnnouncement =
  //   currentAnnouncementPage * announcementItemsPerPage;
  // const indexOfFirstAnnouncement =
  //   indexOfLastAnnouncement - announcementItemsPerPage;
  // let currentAnnouncements: any;
  // if (props.company.announce) {
  //   const allAnnouncements = orderBy(
  //     props.company.announce,
  //     ['createdAt'],
  //     ['desc'],
  //   );
  //   currentAnnouncements = allAnnouncements.slice(
  //     indexOfFirstAnnouncement,
  //     indexOfLastAnnouncement,
  //   );
  // }
  const getDashboardInfo = async () => {
    try {
      props.setSubscriptionNotExpire();
      props.getLatestCompletedTasks();
      props.getCompanyAnnouncement();
      setLoading(false);
    } catch (err) {
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
    }
  };
  useEffect(() => {
    getDashboardInfo();
  }, [props.company._id]);

  const nextTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage + 1);
  };

  const prevTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage - 1);
  };

  // const nextAnnouncementPage = (e) => {
  //   e.preventDefault();
  //   setCurrentAnnouncementPage(currentAnnouncementPage + 1);
  // };

  // const prevAnnouncementPage = (e) => {
  //   e.preventDefault();
  //   setCurrentAnnouncementPage(currentAnnouncementPage - 1);
  // };

  // const designationMap = {
  //   director: 'Director',
  //   cxo: 'CXO',
  //   seniorManager: 'Senior Manager',
  //   middleManager: 'Middle Manager',
  //   operationalEmployee: 'Operational Employee',
  // };

  // const width = {
  //   width: '100%',
  // };

  const { t } = useTranslation();
  return (
    <>
      {loading === false ? (
        <>
          {isMobileOnly && <Navbar type="company" />}
          <div className="w-90 center mh2 mt4-l mt5 pb5 pb0-l">
            {/* <h3 className="f3-ns f5" style={{ color: '#3484F0' }}>
              {t('app.company.Dashboard.Headline')}
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
                    type="employee"
                    content={t(
                      'app.company.Dashboard.Number-of-employees',
                    )}
                    // content="Total Employees"
                    count={dashboard.totalEmployee}
                  />
                </Card>
                <Card className="w-100 pa2 mb3-ns mb3 shadow-2 br3 totalInfoCard h4-ns">
                  <TotalInfo
                    type="associates"
                    content={t(
                      'app.company.Dashboard.Number-of-associates',
                    )}
                    // content="Total Partners"
                    count={dashboard.totalAssociates}
                  />
                </Card>
              </div>
            </div> */}
            <div>
              <div className="mt4 pb0-ns">
                <ProjectStatus />
              </div>
              <div
                className="flex flex-row-ns flex-column-reverse w-100 items-start mt5 mb4 pb0-ns"
                style={{ gap: '1.5rem' }}
              >
                {/* // */}
                {/* <Card className="w-50-ns w-100">
                  <div className="flex justify-between items-center">
                    <h3
                      style={{ color: '#3484F0' }}
                      className="justify-center f3-ns f5"
                    >
                      {t('app.company.Dashboard.Announce')}
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
                          background: '#3484F0',
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
                          {t(
                            'app.company.Dashboard.Create-Announcement',
                          )}
                          Create Announcement
                        </span>
                      </button>
                    )}
                  </div>
                  {props.company.announce && (
                    <div
                      className="w-100-l w-100 pa3 shadow-1 br2 mt2"
                      style={{ borderLeft: '10px solid #3484F0' }}
                    >
                      {props.company.announce.length > 0 ? (
                        currentAnnouncements.map(
                          (announcement: any) => (
                            <CompanyAnnouncementItem
                              divison={
                                announcement.memberId &&
                                announcement.memberId.designations
                                  .length > 0
                                  ? designationMap[
                                      announcement.memberId
                                        .designations[0].division
                                    ]
                                  : announcement.memberId.role
                              }
                              date={moment(
                                announcement.createdAt,
                              ).calendar()}
                              content={announcement.text}
                              key={announcement._id}
                              firstName={
                                announcement.memberId.account
                                  ? announcement.memberId.account
                                      .firstName
                                  : null
                              }
                              lastName={
                                announcement.memberId.account
                                  ? announcement.memberId.account
                                      .lastName
                                  : null
                              }
                              position={
                                announcement.memberId &&
                                announcement.memberId.designations
                                  .length > 0
                                  ? announcement.memberId
                                      .designations[0].position
                                  : announcement.memberId.role
                              }
                            />
                          ),
                        )
                      ) : (
                        <Typography>
                          {t('app.company.Dashboard.No-Announcement')}
                        </Typography>
                         // <Typography>No Announcement</Typography>
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
                                announcementItemsPerPage,
                            )}
                            {currentAnnouncementPage <
                              Math.ceil(
                                props.company.announce.length /
                                  announcementItemsPerPage,
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
                    </div>
                  )}
                </Card> */}

                <CompanyAnnouncementsList company={props.company} />
                {/* // */}
                <div className="w-50-ns w-100">
                  <h3
                    className="f3-ns f5"
                    style={{ color: '#3484F0' }}
                  >
                    {t('app.company.Dashboard.Update-of-task')}
                    {/* Latest Completed Tasks */}
                  </h3>
                  <div className="flex-ns justify-between mt2">
                    <Card className="w-100-l w-100 pa3-ns pa2 shadow-1 br2">
                      {props.completedTasks.length > 0 ? (
                        currentTasks.map((task: latestTask) => (
                          <div
                            className="flex flex-row-ns flex-column mb2"
                            key={task._id}
                          >
                            <div className="flex flex-row mb1 w-100">
                              <img
                                src={tick}
                                alt="tick"
                                className="mr2"
                                style={{
                                  height: '18px',
                                  width: '18px',
                                }}
                              />
                              <div className="w-100 flex flex-row lastest-completed-tasks">
                                <div className="mr1">
                                  <span
                                    className="fw6 mr3 ba b-light-gray br2 ph1"
                                    style={{
                                      color: '#BBBBBB',
                                      height: 'fit-content',
                                    }}
                                  >
                                    {task.project.name}
                                  </span>
                                  <span
                                    className="fw6"
                                    style={{ color: '#656565' }}
                                  >
                                    <span
                                      className="ttc"
                                      style={{ color: '#3484F0' }}
                                    >
                                      {task.name}
                                    </span>{' '}
                                    from {task.boardId.name}
                                    {t(
                                      'app.company.Dashboard.Complete-notification',
                                    )}
                                    {/* has been marked as complete. */}
                                  </span>
                                </div>
                                {/* {isMobileOnly ? null : (
                                  <span style={{ color: '#B4B4B4' }}>
                                    {moment(task.updatedAt).fromNow()}
                                  </span>
                                )}
                                {isMobileOnly ? (
                                  <span style={{ color: '#B4B4B4' }}>
                                    {moment(task.updatedAt).fromNow()}
                                  </span>
                                ) : null} */}
                                <span style={{ color: '#B4B4B4' }}>
                                  {moment(task.updatedAt).fromNow()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <Typography>
                          {t('app.company.Dashboard.Not-Marked')}
                          {/* None of the tasks have been marked as done. */}
                        </Typography>
                      )}
                      {props.completedTasks.length >
                        taskItemsPerPage && (
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
                                taskItemsPerPage,
                            )}
                            {currentTaskPage <
                              Math.ceil(
                                props.completedTasks.length /
                                  taskItemsPerPage,
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
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
      {/* {showAnnouncementDialog && (
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
              companyId={props.company._id}
            />
          </div>
        </Dialog>
      )} */}
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
  setSubscriptionExpire,
  setSubscriptionNotExpire,
  getLatestCompletedTasks,
  getCurrentSubscription,
})(DashboardViewComponent);
