import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import VideoConference from 'components/home/VideoConference';
import Tasks from 'components/home/Tasks';
import Profile from 'components/home/Profile';
import Weather from 'components/home/Weather';
import ProfileProgress from 'components/home/ProfileProgress';
import DueTasks from 'components/home/DueTasks';
import Projects from 'components/home/Projects';

import './Index.styles.scss';

const index = () => {
  return isMobileOnly ? (
    <div className="home-container">
      <div>
        <Tasks />
      </div>
      <div>
        <DueTasks />
      </div>
      <div>
        <ProfileProgress />
      </div>
      <div>
        <VideoConference />
      </div>
    </div>
  ) : (
    <div className="home-container">
      <div>
        <Projects />
        <DueTasks />
        <VideoConference />
      </div>
      <div>
        <Weather />
        <Tasks />
      </div>
      <div>
        <Profile />
        <ProfileProgress />
      </div>
    </div>
  );
};

export default index;
