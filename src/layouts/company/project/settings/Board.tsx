import React from 'react';
import { connect } from 'react-redux';

const BoardPageComponent = () => (
  <div className="bl b--black-05 bw1 pl5 ml5 h5">
    <p>board</p>
  </div>
);

export const BoardPage = connect(null, null)(BoardPageComponent);