import React from 'react';
import './SuspenseLoader.styles.scss';

const SuspenseLoader = () => {
  return (
    <div
      className="w-100 flex items-center justify-center"
      style={{
        height: '100vh',
      }}
    >
      <div className="lds-grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SuspenseLoader;
