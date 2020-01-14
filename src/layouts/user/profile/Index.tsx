import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import { ExperienceView } from 'layouts/user/profile/ExperienceView';
import { SkillView } from 'layouts/user/profile/SkillView';
import { AboutView } from './AboutView';
import { BasicInfoDetailsView } from './BasicInfoDetailsView';
import { ImageUploadView } from './ImageUploadView';

export const LandingPage = () => {

  return (
    <>
      <div className="cf w-100">
        <h1 className="f4 tigrow-lightGray-1 ml4 tigrow-lightGray-1 mb0">Profile</h1>
        <div className="mt1">
          <div className="fl-l flex-m w-25-l w-100-m ph3">
            <ImageUploadView />
            <AboutView />
            <SkillView />
          </div>
          <div className="fl-l mh4-m  w-70-l w-90-m mt3-l">
            <ExperienceView />
            <div className="mt3 mb4 shadow-4">
              <BasicInfoDetailsView/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

