import * as React from 'react';
import warningIcon from './../../resources/images/warningIcon.png';

export const SubmitError = (props: { errorMessage: string }) => (
  <div>
    {props.errorMessage && (
      <div
        className="flex"
        style={{
          backgroundColor: '#FCEBEB',
          paddingLeft: '10px',
          paddingTop: '10px',
        }}
      >
        <span className="bp3-icon">
          <img
            src={warningIcon}
            width="20px"
            height="20px"
            color="#3F61C5"
          />
        </span>
        <p style={{ color: '#962414', paddingLeft: '10px' }}>
          {props.errorMessage}
        </p>
      </div>
    )}
  </div>
);
