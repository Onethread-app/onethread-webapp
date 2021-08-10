import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import { ExperienceView } from 'layouts/user/profile/ExperienceView';
import { SkillView } from 'layouts/user/profile/SkillView';
import { AboutView } from './AboutView';
import { BasicInfoDetailsView } from './BasicInfoDetailsView';
import { Tabs, Tab } from '@blueprintjs/core';
import { User } from 'stores/user/Reducer';
import { CoverPhoto } from 'components/cover-photo/CoverPhoto';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UserProfilePageProps {
  user: User;
  subscriptiontExpired: boolean;
}

const _UserProfilePage = (
  props: UserProfilePageProps & RouteComponentProps,
) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="w-100 bg-white ph4-ns ph2"
        style={{ marginTop: '3.2rem' }}
      >
        <CoverPhoto type="user" />
        <div className="w-100 relative">
          <div className="flex-l w-100 mt5-ns mt4 ph4-ns ph3">
            <div
              className="mt3 ph1 w-15-l w-100"
              style={{ minWidth: '235px' }}
            >
              <div className="h-auto">
                <AboutView />
              </div>
              <div className="h-auto mv4">
                <SkillView />
              </div>
            </div>
            <div className="w-85-l w-100 mt4 ml5-tigrow-l ph2-m mb6">
              <Tabs id="TabsExample" className="w-85-ns">
                <Tab
                  id="Experience"
                  title={t('app.user.Personal-profile.Experience')}
                  // title="Experience"
                  panel={<ExperienceView />}
                  className="h-auto outline-0 f5 fw6"
                />
                <Tab
                  id="Basic Information"
                  title={t('app.user.Personal-profile.Basic-info')}
                  // title="Basic Information"
                  panel={<BasicInfoDetailsView />}
                  className="outline-0 h-auto f5 fw6"
                />
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
  };
};
export const UserProfilePage = connect(
  mapStateToProps,
  {},
)(withRouter(_UserProfilePage));

export default UserProfilePage;
