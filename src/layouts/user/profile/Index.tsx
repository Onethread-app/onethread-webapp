import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import { ExperienceView } from 'layouts/user/profile/ExperienceView';
import { SkillView } from 'layouts/user/profile/SkillView';
import { AboutView } from './AboutView';
import { BasicInfoDetailsView } from './BasicInfoDetailsView';
import { Tabs, Tab } from '@blueprintjs/core';
import { User } from 'stores/user/Reducer';
import { CoverPhotoView } from './CoverPhotoView';

export const LandingPage = (props: { user: User }) => {

  return (
    <>
      <div className="w-100 bg-white ph4">
        <CoverPhotoView />
        <div className="w-100 relative">
          <div className="flex-l w-100 mt6 ph4">
            <div className="mt3 ph1 w-15-l w-100"
              style={{ minWidth: '235px' }}
            >
              <div className="h-auto ma1">
                <AboutView />
              </div>
              <div className="h-auto ma1 mv1">
                <SkillView />
              </div>
            </div>
            <div className="w-85-l w-100 mt4 ml5-tigrow-l ph2-m mb5-l mb4-m"
            >
              <Tabs
                id="TabsExample"
              >
                <Tab
                  id="Experience"
                  title="Experience"
                  panel={<ExperienceView />}
                  className="h-auto outline-0 f5 fw6"
                />
                <Tab
                  id="Basic Information"
                  title="Basic Information"
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
