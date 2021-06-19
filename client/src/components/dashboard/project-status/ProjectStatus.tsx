import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './ProjectStatus.scss';

const fontColor = {
  color: '#656565',
};

const ProjectStatus = (props) => {
  const history = useHistory();
  return (
    <div
      className="project-status-content mb2 pointer"
      onClick={() =>
        history.push(
          `/company/${props.uniqueCompanyName}/project/${props.projectId}/overview`,
        )
      }
    >
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

const mapStateToProps = (state: any) => ({
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
});

export default connect(mapStateToProps, {})(ProjectStatus);
