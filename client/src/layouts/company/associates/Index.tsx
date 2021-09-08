import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';

import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';
import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';

import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { companyPermit } from 'stores/UtilsActions';

import Navbar from 'components/navbar/Navbar';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';

interface AssociatesPageProps {
  user: User;
  company: ICompany;
  subscriptiontExpired: boolean;
}

const AssociatesPageComponent = (props: AssociatesPageProps) => {
  const { t } = useTranslation();

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

  return (
    <>
      {isMobileOnly && <Navbar type="company" />}
      <div className="ph4 w-100">
        <Tabs id="associatesTab" className="mt5 mt0-ns">
          <Tab
            id="associates"
            title={t('app.company.Partners.Partners')}
            panel={<AssociateList />}
            className="outline-0"
          />
          {companyPermit(
            props.company.role,
            'addAcceptRejectAssociate',
          ) && (
            <Tab
              id="pending_associates"
              title={t('app.company.Partners.Pending-partners')}
              panel={<PendingAssociateList />}
              className="outline-0"
            />
          )}
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

export default AssociatesPage;
