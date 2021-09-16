import React, { useRef } from 'react';
// import { NavbarTop } from 'components/Navbar';
import NavbarTop from 'components/navbar/Navbar';
import { Sidebar } from 'components/Sidebar';
import { useState, useEffect } from 'react';
// import { Loading } from './Loading';
import { connect, useDispatch } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { isEmpty, isEqual, isNil } from 'lodash';
import {
  withRouter,
  RouteComponentProps,
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { fetchUserAction } from 'stores/auth/Actions';
import { ICompany } from 'stores/company/Reducer';
import { getCompanyDetails } from 'stores/company/Actions';
import {
  getSelectedBoard,
  getSelectedTaskDetails,
} from 'stores/task/Actions';
import { getSingleProject } from 'stores/project/Actions';
import {
  fetchRooms,
  getRoomMembers,
  getRoomMessages,
  getRoomSharedFiles,
  getRoomDiscussions,
} from 'stores/room/Actions';
import { addTrackedTime } from 'stores/time-tracker/Action';

import arrowLeft from '../resources/images/arrow left.svg';
import arrowRight from '../resources/images/arrow right.svg';
import companyProfile from '../resources/images/sidebarCompanyProfile.svg';
import dashboard from '../resources/images/sideBarDashboard.svg';
import project from '../resources/images/ProjectsIcon.svg';
import team from '../resources/images/sidebarTeam.svg';
import associate from '../resources/images/sideBarAssociates.svg';
import settings from '../resources/images/sidebarSettings.svg';
import feedbackLight from '../resources/images/feedback-light.svg';
import { ICompanyRoom, IRoom } from 'stores/room/Reducer';
import { SecondaryLayout } from './SecondaryLayout';
import { RoomQueries } from 'layouts/company/room/Index';

import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { Navbar } from '@blueprintjs/core';
// import { NavbarIndividual } from './NavbarIndividual';
import { companyPermit } from 'stores/UtilsActions';
import { CURRENT_ROOM } from 'stores/room/Types';
import { useTranslation } from 'react-i18next';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { updateDurationPersecond } from 'stores/time-tracker/Action';
import { setSubscriptionNotExpire } from 'stores/subscriptionBilling/Actions';
import SuspenseLoader from './loader/SuspenseLoader';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import ErrorText from 'layouts/company/settings/ErrorText';
import Modal from 'react-modal';
import { customStylesForModal } from 'layouts/company/settings/Index';

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

interface LayoutInternalProps
  extends LayoutProps,
    RouteComponentProps {
  user: User;
  fetchingUser: boolean;
  fetchUserAction: () => void;
  getCompanyDetails: (companyName: string) => any;
  getSelectedBoard: (boardId: string) => any;
  getSelectedTaskDetails: (taskId: string) => any;
  getSingleProject: (pid: string) => void;
  fetchRooms: () => void;
  company: ICompany;
  companyRooms: ICompanyRoom[];
  rightSidebarOpen: boolean;
  project: any;
  boardId: string;
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
}

const LayoutComponent = (props: LayoutInternalProps) => {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });
  const [subscriptionExpired, setSubscriptionExpired] = useState(
    false,
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const updateCompanyReducer = () => {
    props.getCompanyDetails((props.match.params as any).cname);
  };
  const updateProjectReducer = () => {
    props.getSingleProject((props.match.params as any).projectId);
  };

  const updateBoardReducer = () => {
    props.getSelectedBoard((props.match.params as any).boardId);
  };

  const updateTaskReducer = () => {
    props.getSelectedTaskDetails((props.match.params as any).taskId);
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
      dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
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
    const { boardId } = props.match.params as any;
    if (
      path.includes('boardId') &&
      (isNil(boardId) === true || boardId === 'undefined')
    ) {
      props.history.push(`/notFound`);
    }
    if (
      !isEmpty(props.company._id) &&
      !isEmpty(props.project._id) &&
      !isEmpty(boardId) &&
      boardId !== props.boardId
    ) {
      updateBoardReducer();
    }
    props.fetchRooms();
  }, [props.match, props.project._id, props.boardId]);

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
      props.fetchingUser === false &&
      isEmpty(props.user._id) === false
    ) {
      setLoading(false);
    }
  }, [loading, props.fetchingUser]);

  useEffect(() => {
    if (isEmpty(props.user._id) === true) {
      props.fetchUserAction();
    }
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
    return () => {
      if (!isEmpty(props.currentlyTracking.name)) {
        props.addTrackedTime(props.currentlyTracking);
      }
    };
  }, []);

  const [leftOpen, setLeftOpen] = useState(true);
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let interval;

    if (props.currentlyTracking.name) {
      interval = setInterval(() => {
        dispatch(updateDurationPersecond());
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [props.currentlyTracking.name]);

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

  const closeSubErrorModal = () => {
    setSubscriptionExpired(false);
    props.company.role === 'superAdmin'
      ? props.history.push(
          `/company/${props.company.uniqueName}/settings/`,
        )
      : props.history.push(`/${props.user.name}/home`);
  };

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
              localStorage.removeItem('tigrow_acc_id');
              localStorage.removeItem('tigrow_real_id');
            }}
          >
            {t('landing.login.sign-in-form.sign-in-button')}
            {/* Sign in */}
          </Link>
        </p>
      ) : (
        <>
          <CustomView condition={!isMobileOnly}>
            {props.match.url !== `/${props.user.name}/home` ? (
              <div
                id="main-layout"
                className={`flex relative vh-100 ${
                  props.rightSidebarOpen && 'main-layout-overlay'
                }`}
              >
                <div
                  className={`relative`}
                  style={{
                    transition: 'width 0.4s',
                    width: !leftOpen ? '15%' : '4%',
                  }}
                >
                  <div>
                    <Sidebar
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
                    className="pointer absolute bp3-icon z-3 top-1 left--1"
                    onClick={() => setLeftOpen(!leftOpen)}
                  >
                    <img
                      src={!leftOpen ? arrowLeft : arrowRight}
                      className="br2 w2"
                      color="#34b3e9"
                      alt=""
                    />
                  </span>
                  <div className="flex flex-column h-100">
                    <NavbarTop
                      scrollTop={scrollTop}
                      type={
                        (props.match.params as any).cname
                          ? 'company'
                          : 'default'
                      }
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
                    zIndex: 5,
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
            ) : (
              <div className="relative">
                <div className="flex flex-column h-100">
                  <NavbarTop scrollTop={scrollTop} type={'home'} />
                  <div
                    ref={scrollRef}
                    className="flex-grow-1 overflow-y-auto bg-white"
                  >
                    <SecondaryLayout Component={props.Component} />
                  </div>
                </div>
              </div>
            )}
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
                              {/* Profile */}
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
                              {/* Dashboard */}
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
                              {/* Project */}
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
                              {/* Colleagues */}
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
                              {/* Partners */}
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
                                  {/* Settings */}
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
                              {/* Feedback */}
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
      {subscriptionExpired && (
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
      )}
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
    boardId: state.taskIndexReducer.taskReducer.currentBoard._id,
    taskId: state.taskIndexReducer.taskReducer.currentTask._id,
    companyRooms: state.roomReducer.companyRooms,
    rooms: state.roomReducer.rooms,
    companyLoading: state.companyReducer.loading,
    projectLoading: state.projectReducer.singleProjectLoading,
    boardLoading: state.taskIndexReducer.taskReducer.fetchingBoard,
    currentlyTracking: state.timeTrackerReducer.currentlyTracking,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};

export const Layout = connect(mapStateToProps, {
  fetchUserAction,
  getCompanyDetails,
  getSelectedBoard,
  getSelectedTaskDetails,
  getSingleProject,
  fetchRooms,
  getRoomDiscussions,
  getRoomMembers,
  getRoomMessages,
  getRoomSharedFiles,
  addTrackedTime,
  setSubscriptionNotExpire,
})(withRouter(LayoutComponent));

export default Layout;
