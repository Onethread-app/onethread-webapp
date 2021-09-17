import React from 'react';

import teamLight from 'resources/images/sidebarTeam-light.svg';
import associatesLight from 'resources/images/sideBarAssociates-light.svg';

import './TotalInfo.scss';

const primaryColor = {
  color: '#3484F0',
};

const fontColor = {
  color: '#656565',
};

export const TotalInfo = (props) => {
  return (
    <div className="w-100 flex flex-column">
      <div className="w-90-ns w-90 ma2 relative inline-align">
        <div className="mr0-ns mr2">
          <img
            src={
              props.type === 'employee'
                ? teamLight
                : props.type === 'associates'
                ? associatesLight
                : undefined
            }
            alt=""
          />
        </div>
        <h3 className="w-30 f5-ns f6 fw7" style={fontColor}>
          {props.content}
          <span
            className="fr f2-ns f3 countPoisition smallPosition"
            style={primaryColor}
          >
            {props.count}
          </span>
        </h3>
      </div>
    </div>
  );
};

export default TotalInfo;
