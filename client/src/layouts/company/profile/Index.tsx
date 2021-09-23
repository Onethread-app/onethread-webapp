import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';

import Navbar from 'components/navbar/Navbar';
import { CoverPhoto } from 'components/cover-photo/CoverPhoto';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { AdvancedInfo } from './AdvancedInfoView';

interface ProfilePageProps {
  user: User;
  company: ICompany;
  subscriptiontExpired: boolean;
}

const CompanyProfilePageComponent = (props: ProfilePageProps) => {
  const { t } = useTranslation();

  useEffect(() => {
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
      {isMobileOnly && <Navbar type='company' />}
      <div className='w-100 pa4-ns pa2 mt5 mt0-ns'>
        <CoverPhoto type='company' />
        <Tabs id='TabsExample' className='mt6-ns mt5 ph5-ns ph3'>
          <Tab
            id='basic_info'
            title={t('app.company.Company-profile.Basic')}
            panel={<BasicInfoDetailsView />}
            className='outline-0'
          />
          <Tab
            id='advance_info'
            title={t('app.company.Company-profile.Advanced')}
            panel={<AdvancedInfo />}
            className='outline-0'
          />
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  company: state.companyReducer.currentCompany,
});

export const CompanyProfilePage = connect(
  mapStateToProps,
  null,
)(CompanyProfilePageComponent);

export default CompanyProfilePage;
