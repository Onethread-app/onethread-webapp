import React from 'react';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { CoverPhoto } from 'components/cover-photo/CoverPhoto';
import { Tabs, Tab } from '@blueprintjs/core';
import { AdvancedInfo } from './AdvancedInfoView';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { NavbarCompany } from 'components/NavbarCompany';
import { ICompany } from 'stores/company/Reducer';
import { useTranslation } from 'react-i18next';

interface ProfilePageProps {
  user: User;
  company: ICompany;
  subscriptiontExpired: boolean;
}

const CompanyProfilePageComponent = (props: ProfilePageProps) => {
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
      <NavbarCompany title={t('app.company.Company-profile.Company-profile')} />
      {/* <NavbarCompany title="Company Profile" /> */}
      <div className="w-100 pa4-ns pa2 mt5 mt0-ns">
        <CoverPhoto type="company"/>
        <Tabs id="TabsExample" className="mt6-ns mt5 ph5-ns ph3">
          <Tab
            id="basic_info"
            title={t('app.company.Company-profile.Basic')}
            // title="Basic Information"
            panel={<BasicInfoDetailsView />}
            className="outline-0"
          />
          <Tab
            id="advance_info"
            title={t('app.company.Company-profile.Advanced')}
            // title="Advanced Information"
            panel={<AdvancedInfo />}
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

export const CompanyProfilePage = connect(
  mapStateToProps,
  null,
)(CompanyProfilePageComponent);
