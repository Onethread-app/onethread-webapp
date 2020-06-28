import React, { useRef } from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { isEmpty, isEqual } from 'lodash';
import {
  withRouter,
  RouteComponentProps,
  match,
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
} from 'stores/board/Actions';

import arrowLeft from '../resources/images/arrow left.svg';
import arrowRight from '../resources/images/arrow right.svg';
import companyProfile from '../resources/images/sidebarCompanyProfile.svg';
import dashboard from '../resources/images/sideBarDashboard.svg';
import project from '../resources/images/ProjectsIcon.svg';
import team from '../resources/images/sidebarTeam.svg';
import associate from '../resources/images/sideBarAssociates.svg';
import settings from '../resources/images/sidebarSettings.svg';
import { ICompanyRoom } from 'stores/room/Reducer';
import { SecondaryLayout } from './SecondaryLayout';
import { RoomQueries } from 'layouts/company/room/Index';
import { getAllCompaniesByUserId } from 'stores/user/Actions';

import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { Navbar } from '@blueprintjs/core';
import { NavbarIndividual } from './NavbarIndividual';
import { companyPermit } from 'stores/UtilsActions';

const load = async (
  reactRouterMatch: match,
  fetchUser: () => void,
  getAllCompaniesByUserId: (userId: string) => void,
  getCompanyInformation: (companyName: string) => any,
  getSelectedBoardDetails: (boardId: string) => any,
  getSelectedTask: (taskId: string) => any,
) => {
  await fetchUser();
  await getAllCompaniesByUserId((reactRouterMatch.params as any).username)
  if (isEmpty((reactRouterMatch.params as any).cname) === false) {
    const response = await getCompanyInformation(
      (reactRouterMatch.params as any).cname,
    );
    // only handled for 404 error status
    if (response.status === 404) {
      return response.status;
    }
  }
  if (isEmpty((reactRouterMatch.params as any).boardId) === false) {
    const responseStatus = await getSelectedBoardDetails(
      (reactRouterMatch.params as any).boardId,
    );
    // only handled for 404 error status
    if (responseStatus === 404) {
      return responseStatus;
    }
  }
  if (isEmpty((reactRouterMatch.params as any).taskId) === false) {
    const responseStatus = await getSelectedTask(
      (reactRouterMatch.params as any).taskId,
    );
    // only handled for 404 error status
    if (responseStatus === 404) {
      return responseStatus;
    }
  }
  return Promise.resolve({});
};

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

interface LayoutInternalProps
  extends LayoutProps,
    RouteComponentProps {
  user: User;
  fetchUserAction: () => void;
  getAllCompaniesByUserId: (userId: string) => void;
  getCompanyDetails: (companyName: string) => any;
  getSelectedBoard: (boardId: string) => any;
  getSelectedTaskDetails: (taskId: string) => any;
  company: ICompany;
  companyRooms: ICompanyRoom[];
  rightSidebarOpen: boolean;
  project: any;
}

const LayoutComponent = (props: LayoutInternalProps) => {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });
  const [showMenu, setShowMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (
      props.match.url === '/' &&
      isEmpty(props.user._id) === false
    ) {
      props.history.push(`/${props.user.name}`);
      setLoading(false);
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
      setLoading(false);
      props.history.push(`/notFound`);
    }
    if (
      isEmpty(props.user._id) === true ||
      (isEmpty((props.match.params as any).cname) === false &&
        isEmpty(props.company._id) === true)
    ) {
      load(
        props.match,
        props.fetchUserAction,
        props.getAllCompaniesByUserId,
        props.getCompanyDetails,
        props.getSelectedBoard,
        props.getSelectedTaskDetails,
      ).then((response) => {
        setLoading(false);
        if (response === 404) {
          props.history.push(`/notFound`);
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [location.search]);

  const [leftOpen, setLeftOpen] = useState(true);
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="cf vh-100"
      style={{ background: isMobileOnly ? 'white' : '#060517' }}
      onScroll={() =>
        scrollRef &&
        scrollRef.current &&
        setScrollTop(scrollRef.current.scrollTop)
      }
    >
      {loading === true ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Loading />
        </div>
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
            Sign in
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
                    width: leftOpen ? '15%' : '4%',
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
                      leftOpen={leftOpen}
                      project={props.project}
                      companyRooms={props.companyRooms}
                    />
                  </div>
                </div>
                <div
                  className="relative br3 pv1"
                  style={{
                    transition: 'width 0.4s',
                    width: leftOpen
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
                      src={leftOpen ? arrowLeft : arrowRight}
                      className="br2 w2"
                      color="#0FA3A3"
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
              <div
                  className="relative"
                >
                  <div className="flex flex-column h-100">
                    <NavbarTop
                      scrollTop={scrollTop}
                      type={'home'}
                    />
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
                          className="flex justify-around"
                          style={{
                            position: 'fixed',
                            bottom: '0',
                            height: '65px',
                          }}
                        >
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={companyProfile}
                                className="br3"
                                style={{ width: '1.4rem' }}
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              Profile
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}/dashboard`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={dashboard}
                                className="br3"
                                style={{ width: '1.4rem' }}
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              Dashboard
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}/project`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={project}
                                className="br3"
                                style={{ width: '1.4rem' }}
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              Project
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}/colleague`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={team}
                                className="br3"
                                style={{ width: '1.4rem' }}
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              Colleagues
                            </small>
                          </NavLink>
                          <NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}/associates`}
                            className="hover-bg-black-20 pa2 flex flex-column items-center"
                          >
                            <span className="">
                              <img
                                src={associate}
                                className="br3"
                                style={{ width: '1.4rem' }}
                              />
                            </span>
                            <small style={{ color: 'inherit' }}>
                              Associates
                            </small>
                          </NavLink>
                          {(companyPermit(props.company.role) && props.company.role !== 'employee') && (<NavLink
                            exact
                            activeStyle={{
                              background: '#3F61C5',
                              color: 'white',
                            }}
                            style={{ color: '#3F61C5' }}
                            to={`/company/${props.company.name}/settings`}
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
                              Settings
                            </small>
                          </NavLink>)}
                        </Navbar>
                      )
                    ) : (
                      <NavbarIndividual
                        showDialog={showMenu}
                        setShowDialog={setShowMenu}
                      />
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
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
    rightSidebarOpen: state.layoutReducer.rightSidebar.open,
    project: state.projectReducer.projectDetails,
    companyRooms: state.roomReducer.companyRooms,
  };
};

export const Layout = connect(mapStateToProps, {
  fetchUserAction,
  getCompanyDetails,
  getSelectedBoard,
  getSelectedTaskDetails,
  getAllCompaniesByUserId
})(withRouter(LayoutComponent));
