import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { getCompanyDetails } from 'stores/company/Actions';
import { History } from 'history';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { User, ICompanyByUser } from 'stores/user/Reducer';
import { Loading } from 'components/Loading';
import { getNotifications } from '../../stores/notifications/Action';

import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import { Dialog, Button, Icon } from '@blueprintjs/core';
import { CompanySignupForm } from './Form';
import user from './../../resources/images/profilePhoto.svg';
import { NavLink } from 'react-router-dom';
import { logoutAction } from 'stores/auth/Actions';

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
  getNotifications: (companyId: string) => void;
  logoutAction: (history: History) => void;
}

export const ListViewComponent = (
  props: CompanyListViewInternalProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading === true) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    setLoading(false);
  }, [loading]);

  return (
    <>
      <div>
        <div style={{ backgroundColor: '#3F61C5' }}>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d06346b0... code style issue fixed
          <Icon
            icon="delete"
            iconSize={20}
            className="white ma3 fr"
<<<<<<< HEAD
=======
          <Icon icon="delete" iconSize={20} className="white ma3 fr"
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> d06346b0... code style issue fixed
            onClick={() => props.setShowDialog(false)}
          />
          <Button
            className="bp3-minimal outline-0 bp3-popover-dismiss mt5"
            onClick={() => {
              props.history.push(`/${props.user.name}`);
              props.setShowDialog(false);
<<<<<<< HEAD
<<<<<<< HEAD
            }}
=======
            }
            }
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
            }}
>>>>>>> d06346b0... code style issue fixed
          >
            <div className="dtc w2">
              <img
                src={
                  props.user.profileImage
                    ? props.user.profileImage
                    : user
                }
                className="db w2 h2 br-100 ba b--white-90 "
              />
            </div>
<<<<<<< HEAD
            <div className="dtc v-mid pl3 pt2">
=======
            <div className="dtc v-mid pl3">
>>>>>>> b9e80fb9... mobile responsive for project preface
              <h1 className="f6 white ma0">
                {`${props.user.firstName} ${props.user.lastName}`}
              </h1>
              <h1 className="f7 white ma0 fw4 mb4">
<<<<<<< HEAD
<<<<<<< HEAD
                {props.user.position}
=======
                {props.user.position} 
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
                {props.user.position}
>>>>>>> d06346b0... code style issue fixed
              </h1>
            </div>
          </Button>
        </div>
        <NavLink
          exact
          className="w-100 flex items-center nowrap ma2 hover-bg-black-10 pa2"
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'black' }}
          to={`/${props.user.name}/settings`}
          onClick={() => props.setShowDialog(false)}
        >
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d06346b0... code style issue fixed
          <Icon
            icon="cog"
            className="pr3"
            style={{ color: '#787e8d' }}
          />
          Profile Settings
<<<<<<< HEAD
        </NavLink>
        <NavLink
          exact
          className="w-100 flex items-center nowrap ma2 hover-bg-black-10 pa2"
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'black' }}
          to={`/${props.user.name}/home`}
          onClick={() => props.setShowDialog(false)}
        >
          <Icon
            icon="home"
            className="pr3"
            style={{ color: '#787e8d' }}
          />
          Home
        </NavLink>
        <Button
          className="bp3-minimal outline-0 bp3-popover-dismiss ma2 w-100"
          onClick={(e: any) => props.logoutAction(props.history)}
=======
          <Icon icon="cog" className="pr3" style={{ color: '#787e8d' }} />
            Profile Settings
        </NavLink>
        <Button
          className="bp3-minimal outline-0 bp3-popover-dismiss ma2 w-100"
          onClick={(e: any) =>
            props.logoutAction(props.history)
          }
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
        </NavLink>
        <Button
          className="bp3-minimal outline-0 bp3-popover-dismiss ma2 w-100"
          onClick={(e: any) => props.logoutAction(props.history)}
>>>>>>> d06346b0... code style issue fixed
          icon="log-in"
          alignText="left"
        >
          Logout
        </Button>
        <h1 className="f7 ml3">My Companies</h1>
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
<<<<<<< HEAD
<<<<<<< HEAD
                    } mt1 pointer bp3-popover-dismiss`}
=======
                      } mt1 pointer bp3-popover-dismiss`}
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
                    } mt1 pointer bp3-popover-dismiss`}
>>>>>>> d06346b0... code style issue fixed
                    onClick={async () => {
                      props.getNotifications(c.company._id);
                      const response = (await props.getCompanyDetails(
                        c.company.name,
                        props.history,
                      )) as any;
                      if (response.status === 200) {
<<<<<<< HEAD
<<<<<<< HEAD
                        dispatch({
                          type: CLEAR_PROJECT_REDUCER_STATE,
                        });
                        props.history.push(
                          `/company/${
                            (response as any).data.company.name
=======
                        dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
                        props.history.push(
                          `/company/${
                          (response as any).data.company.name
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
                        dispatch({
                          type: CLEAR_PROJECT_REDUCER_STATE,
                        });
                        props.history.push(
                          `/company/${
                            (response as any).data.company.name
>>>>>>> d06346b0... code style issue fixed
                          }/dashboard`,
                        );
                      }
                    }}
                  >
<<<<<<< HEAD
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
=======
                    <img
                      src={
                        c.company.logo ? c.company.logo : CompanyIcon
                      }
                      className="v-mid dib br-100"
                      alt="user"
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="dtc v-mid pl3">
                      <h1 className="f7 f6-ns fw4 lh-title black mv0 ws-break">
                        {c.company.name}{' '}
                      </h1>
                      <h2 className="f6 fw3 mt0 mb0 black-60 ws-break">{`Role: ${c.role}`}</h2>
>>>>>>> b9e80fb9... mobile responsive for project preface
                    </div>
                  </article>
                ),
            )
          ) : undefined}
        </div>
        <button
          onClick={() => {
            setShowButton(true);
            // props.setShowDialog(!props.showDialog);
<<<<<<< HEAD
<<<<<<< HEAD
          }}
          className="b--blue w-90 grow pointer pv2 blue outline-0 mt4 ml3 bp3-minimal bg-white "
        >
          Create Company
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
=======
          }
          }
=======
          }}
>>>>>>> d06346b0... code style issue fixed
          className="b--blue w-90 grow pointer pv2 blue outline-0 mt4 ml3 bp3-minimal bg-white "
        >
          Create Company
        </button>
      </div>
<<<<<<< HEAD
      {
        showButton && (
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
        )
      }
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
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
>>>>>>> d06346b0... code style issue fixed
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
  };
};

export const MobileListView = connect(mapStateToProps, {
  logoutAction,
  getCompanyDetails,
  getAllCompaniesByUserId,
  getNotifications,
})(withRouter(ListViewComponent));
