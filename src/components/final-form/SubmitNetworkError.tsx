import * as React from 'react';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

export const SubmitNetworkError = () => (
  <div>
    {/* {props.errorMessage && */}
    <div
      className="flex"
      style={{
        backgroundColor: '#D85858',
        paddingLeft: '10px',
        paddingTop: '10px'
      }}
    >
      <p style={{ color: '#ffffff', paddingLeft: '10px' }}>Network Error. Please check your internet connection</p>
      <div className="flex justify-end">
      <Icon
          style={{ backgroundColor: '#D85858', color: '#ffffff' }}
          icon={IconNames.REFRESH}
          iconSize={20}
          className="grow pointer pl2 pr2"
        />
        <Icon
          style={{ backgroundColor: '#D85858', color: '#ffffff' }}
          icon={IconNames.DELETE}
          iconSize={20}
          className="grow pointer pl2 pr2"
        />
      </div>
    </div>
    {/* } */}
  </div>
);