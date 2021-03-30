import React from 'react';

const UserInput = ({ color }) => {
  return (
    <div className="start-today-input-group flex items-center justify-center w-100">
      <input
        type="email"
        name="email"
        id="useremail"
        placeholder="Your email address"
        className="h-100 tc"
      />
      <button className="h-100" style={{ color }}>
        Get an Invite!
      </button>
    </div>
  );
};

export default UserInput;
