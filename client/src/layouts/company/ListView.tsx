import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { getCompanyDetails } from 'stores/company/Actions';
import { History } from 'history';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { User, ICompanyByUser } from 'stores/user/Reducer';
import { Loading } from 'components/Loading';
import { getNotifications } from '../../stores/notifications/Action';
// import { isCompanyLoading } from 'stores/company/Selector';

import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';

interface CompanyListViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}
interface CompanyListViewInternalProps extends CompanyListViewProps {
  currentCompany: string;
  companies: ICompanyByUser[];
  user: User;
  getCompanyDetails: (companyId: string, history: History) => void;
  getAllCompaniesByUserId: (userId: string) => void;
  getNotifications: () => void;
  isCompanyLoading: boolean;
}

export const ListViewComponent = (
  props: CompanyListViewInternalProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading === true) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    setLoading(false);
  }, [loading]);

  return (
    <>
      <div
        className="mw6 center overflow-y-auto"
        style={{ maxHeight: '16rem' }}
      >
        {loading ? (
          <Loading />
        ) : props.companies && props.companies.length > 0 ? (
          props.companies &&
          props.companies.map(
            (c) =>
              c.company && (
                <article
                  // tslint:disable-next-line: max-line-length
                  className={`dt w-100 hover-bg-black-10 pa2 ${
                    props.currentCompany === c.company._id
                      ? 'bg-black-10'
                      : ''
                  } mt2 pointer bp3-popover-dismiss`}
                  onClick={async () => {
                    props.getNotifications();
                    dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
                    await props.getCompanyDetails(
                      c.company.uniqueName,
                      props.history,
                    );
                    if (props.isCompanyLoading === false) {
                      dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
                      props.history.push(
                        `/company/${
                          c.company.uniqueName
                        }/dashboard`,
                      );
                    }
                    // else{
                    //   props.history.push(`/notFound`);
                    // }
                  }}
                >
                  <div className="flex justify-between">
                    <img
                      src={
                        c.company.logo ? c.company.logo : CompanyIcon
                      }
                      className="v-mid dib br-100 w-10"
                      alt="user"
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="tl dtc v-mid pl3 w-90">
                      <h1 className="tl f7 f6-ns fw4 lh-title black mv0 ws-break">
                        {c.company.name}{' '}
                      </h1>
                      <h2 className="tl f6 fw3 mt0 mb0 black-60 ws-break">{`Role: ${c.role}`}</h2>
                    </div>
                  </div>
                </article>
              ),
          )
        ) : undefined}
      </div>
      <button
        onClick={() => props.setShowDialog(!props.showDialog)}
        className="b--none w-100 mt3 br2 grow ph5 pointer pv2 white outline-0 bg-tigrowLightBlue bp3-popover-dismiss"
      >
        Create Company
      </button>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
    isCompanyLoading: state.companyReducer.loading,
  };
};

export const CompanyListView = connect(mapStateToProps, {
  getCompanyDetails,
  getAllCompaniesByUserId,
  getNotifications,
})(withRouter(ListViewComponent));
