import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Icon, Dialog, Button } from '@blueprintjs/core';
import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { CompanySignupForm } from 'layouts/company/Form';
import { isMobileOnly } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { getNotifications } from '../../stores/notifications/Action';
import { getCompanyDetails } from 'stores/company/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import { addSpace } from 'stores/UtilsActions';
import company from './../../resources/images/noCompany.png';

interface CompanyListProps {
  currentCompany: string;
  getNotifications: () => void;
  getCompanyDetails: (companyId: string, history: History) => void;
  user: User;
}

export const CompanyListComponent = (
  props: CompanyListProps & RouteComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="pa4-ns pa2">
        {props.user.companies && props.user.companies.length > 0 ? (
          <>
            <h1 className="f3-ns f5 white pt4">Places You Work</h1>
            <div className="flex">
              <div
                className="overflow-x-auto w-85 pv1 justify-start"
                style={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                }}
              >
                <>
                  {props.user.companies.map((c) => (
                    <article
                      className={`ma2-ns ma1 pointer ${
                        props.currentCompany === c.company._id
                          ? 'bg-black-20'
                          : ''
                      }`}
                      style={{
                        width: isMobileOnly ? '160px' : '245px',
                      }}
                      key={c.company._id}
                      onClick={async () => {
                        props.getNotifications();
                        await props.getCompanyDetails(
                          c.company.uniqueName,
                          props.history,
                        );
                      }}
                    >
                      <div
                        className="bg-white pt3 tc"
                        style={{
                          height: isMobileOnly ? '5.5rem' : '8rem',
                        }}
                      >
                        <img
                          className="br-100"
                          src={
                            c.company.logo
                              ? c.company.logo
                              : CompanyIcon
                          }
                          alt="user"
                          style={{
                            width: isMobileOnly ? '60px' : '80px',
                            height: isMobileOnly ? '60px' : '80px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div className="tc">
                        <h1 className="f6 f5-ns lh-title white ws-break">
                          {c.company.name}{' '}
                        </h1>
                        <h2 className="f6-ns f7 fw4 mt0 mb0 white ws-break">{`Role: ${addSpace(
                          c.role,
                        )}`}</h2>
                      </div>
                    </article>
                  ))}
                </>
              </div>
              <div className="flex flex-column">
                <div
                  className="pointer tc b--dotted b--light-gray ml4-ns ml2 w-15 pt3 pt0-ns"
                  style={{
                    width: isMobileOnly ? '110px' : '215px',
                    marginTop: '13px',
                    height: isMobileOnly ? '5rem' : '8rem',
                  }}
                  onClick={() => setShowDialog(!showDialog)}
                >
                  <Icon
                    icon="plus"
                    iconSize={isMobileOnly ? 25 : 60}
                    color="white"
                  />
                  <h1 className="f6-ns f7 white db-ns dn">
                    Create a Company
                  </h1>
                </div>
                <h1 className="ml2 f7 white db dn-ns">
                  Create a Company
                </h1>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-ns ph6-ns w-100">
            <div className="w-40-ns db-ns dn">
              <img src={company} alt="company" />
            </div>
            <article className="w-60-ns w-100 pa3 pa0-ns">
              <h1 className="white f2-ns f3 fw6">
                Add a company to get started with all of your projects
              </h1>
              <h3 className="white fw3 f4-ns f5">
                Or, want to join an existing company? Ask your peer to
                add you at his/her company at Onethread
              </h3>
              <Button
                onClick={() => setShowDialog(!showDialog)}
                className="pa3-ns pa2 f5-ns fw6 br2"
                style={{ color: '#0F0C4E' }}
              >
                Create Company
              </Button>
            </article>
          </div>
        )}
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
  };
};

export const CompanyList = connect(mapStateToProps, {
  getNotifications,
  getCompanyDetails,
})(withRouter(CompanyListComponent));
