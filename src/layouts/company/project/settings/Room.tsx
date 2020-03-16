import React from 'react';
import { connect } from 'react-redux';

const RoomPageComponent = () => (
  <div className="bl b--black-05 bw1 pl5 ml5 h5">
    <p>room</p>
  </div>
);

export const RoomPage = connect(null, null)(RoomPageComponent);