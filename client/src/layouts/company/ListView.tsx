import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';

import { User, ICompanyByUser } from 'stores/user/Reducer';
import { getCompanyDetails } from 'stores/company/Actions';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';

import CompanyIcon from './../../resources/images/CompanyIcon.svg';

import { Loading } from 'components/Loading';

interface CompanyListViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}
interface CompanyListViewInternalProps extends CompanyListViewProps {
  currentCompany: string;
  companies: ICompanyByUser[];
  user: User;
  getCompanyDetails: (companyName: string) => void;
  getAllCompaniesByUserId: (userId: string) => void;
  isCompanyLoading: boolean;
  gettingCompanyDetails: boolean;
  errorOnGettingCompanyDetails: string;
}

export const ListViewComponent = (
  props: CompanyListViewInternalProps,
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [gettingDetails, setGettingDetails] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const handleClick = (name: string) => {
    dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
    props.getCompanyDetails(name);
    setCompanyName(name);
    setGettingDetails(true);
  };

  useEffect(() => {
    props.getAllCompaniesByUserId(props.user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.isCompanyLoading === false) {
      setLoading(false);
    }
  }, [props.isCompanyLoading]);

  useEffect(() => {
    if (
      gettingDetails === true &&
      props.gettingCompanyDetails === false &&
      props.errorOnGettingCompanyDetails === '' &&
      !!companyName
    ) {
      dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
      setGettingDetails(false);
      history.push(`/company/${companyName}/dashboard`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyName,
    gettingDetails,
    props.gettingCompanyDetails,
    props.errorOnGettingCompanyDetails,
  ]);

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
                  key={c.company._id}
                  // tslint:disable-next-line: max-line-length
                  className={`dt w-100 ${
                    props.currentCompany === c.company._id
                      ? 'bg-black-10'
                      : ''
                  } mt2 mr1 pointer bp3-popover-dismiss`}
                  onClick={() => handleClick(c.company.uniqueName)}
                >
                  <div className="flex justify-between hover-bg-black-10 pa2 ma1">
                    <img
                      src={
                        c.company.logo ? c.company.logo : CompanyIcon
                      }
                      className="v-mid dib w-10 br2"
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
        ) : (
          <p>{t('app.homepage.No-Companies')}</p>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
    isCompanyLoading: state.companyReducer.loading,
    gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
    errorOnGettingCompanyDetails:
      state.companyReducer.errorOnGettingCompanyDetails,
  };
};

export const CompanyListView = connect(mapStateToProps, {
  getCompanyDetails,
  getAllCompaniesByUserId,
})(ListViewComponent);
