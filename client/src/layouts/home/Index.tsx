import React from 'react';

import VideoConference from 'components/home/VideoConference';
import Tasks from 'components/home/Tasks';
import Profile from 'components/home/Profile';
import Weather from 'components/home/Weather';
import ProfileProgress from 'components/home/ProfileProgress';
import OngoingTasks from 'components/home/OngoingTasks';

import './Index.styles.scss';

const index = () => {
  return (
    <div className="home-container">
      <div>
        <VideoConference />
        <OngoingTasks />
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
