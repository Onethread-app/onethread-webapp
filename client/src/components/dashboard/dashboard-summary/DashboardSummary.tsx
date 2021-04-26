import React from 'react';
import './DashboardSummary.scss';
import DashboardChart from '../dashboard-chart/DashboardChart';
const primaryColor = {
  color: '#3484F0',
};

const fontColor = {
  color: '#656565',
};

export const DashboardSummary = (props) => {
  const [runningProjectsVal, setRunningProjectVal] = React.useState(
    0,
  );
  const [
    completedProjectsVal,
    setCompletedProjectsVal,
  ] = React.useState(0);

  const { projectCompilation } = props.stat;
  React.useEffect(() => {
    if (projectCompilation) {
      const projectStats = projectCompilation.map((project) => {
        return (
          project.taskNumbers > 0 &&
          project.taskNumbers === project.doneTask
        );
      });

      const totalCompletedProjects = projectStats.reduce(
        (acc, cur) => {
          if (cur === true) {
            acc += 1;
          }
          return acc;
        },
        0,
      );

      setCompletedProjectsVal(totalCompletedProjects);

      const totalRunningProjects =
        projectStats.length - totalCompletedProjects;

      setRunningProjectVal(totalRunningProjects);
    }
  }, [projectCompilation]);

  const runningProjects = runningProjectsVal;
  const completedProjects = completedProjectsVal;

  return (
    <div className="flex flex-row-ns flex-column">
      <div className="w-30-l w-100 b--black-05 br-l bn bw1 summary-wrapper">
        <div className="w-100-ns w-50 ma4-ns ma3 inline-items">
          <div className="mr0-ns mr2">
            <img
              src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/revision.svg"
              alt="revision"
            />
          </div>
          <h3
            className="w-50-ns w-100 f5-ns f7 fw7 midWidth flex items-center"
            style={fontColor}
          >
            <div className="flex flex-column">
              <span>Running</span>
              <span>Projects</span>
            </div>
            <span className="fr f2-ns f3 pl3" style={primaryColor}>
              {runningProjects}
            </span>
          </h3>
        </div>
        <div className="w-100-ns w-50 ma4-ns ma3 inline-items">
          <div className="mr0-ns mr2">
            <img
              src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/completed.svg"
              alt="completed"
            />
          </div>
          <h3
            className="w-50-ns w-100 f5-ns f7 fw7 midWidth flex items-center"
            style={fontColor}
          >
            <div className="flex flex-column">
              <span>Completed</span>
              <span>Projects</span>
            </div>
            <span className="fr f2-ns f3 pl3" style={primaryColor}>
              {completedProjects}
            </span>
          </h3>
        </div>
      </div>
      <div className="w-70-l w-100 chart-height-mobile">
        <DashboardChart
          runningProjects={runningProjects}
          completedProjects={completedProjects}
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
