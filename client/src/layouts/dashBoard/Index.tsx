import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';

import moment from 'moment';
import { Card } from '@blueprintjs/core/lib/esm/components/card/card';
import Typography from '@material-ui/core/Typography/Typography';

import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import {
  getCompanyAnnouncement,
  getLatestCompletedTasks,
} from 'stores/company/Actions';

import CompanyAnnouncementsList from 'components/dashboard/company-announcements-list/CompanyAnnouncementsList';
import { ProjectStatus } from 'components/dashboard/project-status/ProjectStatus';
import { Loading } from 'components/Loading';
import Navbar from 'components/navbar/Navbar';
import tick from '../../resources/images/tick.svg';
import {
  getCurrentSubscription,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
} from '../../stores/subscriptionBilling/Actions';

import './Index.scss';

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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const [taskItemsPerPage] = useState(10);
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

  const nextTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage + 1);
  };

  const prevTaskPage = (e) => {
    e.preventDefault();
    setCurrentTaskPage(currentTaskPage - 1);
  };

  const getDashboardInfo = async () => {
    try {
      props.setSubscriptionNotExpire();
      props.getLatestCompletedTasks();
      props.getCompanyAnnouncement();
      setLoading(false);
    } catch (err: any) {
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

  return (
    <>
      {loading === false ? (
        <>
          {isMobileOnly && <Navbar type='company' />}
          <div className='w-90 center mh2 mt4-l mt5 pb5 pb0-l'>
            <div>
              <div className='mt4 pb0-ns'>
                <ProjectStatus />
              </div>
              <div
                className='flex flex-row-ns flex-column-reverse w-100 items-start mt5 mb4 pb0-ns'
                style={{ gap: '1.5rem' }}
              >
                {/* Company Announcements List */}
                <CompanyAnnouncementsList company={props.company} />

                <div className='w-50-ns w-100'>
                  <h3
                    className='f3-ns f5'
                    style={{ color: '#34b3e9' }}
                  >
                    {t('app.company.Dashboard.Update-of-task')}
                  </h3>
                  <div className='flex-ns justify-between mt2'>
                    <Card className='w-100-l w-100 pa3-ns pa2 shadow-1 br2'>
                      {props.completedTasks.length > 0 ? (
                        currentTasks.map((task: latestTask) => (
                          <div
                            className='flex flex-row-ns flex-column mb2'
                            key={task._id}
                          >
                            <div className='flex flex-row mb1 w-100'>
                              <img
                                src={tick}
                                alt='tick'
                                className='mr2'
                                style={{
                                  height: '18px',
                                  width: '18px',
                                }}
                              />
                              <div className='w-100 flex flex-row lastest-completed-tasks'>
                                <div
                                  className='mr1'
                                  style={{ lineHeight: '21px' }}
                                >
                                  <span
                                    className='fw6 mr3 ba b-light-gray br2 ph1'
                                    style={{
                                      color: '#BBBBBB',
                                      height: 'fit-content',
                                    }}
                                  >
                                    {task.project.name}
                                  </span>
                                  <span
                                    className='fw6'
                                    style={{ color: '#656565' }}
                                  >
                                    <span
                                      className='ttc'
                                      style={{ color: '#34b3e9' }}
                                    >
                                      {task.name}
                                    </span>
                                    {' '}
                                    from
                                    {' '}
                                    {task.boardId.name}
                                    {' '}
                                    {t(
                                      'app.company.Dashboard.Complete-notification',
                                    )}
                                  </span>
                                </div>

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
                        </Typography>
                      )}
                      {props.completedTasks.length
                        > taskItemsPerPage && (
                        <div className='flex flex-row items-end w-100 justify-end'>
                          <div
                            className='f6 fw5 flex flex-row items-center'
                            style={{ color: '#BBBBBB' }}
                          >
                            {currentTaskPage > 1 && (
                              <span
                                className='mr2 pointer f4'
                                style={{ color: '#656565' }}
                                onClick={prevTaskPage}
                              >
                                &lt;
                              </span>
                            )}
                            {currentTaskPage}
                            {' '}
                            of
                            {' '}
                            {Math.ceil(
                              props.completedTasks.length
                                / taskItemsPerPage,
                            )}
                            {currentTaskPage
                              < Math.ceil(
                                props.completedTasks.length
                                  / taskItemsPerPage,
                              ) && (
                              <span
                                className='ml2 pointer f4'
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
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  company: state.companyReducer.currentCompany,
  subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  completedTasks: state.companyReducer.completedTasks,
});

export const DashboardView = connect(mapStateToProps, {
  getCompanyAnnouncement,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
  getLatestCompletedTasks,
  getCurrentSubscription,
})(DashboardViewComponent);

export default DashboardView;
