import { useRef } from 'react';
import { useState, useEffect } from 'react';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import {
  withRouter,
  RouteComponentProps,
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom';
import Modal from 'react-modal';
import { connect, useDispatch } from 'react-redux';
import { isEmpty, isEqual, isNil } from 'lodash';
import { useBeforeunload } from 'react-beforeunload';

import { Navbar } from '@blueprintjs/core/lib/esm/components/navbar/navbar';

import { ICompanyByUser, User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { ICompanyRoom, IRoom } from 'stores/room/Reducer';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { fetchUserAction } from 'stores/auth/Actions';
import { getCompanyDetails } from 'stores/company/Actions';
import { getSelectedTaskDetails } from 'stores/task/Actions';
import {
  getSingleProject,
  getUserFavouriteProjects,
} from 'stores/project/Actions';
import {
  fetchRooms,
  getRoomMembers,
  getRoomMessages,
  getRoomSharedFiles,
  getRoomDiscussions,
} from 'stores/room/Actions';
import { companyPermit } from 'stores/UtilsActions';
import { addTrackedTime } from 'stores/time-tracker/Action';
import { updateDurationPersecond } from 'stores/time-tracker/Action';
import { setSubscriptionNotExpire } from 'stores/subscriptionBilling/Actions';
import { CURRENT_ROOM } from 'stores/room/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';

import arrowLeft from '../resources/images/leftArrow.svg';
import arrowRight from '../resources/images/rightArrow.svg';
import companyProfile from '../resources/images/sidebarCompanyProfile.svg';
import dashboard from '../resources/images/sideBarDashboard.svg';
import project from '../resources/images/ProjectsIcon.svg';
import team from '../resources/images/sidebarTeam.svg';
import associate from '../resources/images/sideBarAssociates.svg';
import settings from '../resources/images/sidebarSettings.svg';
import feedbackLight from '../resources/images/feedback-light.svg';

import SuspenseLoader from './loader/SuspenseLoader';
import { SecondaryLayout } from './SecondaryLayout';
import { RoomQueries } from 'layouts/company/room/Index';
import ErrorText from 'layouts/company/settings/ErrorText';
import NavbarTop from 'components/navbar/Navbar';
import { customStylesForModal } from 'layouts/company/settings/Index';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import Sidebar from './sidebar/Sidebar';
import UpdatedNavbar from './updatedNavbar/Navbar';
import {
  ErrorToaster,
  SuccessToaster,
} from 'layouts/home/Index.styles';

interface LayoutProps {
  Component: React.ComponentClass | React.FunctionComponent;
}

interface LayoutInternalProps
  extends LayoutProps,
    RouteComponentProps {
  user: User;
  fetchingUser: boolean;
  fetchUserAction: () => void;
  getCompanyDetails: (companyName: string) => any;
  getSelectedTaskDetails: ({ taskId, projectId, companyId }) => any;
  getSingleProject: (pid: string) => void;
  fetchRooms: () => void;
  company: ICompany;
  userCompanies: ICompanyByUser[];
  companyRooms: ICompanyRoom[];
  rightSidebarOpen: boolean;
  project: any;
  taskId: string;
  companyLoading: boolean;
  projectLoading: boolean;
  boardLoading: boolean;
  rooms: IRoom[];
  currentlyTracking: ICurrentTrack;
  subscriptiontExpired: boolean;
  getRoomMembers: (roomId: string) => void;
  getRoomMessages: (roomId: string) => void;
  getRoomSharedFiles: (roomId: string) => void;
  getRoomDiscussions: (roomId: string) => void;
  addTrackedTime: (payload: ICurrentTrack) => void;
  setSubscriptionNotExpire: () => void;
  getAllCompaniesByUserId: (arg: string) => void;
  getUserFavouriteProjects: () => void;
  favouriteProjects: any;
}

const LayoutComponent = (props: LayoutInternalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [leftOpen, setLeftOpen] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });

  const [showToaster, setShowToaster] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [subscriptionExpired, setSubscriptionExpired] =
    useState(false);

  const updateCompanyReducer = () => {
    props.getCompanyDetails((props.match.params as any).cname);
  };
  const updateProjectReducer = () => {
    props.getSingleProject((props.match.params as any).projectId);
  };

  const updateTaskReducer = () => {
    props.getSelectedTaskDetails({
      taskId: (props.match.params as any).taskId,
      companyId: props.company._id,
      projectId: (props.match.params as any).projectId,
    });
  };

  const closeSubErrorModal = () => {
    setSubscriptionExpired(false);
    dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
    props.setSubscriptionNotExpire();
    props.history.push(`/${props.user.name}/home`);
  };

  const useToaster = () => {
    return {
      showToaster,
      successMessage,
      errorMessage,
      setShowToaster,
      setErrorMessage,
      setSuccessMessage,
    };
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roomId = query.get('roomId') ? query.get('roomId')! : '';

    if (props.rooms.length !== 0 && roomId !== '') {
      const currentRoom = props.rooms.filter((room) =>
        isEqual(room._id, roomId),
      );
      if (currentRoom.length > 0) {
        dispatch({ type: CURRENT_ROOM, payload: currentRoom[0] });
        props.getRoomMessages(roomId);
        props.getRoomMembers(roomId);
        props.getRoomSharedFiles(roomId);
        props.getRoomDiscussions(roomId);
      }
    }
  }, [props.rooms, location.search]);

  useEffect(() => {
    const { path } = props.match;
    const { cname } = props.match.params as any;

    if (
      path.includes('cname') &&
      (isNil(cname) === true || cname === 'undefined')
    ) {
      props.history.push(`/notFound`);
    }

    if (path.includes('cname') === false) {
      props.setSubscriptionNotExpire();
      setSubscriptionExpired(false);
    }

    if (cname && cname !== props.company.uniqueName) {
      props.setSubscriptionNotExpire();
      updateCompanyReducer();
    }
  }, [props.match, props.company.uniqueName]);

  useEffect(() => {
    const { path } = props.match;
    const { projectId } = props.match.params as any;
    if (
      path.includes('projectId') &&
      (isNil(projectId) === true || projectId === 'undefined')
    ) {
      props.history.push(`/notFound`);
    }
    if (
      !isEmpty(props.company._id) &&
      !isEmpty(projectId) &&
      projectId !== props.project._id
    ) {
      updateProjectReducer();
    }
  }, [props.match, props.company._id, props.project._id]);

  useEffect(() => {
    const { path } = props.match;
    const { taskId } = props.match.params as any;
    if (
      path.includes('taskId') &&
      (isNil(taskId) === true || taskId === 'undefined')
    ) {
      props.history.push(`/notFound`);
    }

    if (taskId && taskId !== props.taskId) {
      updateTaskReducer();
    }
  }, [props.match, props.taskId]);

  useEffect(() => {
    if (
      loading === true &&
      // props.fetchingUser === false &&
      isEmpty(props.user._id) === false
    ) {
      setLoading(false);
    }
  }, [loading, props.user._id]);

  useEffect(() => {
    if (!Boolean(props.user._id)) {
      props.fetchUserAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user._id]);

  useEffect(() => {
    if (
      props.match.url === '/' &&
      isEmpty(props.user._id) === false
    ) {
      props.history.push(`/${props.user.name}/home`);
    }
    if (
      (props.match.params as any).username &&
      props.user &&
      props.user.name &&
      isEqual(
        (props.match.params as any).username,
        props.user.name,
      ) === false
    ) {
      props.history.push(`/notFound`);
    }
  }, [props.user, props.user._id, props.match.params]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [location.search]);

  useEffect(() => {
    let interval;

    if (!!props.currentlyTracking.startTime) {
      interval = setInterval(() => {
        if (!!props.currentlyTracking.startTime) {
          const difference =
            new Date().getTime() -
            new Date(props.currentlyTracking.startTime).getTime();
          dispatch(updateDurationPersecond(difference));
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [props.currentlyTracking.startTime]);

  useEffect(() => {
    if (
      isNil(props.company._id) === false &&
      isEmpty(props.company._id) === false &&
      props.subscriptiontExpired === true &&
      props.match.path.includes('settings') === false
    ) {
      setSubscriptionExpired(true);
    }
  }, [
    props.company._id,
    props.match.path,
    props.subscriptiontExpired,
  ]);

  useEffect(() => {
    if (
      subscriptionExpired &&
      props.company.role === 'superAdmin' &&
      props.match.path.includes('company')
    ) {
      props.history.push(
        `/company/${props.company.uniqueName}/settings/`,
      );
    }
  }, [subscriptionExpired]);

  useEffect(() => {
    setSubscriptionExpired(props.subscriptiontExpired);
  }, [props.subscriptiontExpired]);

  useEffect(() => {
    if (props.user._id && props.userCompanies.length === 0) {
      props.getAllCompaniesByUserId(props.user._id);
      props.getUserFavouriteProjects();
    }
  }, [props.user._id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowToaster(false);
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToaster]);

  useBeforeunload((event) => {
    if (props.currentlyTracking.name !== '') {
      event.preventDefault();
      props.addTrackedTime(props.currentlyTracking);
    }
  });

  return (
    <div
      className="cf vh-100"
      style={{
        background: isMobileOnly
          ? 'white'
          : loading
          ? '#fff'
          : '#303053',
      }}
      onScroll={() =>
        scrollRef &&
        scrollRef.current &&
        setScrollTop(scrollRef.current.scrollTop)
      }
    >
      {loading === true ? (
        <SuspenseLoader />
      ) : isEmpty(props.user._id) === true ? (
        <p className="f3 tc fw5 pt4 white">
          Your Session is expired. Please
          <Link
            className="fw9 dt center tigrow-lightBlue pt4"
            to="/signin"
            onClick={() => {
              localStorage.removeItem('ot_access_id');
              localStorage.removeItem('ot_refresh_id');
            }}
          >
            {t('landing.login.sign-in-form.sign-in-button')}
          </Link>
        </p>
      ) : (
        <>
          <CustomView condition={!isMobileOnly}>
            <div
              id="main-layout"
              className={`flex relative vh-100 ${
                props.rightSidebarOpen && 'main-layout-overlay'
              }`}
            >
              <div
                className={`relative`}
                style={{
                  transition: 'width 0.4s ease-in-out',
                  width: !leftOpen ? '15%' : '55px',
                  // minWidth: !leftOpen ? '150px' : '55px',
                  margin: '0 auto',
                }}
              >
                <div>
                  {/* <Sidebar
                    user={props.user}
                    company={props.company}
                    type={
                      (props.match.params as any).cname
                        ? 'company'
                        : 'default'
                    }
                    leftOpen={!leftOpen}
                    project={props.project}
                    companyRooms={props.companyRooms}
                  /> */}
                  <Sidebar
                    leftOpen={leftOpen}
                    companies={props.userCompanies}
                    user={props.user}
                    project={props.project}
                    favouriteProjects={props.favouriteProjects}
                  />
                </div>
              </div>
              <div
                className="relative br3 pv1"
                style={{
                  transition: 'width 0.4s',
                  width: !leftOpen
                    ? props.rightSidebarOpen
                      ? '55%'
                      : '85%'
                    : props.rightSidebarOpen
                    ? '66%'
                    : '96%',
                }}
              >
                <span
                  className="pointer absolute bg-white flex justify-center items-center w-3 h-3 bp3-icon z-3 top-1 left--1"
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D8D8D8',
                    borderRadius: '999px',
                  }}
                  onClick={() => setLeftOpen(!leftOpen)}
                >
                  <img
                    src={!leftOpen ? arrowLeft : arrowRight}
                    className="br2"
                    style={{ width: '0.5rem' }}
                    color="#34b3e9"
                    alt=""
                  />
                </span>
                <div className="flex flex-column h-100">
                  {/* <NavbarTop
                    scrollTop={scrollTop}
                    type={
                      (props.match.params as any).cname
                        ? 'company'
                        : 'default'
                    }
                  /> */}
                  <UpdatedNavbar
                    scrollTop={scrollTop}
                    useToaster={useToaster}
                  />
                  <div
                    ref={scrollRef}
                    className="flex-grow-1 overflow-y-auto bg-white"
                    style={{
                      borderRadius: '0px 0px 0.5rem 0.5rem',
                    }}
                  >
                    <SecondaryLayout Component={props.Component} />
                  </div>
                </div>
              </div>
              <div
                className="relative h-100 vh-100"
                style={{
                  transition: 'width 0.4s',
                  width: props.rightSidebarOpen ? '30%' : '0%',
                  zIndex: 1,
                }}
              >
                <div
                  id="rightSidebar"
                  className="h-100 c-tigrowWhite"
                  style={{
                    background: 'rgb(6, 5, 23)',
                  }}
                ></div>
              </div>
            </div>
          </CustomView>
          <MobileOnlyView>
            {queries.view === 'default' ? (
              <div
                id="main-layout"
                className={`flex relative h-100 vh-100 ${
                  props.rightSidebarOpen && 'main-layout-overlay'
                }`}
              >
                <div
                  className="relative br3 pv1"
                  style={{
                    transition: 'width 0.4s',
                    width: props.rightSidebarOpen ? '0%' : '100%',
                  }}
                >
                  <div className="flex flex-column h-100">
                    <div
                      ref={scrollRef}
                      className="flex-grow-1 overflow-y-auto bg-white"
                      style={{
                        borderRadius: '0px 0px 0.5rem 0.5rem',
                      }}
                    >
                      <SecondaryLayout Component={props.Component} />
                    </div>
                    {(props.match.params as any).cname ? (
                      props.rightSidebarOpen ? undefined : (
                        <Navbar
                          className="flex"
                          style={{
                            position: 'fixed',
                            bottom: '0',
                            height: '65px',
                            overflowX: 'scroll',
                          }}
                        >
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={companyProfile}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.user.Personal-profile.Profile')}
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}/dashboard`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={dashboard}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.company.Dashboard.Headline')}
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}/project`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={project}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.homepage.Projects')}
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}/colleague`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={team}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.company.Colleagues.Colleagues')}
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}/associates`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={associate}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.company.Partners.Partners')}
                            </small>
                          </NavLink>
                          {companyPermit(props.company.role) &&
                            props.company.role !== 'employee' && (
                              <NavLink
                                exact
                                activeStyle={{
                                  background: '#34b3e9',
                                  color: 'white',
                                }}
                                style={{ color: '#34b3e9' }}
                                to={`/company/${props.company.uniqueName}/settings`}
                                className="hover-bg-black-20 pa2 flex flex-column items-center"
                              >
                                <span className="">
                                  <img
                                    alt="settings icon"
                                    src={settings}
                                    className="br3"
                                    style={{ width: '1.4rem' }}
                                  />
                                </span>
                                <small style={{ color: 'inherit' }}>
                                  {t('app.company.Settings.Settings')}
                                </small>
                              </NavLink>
                            )}
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#34b3e9',
                              color: 'white',
                            }}
                            style={{ color: '#34b3e9' }}
                            to={`/company/${props.company.uniqueName}/feedback`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={feedbackLight}
                                className="br3"
                                style={{ width: '1.4rem' }}
                                alt=""
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              {t('app.company.Feedback.Feedback')}
                            </small>
                          </NavLink>
                        </Navbar>
                      )
                    ) : (
                      <NavbarTop type="home" />
                    )}
                  </div>
                </div>
                <div
                  className="relative h-100 vh-100"
                  style={{
                    transition: 'width 0.4s',
                    width: props.rightSidebarOpen ? '100%' : '0%',
                    zIndex: 5,
                  }}
                >
                  <div
                    id="rightSidebar"
                    className="h-100 c-tigrowWhite vh-100"
                    style={{
                      background: 'rgb(6, 5, 23)',
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="vh-100 bg-white">
                <SecondaryLayout Component={props.Component} />
              </div>
            )}
          </MobileOnlyView>
        </>
      )}

      {Boolean(showToaster && errorMessage) ? (
        <ErrorToaster>{errorMessage}</ErrorToaster>
      ) : null}
      {Boolean(showToaster && successMessage) ? (
        <SuccessToaster>{successMessage}</SuccessToaster>
      ) : null}

      {props.match.url.includes(
        `/company/${props.company?.uniqueName}`,
      ) &&
      subscriptionExpired === true &&
      props.company.role !== 'superAdmin' ? (
        <Modal
          isOpen={subscriptionExpired}
          onRequestClose={closeSubErrorModal}
          style={customStylesForModal}
          contentLabel="Example Modal"
        >
          <ErrorText
            closeModal={closeSubErrorModal}
            text={`${
              props.company.role === 'superAdmin'
                ? 'Your Subscription has expired'
                : 'Your Subscription has expired, contact with Super Admin'
            }`}
            subtext="To keep using Onethread without interruption you need to pay your
            dues."
          />
        </Modal>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    fetchingUser: state.userReducer.fetchingUser,
    company: state.companyReducer.currentCompany,
    rightSidebarOpen: state.layoutReducer.rightSidebar.open,
    project: state.projectReducer.projectDetails,
    taskId: state.taskIndexReducer.taskReducer.currentTask._id,
    companyRooms: state.roomReducer.companyRooms,
    rooms: state.roomReducer.rooms,
    companyLoading: state.companyReducer.loading,
    projectLoading: state.projectReducer.singleProjectLoading,
    boardLoading: state.taskIndexReducer.taskReducer.fetchingBoard,
    currentlyTracking: state.timeTrackerReducer.currentlyTracking,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    userCompanies: state.userReducer.user.companies,
    favouriteProjects: state.projectReducer.favouriteProjects,
  };
};

export const Layout = connect(mapStateToProps, {
  fetchUserAction,
  getCompanyDetails,
  getSelectedTaskDetails,
  getSingleProject,
  fetchRooms,
  getRoomDiscussions,
  getRoomMembers,
  getRoomMessages,
  getRoomSharedFiles,
  addTrackedTime,
  setSubscriptionNotExpire,
  getAllCompaniesByUserId,
  getUserFavouriteProjects,
})(withRouter(LayoutComponent));

export default Layout;
