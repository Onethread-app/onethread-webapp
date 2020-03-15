import React from 'react';
import { connect } from 'react-redux';

const PrefacePageComponent = () => (
  <div className="bl b--black-05 bw1 pl5 ml5 h5">
    <p>project preface</p>
  </div>
);

export const PrefacePage = connect(null, null)(PrefacePageComponent);