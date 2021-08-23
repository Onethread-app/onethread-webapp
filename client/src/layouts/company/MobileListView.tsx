import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getCompanyDetails } from 'stores/company/Actions';
import { History } from 'history';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { User, ICompanyByUser } from 'stores/user/Reducer';
import { Loading } from 'components/Loading';
import { getNotifications } from '../../stores/notifications/Action';

import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { Dialog, Button, Icon } from '@blueprintjs/core';
import { CompanySignupForm } from './Form';
import user from './../../resources/images/profilePhoto.svg';
import { NavLink } from 'react-router-dom';
import { logoutAction } from 'stores/auth/Actions';
import { useTranslation } from 'react-i18next';
import ReportForm from '../../components/ReportForm';
import { CLEAR_COMPANY_REDUCER_STATE } from 'stores/company/Types';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';

interface CompanyListViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}
interface CompanyListViewInternalProps extends CompanyListViewProps {
  currentCompany: string;
  companies: ICompanyByUser[];
  user: User;
  getCompanyDetails: (companyId: string) => void;
  getAllCompaniesByUserId: (userId: string) => void;
  getNotifications: (companyId: string) => void;
  logoutAction: (history: History) => void;
  gettingCompanyDetails: boolean;
  errorOnGettingCompanyDetails: string;
}

export const ListViewComponent = (
  props: CompanyListViewInternalProps,
) => {
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showButtonReport, setShowButtonReport] = useState(false);
  const [gettingDetails, setGettingDetails] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (loading === true) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
      props.setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyName,
    gettingDetails,
    props.gettingCompanyDetails,
    props.errorOnGettingCompanyDetails,
  ]);

  const handleClick = (name: string) => {
    dispatch({ type: CLEAR_COMPANY_REDUCER_STATE });
    props.getCompanyDetails(name);
    setCompanyName(name);
    setGettingDetails(true);
  };

  return (
    <>
      <div>
        <div style={{ backgroundColor: '#34b3e9' }}>
          <Icon
            icon="delete"
            iconSize={20}
            className="white ma3 fr"
            onClick={() => props.setShowDialog(false)}
          />
          <Button
            className="bp3-minimal outline-0 bp3-popover-dismiss mt5"
            onClick={() => {
              history.push(`/${props.user.name}`);
              props.setShowDialog(false);
            }}
          >
            <div className="dtc w2">
              <img
                src={
                  props.user.profileImage
                    ? props.user.profileImage
                    : user
                }
                className="db w2 h2 br-100 ba b--white-90 "
                alt=""
              />
            </div>
            <div className="dtc v-mid pl3 pt2">
              <h1 className="f6 white ma0">
                {`${props.user.firstName} ${props.user.lastName}`}
              </h1>
              <h1 className="f7 white ma0 fw4 mb4">
                {props.user.position}
              </h1>
            </div>
          </Button>
        </div>
        <NavLink
          exact
          className="w-100 flex items-center nowrap ma2 hover-bg-black-10 pa2"
          activeStyle={{ background: '#34b3e9', color: 'white' }}
          style={{ color: 'black' }}
          to={`/${props.user.name}/settings`}
          onClick={() => props.setShowDialog(false)}
        >
          <Icon
            icon="cog"
            className="pr3"
            style={{ color: '#787e8d' }}
          />
          {t('app.user.User-settings.Profile')}
        </NavLink>
        <NavLink
          exact
          className="w-100 flex items-center nowrap ma2 hover-bg-black-10 pa2"
          activeStyle={{ background: '#34b3e9', color: 'white' }}
          style={{ color: 'black' }}
          to={`/${props.user.name}/home`}
          onClick={() => props.setShowDialog(false)}
        >
          <Icon
            icon="home"
            className="pr3"
            style={{ color: '#787e8d' }}
          />
          {t('app.user.User-settings.Home')}
        </NavLink>
        <Button
          className="bp3-minimal outline-0 bp3-popover-dismiss ma2 w-100"
          onClick={(e: any) => setShowButtonReport(true)}
          icon="issue"
          alignText="left"
        >
          {t('app.user.User-settings.Report-Issue')}
        </Button>
        <Button
          className="bp3-minimal outline-0 bp3-popover-dismiss ma2 w-100"
          onClick={(e: any) => props.logoutAction(history)}
          icon="log-in"
          alignText="left"
        >
          {t('app.user.User-settings.Logout')}
        </Button>
        <h1 className="f7 ml3">{t('app.homepage.My-Companies')}</h1>
        <div
          className="mw6 center overflow-y-auto pl2"
          style={{ maxHeight: '18rem' }}
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
                    className={`dt w-100 hover-bg-black-10 pa1 ${
                      props.currentCompany === c.company._id
                        ? 'bg-black-10'
                        : ''
                    } mt1 pointer bp3-popover-dismiss`}
                    onClick={() => handleClick(c.company.uniqueName)}
                  >
                    <div className="flex justify-between">
                      <img
                        src={
                          c.company.logo
                            ? c.company.logo
                            : CompanyIcon
                        }
                        className="v-mid dib br-100 w-10"
                        alt="user"
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                        }}
                      />
                      <div className="dtc v-mid pl3 w-90">
                        <h1 className="f7 f6-ns fw4 lh-title black mv0 ws-break">
                          {c.company.name}{' '}
                        </h1>
                        <h2 className="f6 fw3 mt0 mb0 black-60 ws-break">{`Role: ${c.role}`}</h2>
                      </div>
                    </div>
                  </article>
                ),
            )
          ) : (
            <p>{t('app.homepage.No-Companies')}</p>
          )}
        </div>
        <button
          onClick={() => {
            setShowButton(true);
            // props.setShowDialog(!props.showDialog);
          }}
          className="b--blue w-90 grow pointer pv2 blue outline-0 mt4 ml3 bp3-minimal bg-white "
        >
          {t('app.forms.Create-company.Create')}
          {/* Create Company */}
        </button>
      </div>
      {showButton && (
        <Dialog
          onClose={() => setShowButton(!showButton)}
          isOpen={showButton}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={props.setShowDialog} />
          </div>
        </Dialog>
      )}
      {showButtonReport && (
        <Dialog
          onClose={() => setShowButtonReport(!showButtonReport)}
          isOpen={showButtonReport}
          style={{
            background: '#fff',
            marginLeft: '0.5rem',
            marginRight: '0.5rem',
          }}
          canOutsideClickClose={false}
        >
          <div>
            <ReportForm setShowButtonReport={setShowButtonReport} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
    gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
    errorOnGettingCompanyDetails:
      state.companyReducer.errorOnGettingCompanyDetails,
  };
};

export const MobileListView = connect(mapStateToProps, {
  logoutAction,
  getCompanyDetails,
  getAllCompaniesByUserId,
  getNotifications,
})(ListViewComponent);
