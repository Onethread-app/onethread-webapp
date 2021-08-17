import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import VideoConference from 'components/home/VideoConference';
import Tasks from 'components/home/Tasks';
import Profile from 'components/home/Profile';
// import Weather from 'components/home/Weather';
// import ProfileProgress from 'components/home/ProfileProgress';
import Projects from 'components/home/Projects';

import './Index.styles.scss';
import Subtasks from 'components/home/Subtasks';

const index = () => {
  return isMobileOnly ? (
    <div className="home-container">
      <div>
        <Tasks />
      </div>
      <div>
        <Subtasks />
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <VideoConference />
      </div>
      {/* <div>
        <ProfileProgress />
      </div> */}
    </div>
  ) : (
    <div className="home-container">
      <div>
        <Projects />
        <VideoConference />
      </div>
      <div>
        {/* <Weather /> */}
        <Tasks />
        <Subtasks />
      </div>
      <div>
        <Profile />
        {/* <ProfileProgress /> */}
      </div>
    </div>
  );
};

export default index;
