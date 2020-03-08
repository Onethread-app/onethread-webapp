import React from 'react';
import { connect } from 'react-redux';

const GeneralPageComponent = () => (
  <div className="bl b--black-05 bw1 pl5 ml5 h5">
    <p>general</p>
  </div>
);

export const GeneralPage = connect(null, null)(GeneralPageComponent);