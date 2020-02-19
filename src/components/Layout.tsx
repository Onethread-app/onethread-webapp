import React, { useRef } from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { isEmpty, isEqual } from 'lodash';
import { withRouter, RouteComponentProps, match, Link } from 'react-router-dom';
import { fetchUserAction } from 'stores/auth/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { getCompanyDetails } from 'stores/company/Actions';
import { InstanceLocator, TokenUrlServer } from 'config';
import { getSelectedBoard, getSelectedTaskDetails } from 'stores/board/Actions';
import { History } from 'history'; 

import arrowLeft from '../resources/images/arrow left.svg';
import arrowRight from '../resources/images/arrow right.svg';

// tslint:disable-next-line: no-var-requires
const { ChatkitProvider, TokenProvider } = require('@pusher/chatkit-client-react');

const tokenProvider = new TokenProvider({ url: TokenUrlServer });

const load = async (
  reactRouterMatch: match,
  fetchUser: () => void,
  getCompanyInformation: (companyName: string) => any,
  getSelectedBoardDetails: (boardId: string) => void,
  getSelectedTask: (taskId: string) => void,
  history: History
) => {

  await fetchUser();
  if (isEmpty((reactRouterMatch.params as any).cname) === false) {
    const response = await getCompanyInformation((reactRouterMatch.params as any).cname);
    // TODO: should be in useEffect load promise
    if (response.status === 404) {
      history.push(`/notFound`);
    }
  }
  if (isEmpty((reactRouterMatch.params as any).boardId) === false) {
    await getSelectedBoardDetails((reactRouterMatch.params as any).boardId);
  }
  if (isEmpty((reactRouterMatch.params as any).taskId) === false) {
    await getSelectedTask((reactRouterMatch.params as any).taskId);
  }
  return Promise.resolve({});
};

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

interface LayoutInternalProps extends LayoutProps, RouteComponentProps {
  user: User;
  fetchUserAction: () => void;
  getCompanyDetails: (companyName: string) => any;
  getSelectedBoard: (boardId: string) => void;
  getSelectedTaskDetails: (taskId: string) => void;
  company: CompanyModel;
  rightSidebarOpen: boolean;
}

const LayoutComponent = (props: LayoutInternalProps) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.match.url === '/' && props.user) {
      props.history.push(`/${props.user.name}`);
    }
    if ((props.match.params as any).username && props.user && props.user.name
      && isEqual((props.match.params as any).username, props.user.name) === false) {
      props.history.push(`/unavailable/profile`);
    }
    if (isEmpty(props.user._id) === true || (isEmpty((props.match.params as any).cname) === false
      && isEmpty(props.company._id) === true)) {
      load(
        props.match,
        props.fetchUserAction,
        props.getCompanyDetails,
        props.getSelectedBoard,
        props.getSelectedTaskDetails,
        props.history
      ).then(() =>
        setLoading(false)
      );
    }
  }, [loading]);

  const [leftOpen, setLeftOpen] = useState(true);
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="cf vh-100"
      style={{ background: '#060517' }}
      onScroll={() => scrollRef && scrollRef.current && setScrollTop(scrollRef.current.scrollTop)}
    >
      {loading === true ? <Loading />
        : isEmpty(props.user._id) === true ?
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
          :
          <ChatkitProvider
            instanceLocator={InstanceLocator}
            tokenProvider={tokenProvider}
            userId={props.user._id}
          >
            <div
              id="main-layout"
              className={`flex relative h-100 ${props.rightSidebarOpen && 'main-layout-overlay'}`}
            >
              <div
                className={`relative`}
                style={{
                  transition: 'width 0.4s',
                  width: leftOpen ? '15%' : '4%'
                }}>
                <div>
                  <Sidebar
                    user={props.user}
                    company={props.company}
                    type={(props.match.params as any).cname ? 'company' : 'default'}
                    leftOpen={leftOpen}
                  />
                </div>
              </div>

              <div
                className="relative br3 pv1"
                style={{
                  transition: 'width 0.4s',
                  width: leftOpen ? props.rightSidebarOpen ? '55%' : '85%' : props.rightSidebarOpen ? '66%' : '96%'
                }}>
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
                <div
                  className="flex flex-column h-100"
                >
                  <NavbarTop
                    scrollTop={scrollTop}
                    type={(props.match.params as any).cname ? 'company' : 'default'}

                  />
                  <div
                    ref={scrollRef}
                    className="flex-grow-1 overflow-y-auto bg-white"
                    style={{ borderRadius: '0px 0px 0.5rem 0.5rem' }}>
                    <props.Component />
                  </div>
                </div>
              </div>

              <div
                className="relative h-100"
                style={{
                  transition: 'width 0.4s',
                  width: props.rightSidebarOpen ? '30%' : '0%',
                  zIndex: 5
                }}>
                <div
                  id="rightSidebar"
                  className="h-100 c-tigrowWhite"
                  style={{
                    background: 'rgb(6, 5, 23)'
                  }}
                >
                </div>
              </div>
            </div>
          </ChatkitProvider>
      }
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const Layout = connect(mapStateToProps,
  { fetchUserAction, getCompanyDetails, getSelectedBoard, getSelectedTaskDetails })(withRouter(LayoutComponent));
