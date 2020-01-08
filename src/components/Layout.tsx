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
import { getSelectedBoard } from 'stores/board/Actions';

import arrowLeft from '../resources/images/arrow left.svg';
import arrowRight from '../resources/images/arrow right.svg';

// tslint:disable-next-line: no-var-requires
const { ChatkitProvider, TokenProvider } = require('@pusher/chatkit-client-react');

const tokenProvider = new TokenProvider({ url: TokenUrlServer });

const load = async (
  reactRouterMatch: match,
  fetchUser: () => void,
  getCompanyInformation: (companyName: string) => void,
  getSelectedBoardDetails: (boardId: string) => void
) => {
  await fetchUser();
  if (isEmpty((reactRouterMatch.params as any).cname) === false) {
    await getCompanyInformation((reactRouterMatch.params as any).cname);
  }
  if (isEmpty((reactRouterMatch.params as any).boardId) === false) {
    await getSelectedBoardDetails((reactRouterMatch.params as any).boardId);
  }
  return Promise.resolve({});
};

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

interface LayoutInternalProps extends LayoutProps, RouteComponentProps {
  user: User;
  fetchUserAction: () => void;
  getCompanyDetails: (companyName: string) => void;
  getSelectedBoard: (boardId: string) => void;
  company: CompanyModel;
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
        props.getSelectedBoard
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
      className="cf vh-100 pa1"
      style={{ background: '#060517' }}
      onScroll={() => scrollRef && scrollRef.current && setScrollTop(scrollRef.current.scrollTop)}
    >
      <div className="flex overflow-hidden">
        <div
          className="w-100 border-box overflow-auto">
          {loading === true ? <Loading />
            : isEmpty(props.user._id) === true ?
              <p className="f3 tc fw5 pt4 white">
                Your Session is expired. Please
              <Link
                  className="fw9 dt center tigrow-lightBlue pt4"
                  to="/signin"
                  onClick={() => localStorage.removeItem('token')}
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
                <div className="flex">
                  <div
                    className="relative"
                    style={{
                      transition: 'width 0.4s',
                      width: leftOpen ? '15%' : '3%'
                    }}>
                    <div
                      className="fixed"
                      style={{
                        transform: leftOpen ? 'translateX(0%)' : 'translateX(-100%)',
                        msTransform: leftOpen ? '' : 'translateX(-100%)',
                        WebkitTransition: leftOpen ? '' : 'translateX(-100%)',
                      }}>
                      <Sidebar
                        user={props.user}
                        company={props.company}
                        type={(props.match.params as any).cname ? 'company' : 'default'}
                        leftOpen={leftOpen}
                      />
                    </div>
                  </div>
                  <div className="fl w-100 bg-white relative br3">
                    <span
                      className="pointer absolute bp3-icon z-999 top-1 left--1"
                      onClick={() => setLeftOpen(!leftOpen)}
                    >
                      <img
                        src={leftOpen ? arrowLeft : arrowRight}
                        className="br2 w2"
                        color="#0FA3A3"
                      />
                    </span>
                    <div
                      className="flex flex-column"
                      style={{
                        height: 'calc(100vh - 0.7rem)',
                      }}>
                      <NavbarTop scrollTop={scrollTop} />
                      <div
                        ref={scrollRef}
                        className="flex-grow-1 overflow-y-auto">
                        <props.Component />
                      </div>
                    </div>
                  </div>
                </div>
              </ChatkitProvider>
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany
  };
};

export const Layout = connect(mapStateToProps,
  { fetchUserAction, getCompanyDetails, getSelectedBoard })(withRouter(LayoutComponent));
