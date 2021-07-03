import React from 'react';

import More from 'resources/svg/More.svg';
import ProfilePic from 'resources/svg/ProfilePic.svg';

const Profile = () => {
  return (
    <div className="profile">
      <div className="flex justify-between w-100">
        <div>
          <h3>My Profile</h3>
          <p>75% Completed</p>
        </div>
        <div>
          <img src={More} alt="more" className="pointer" />
        </div>
      </div>
      <div>
        <img src={ProfilePic} alt="user" />
      </div>
      <div>
        <h3>Saepul Rohman</h3>
        <p>UX Designer at Toglas</p>
      </div>
      <div className="team">Team : 02</div>
    </div>
  );
};

export default Profile;
