import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import {
//   sortProjectsByDeadline,
//   sortProjectsByStatus,
//   sortProjectsByTasksRemaining,
// } from 'helpers/utils';
// import { Typography } from '@material-ui/core';
// import ProjectItem from './ProjectItem';
import './ProjectStatus.scss';
import TasksTable from './TasksTable';

interface IProjectStatus {
  tasks: any;
}

const ProjectStatus = (props: IProjectStatus) => {
  const [tasksToShow, setTasksToShow] = useState<any>();
  const { t } = useTranslation();

  useEffect(() => {
    setTasksToShow(props.tasks);
  }, [props.tasks]);

  // const handleSortByDeadline = () => {
  //   sortProjectsByDeadline(props.projects);
  // };
  // const handleSortByStatus = () => {
  //   sortProjectsByStatus(props.projects);
  // };
  // const handleSortByTasksRemaining = () => {
  //   sortProjectsByTasksRemaining(props.projects);
  // };

  return (
    <div className="project-status mb5">
      <div className="flex justify-between mb3">
        <h3 className="f3-ns f5" style={{ color: '#3484F0' }}>
          {t('app.company.Dashboard.Project-status')}
        </h3>
        {/* <div className="sort flex items-center pv2 ph3">
          <p>
            Sort By{' '}
            <span className="pointer" onClick={handleSortByDeadline}>
              Deadline
            </span>
          </p>
          <p>
            Sort By{' '}
            <span className="pointer" onClick={handleSortByStatus}>
              Status
            </span>
          </p>
          <p>
            Sort By{' '}
            <span
              className="pointer"
              onClick={handleSortByTasksRemaining}
            >
              Task Remaining
            </span>
          </p>
        </div> */}
      </div>
      <div className="projects-list w-100">
        <TasksTable tasks={tasksToShow} />
        {/* <div className="projects-list-header flex w-100">
          <div className="projects-list-header-no">
            <h3 className="f5-ns f6 fw7">No.</h3>
          </div>
          <div className="projects-list-header-name">
            <h3 className="f5-ns f6 fw7">Name</h3>
          </div>
          <div className="projects-list-header-members">
            <h3 className="f5-ns f6 fw7">Members</h3>
          </div>
          <div className="projects-list-header-status">
            <h3 className="f5-ns f6 fw7">Status</h3>
          </div>
          <div className="projects-list-header-deadline">
            <h3 className="f5-ns f6 fw7">Deadline</h3>
          </div>
          <div className="projects-list-header-task">
            <h3 className="f5-ns f6 fw7">Task Remaining</h3>
          </div>
        </div>
        <div className="projects-list-items w-100">
          {projectsToShow ? (
            projectsToShow.map((project: any, index: number) => (
              <ProjectItem
                project={project}
                index={index}
                key={index}
              />
            ))
          ) : (
            <Typography>No Projects</Typography>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ProjectStatus;
