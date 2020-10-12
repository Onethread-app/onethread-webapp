import React from 'react';
import './ProjectStatus.scss';

const fontColor = {
  color: '#656565',
};

const ProjectStatus = (props) => {
  return (
    <div className="project-status-content mb2">
      <div className="content-wrapper flex justify-between mb3">
        <div style={fontColor} className="f5 f6 fw6">
          {props.content}
        </div>
        <div style={fontColor} className="f5 f7">
          Task Remaining
          <span className="ml4">
            {props.remaining}/{props.total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
