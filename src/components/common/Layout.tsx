import * as React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { useState, useEffect } from 'react';
import { Loading } from './field/Loading';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { isEmpty, isEqual } from 'lodash';
import { withRouter, RouteComponentProps, match } from 'react-router-dom';
import { fetchUserAction } from 'stores/auth/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { getCompanyDetails } from 'stores/company/Actions';

const load = async (
  match: match,
  fetchUserAction: () => void,
  getCompanyDetails: (companyName: string) => void,
  setLoading: (val: boolean) => void
) => {
  await fetchUserAction();
  if (isEmpty((match.params as any).cname) === false) {
    await getCompanyDetails((match.params as any).cname);
  }
  return Promise.resolve({});
}

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

interface LayoutInternalProps extends LayoutProps, RouteComponentProps {
  user: User;
  fetchUserAction: () => void;
  getCompanyDetails: (companyName: string) => void;
  company: CompanyModel
}

const LayoutComponent = (props: LayoutInternalProps) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.match.url === '/' && props.user) {
      props.history.push(`/${props.user.username}`);
    }
    if ((props.match.params as any).username && props.user && props.user.username
      && isEqual((props.match.params as any).username, props.user.username) === false) {
      props.history.push(`/unavailable/profile`);
    }
    load(props.match, props.fetchUserAction, props.getCompanyDetails, setLoading).then(r => setLoading(false));
  }, [loading]);

  return (
    <div className="cf">
      <div className="fl w-100">
        <NavbarTop />
        <div className="fl w-100 bg-tigrowLightGray-1" style={{ marginTop: '50px' }}>
          {loading ? <Loading />
            : <div className="flex w-100">
              <div className="db">
                <Sidebar
                  user={props.user}
                  company={props.company}
                  type={(props.match.params as any).cname ? 'company' : 'default'}
                />
              </div>
              <div className="fl w-100 pl5 pl11-l pl6-m pr2 bg-tigrow">
                <props.Component />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany
  }
}

export const Layout = connect(mapStateToProps, { fetchUserAction, getCompanyDetails })(withRouter(LayoutComponent));
