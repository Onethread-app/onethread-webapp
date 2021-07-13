import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import Navbar from 'components/navbar/Navbar';
import { ICompany } from 'stores/company/Reducer';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';

interface AssociatesPageProps {
  user: User;
  company: ICompany;
  subscriptiontExpired: boolean;
}

const AssociatesPageComponent = (props: AssociatesPageProps) => {
  React.useEffect(() => {
    if (props.subscriptiontExpired) {
      props.company.role === 'superAdmin'
        ? window.location.replace(
            `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
          )
        : window.location.replace(
            `${window.location.origin}/${props.user.name}/home`,
          );
    }
  }, []);

  const { t } = useTranslation();

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div className="ph4 w-100">
        <Tabs id="associatesTab" className="mt5 mt0-ns">
          <Tab
            id="associates"
            title={t('app.company.Partners.Partners')}
            // title="Partners"
            panel={<AssociateList />}
            className="outline-0"
          />
          <Tab
            id="pending_associates"
            title={t('app.company.Partners.Pending-partners')}
            // title="Pending Partners"
            panel={<PendingAssociateList />}
            className="outline-0"
          />
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    company: state.companyReducer.currentCompany,
  };
};

export const AssociatesPage = connect(
  mapStateToProps,
  null,
)(AssociatesPageComponent);
