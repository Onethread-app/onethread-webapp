import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Popover,
  Button,
  Menu,
  MenuItem,
  Icon,
  // InputGroup,
} from '@blueprintjs/core';

import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import addIcon from '../../../resources/images/addIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { FormProject } from './CreateProjectForm';
import { ChangeName } from './ChangeProjectName';
import { find, orderBy } from 'lodash';
import {
  Color,
  unreadMessageNotification,
} from 'stores/UtilsActions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getAllDepartments } from '../../../stores/company/Actions';
import {
  getAllProjects,
  archiveProject,
  unarchiveProject,
  getProjectArchive,
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
} from '../../../stores/project/Actions';
import { getAllAssociates } from 'stores/associate/Actions';
import { projectRules } from './settings/projectrules';

const MyProjectPageComponent = (props: any & RouteComponentProps) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = useState(
    false,
  );
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const permissions = projectRules(props.role, props.optionalRole);

  useEffect(() => {
    async function loadProjects() {
      await props.getAllProjects();
      setProjectsLoaded(true);

      if (props.company.role !== 'employee') {
        props.getAllDepartments();
        props.getProjectArchive();
        props.getAllAssociates();
      }
    }

    loadProjects();
  }, []);

  const projectArchive = async (pid: string) => {
    await props.archiveProject(pid);
    props.getAllProjects();
    props.getProjectArchive();
  };

  const singleProjectOnClick = async (pid: string) => {
    await props.getSingleProject(pid);
    await props.getRoleForProject(pid);
    await props.setCurrentProjectId(pid);
    props.history.push(
      `/company/${props.company.uniqueName}/project/${pid}`,
    );
  };

  const getProjectRole = async (pid: string) => {
    await props.getRoleForProject(pid);
    setModalOpen(true);
  };
  const checkRoleForChangeName = () => {
    permissions.grantAll
      ? setShowUpdateNameDialog(true)
      : permissions.projectModerator.includes('updateProjectPreface')
      ? setShowUpdateNameDialog(true)
      : setOpen(true);
  };

  const checkRoleForArchiveProject = (projectId: string) => {
    permissions.grantAll
      ? projectArchive(projectId)
      : permissions.projectModerator.includes('updateProjectPreface')
      ? projectArchive(projectId)
      : setOpen(true);
  };
  const checkRoleForUnarchiveProject = (projectId: string) => {
    permissions.grantAll
      ? props.unarchiveProject(projectId)
      : permissions.projectModerator.includes(
          'updateProjectPreface',
        ) && props.unarchiveProject(projectId);
  };

  const noProjectsFound = (
    <div className="tc  mb6">
      <h1 style={{ color: '#34495E' }}>No Projects Found</h1>
      {props.companyRole !== 'employee' && (
        <p
          onClick={() => setShowProjectDialog(true)}
          className="f5-l pointer dim f4-ns f6 tc"
          style={{ color: '#85929E', display: 'inline-block' }}
        >
          Click here to create a project or click on the{' '}
          <img
            src={addIcon}
            style={{
              display: 'inline-block',
              height: '20px',
            }}
          />{' '}
          icon below
        </p>
      )}
    </div>
  );

  const allProjects = orderBy(
    props.projects,
    ['updatedAt'],
    ['desc'],
  );

  const indexOfLastProject = currentProjectPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;

  const currentProjects = allProjects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  const nextProjectsPage = (e) => {
    e.preventDefault();
    if (
      currentProjectPage <
      Math.ceil(props.projects.length / itemsPerPage)
    ) {
      setCurrentProjectPage(currentProjectPage + 1);
    }
  };

  const prevProjectsPage = (e) => {
    e.preventDefault();
    if (currentProjectPage > 1) {
      setCurrentProjectPage(currentProjectPage - 1);
    }
  };

  return (
    <>
      <div>
        <div className="overflow-auto">
          <div className="flex flex-column relative">
            <div
              className="projects-filter dib self-end"
              style={{
                maxWidth: '265px',
              }}
            >
              <div className="bp3-input-group .modifier">
                <span className="bp3-icon bp3-icon-search"></span>
                <input
                  type="text"
                  className="bp3-input"
                  placeholder="Search"
                />
                <button className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-arrow-right"></button>
              </div>
            </div>
            <div
              style={
                projectsLoaded && props.projects.length > 0
                  ? {
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 265px))',
                      gridAutoRows: '135px',
                      gridGap: '10px 10px',
                    }
                  : {}
              }
            >
              {!projectsLoaded ? (
                <CircularProgress />
              ) : props.projects.length > 0 ? (
                currentProjects.map((project: any) => (
                  <div>
                    <Card
                      key={project._id}
                      className="h-100 ma1"
                      interactive={false}
                      style={{
                        paddingLeft: '0px',
                        paddingBottom: '0px',
                      }}
                    >
                      <div
                        className=""
                        style={{
                          borderLeft: `5px solid 
                    ${
                      find(Color, ['code', project.color])
                        ? find(Color, ['code', project.color])!.value
                        : 'white'
                    }`,
                          // TODO use dictionary
                          // borderLeft: '5px solid',
                          paddingLeft: '20px',
                          marginLeft: '-2px',
                          borderRadius: '3px',
                        }}
                      >
                        <div className="flex">
                          <h3
                            onClick={(e) => {
                              e.preventDefault();
                              singleProjectOnClick(project._id);
                            }}
                            className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f4 hover-dark-blue pointer"
                            style={{
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              width: '220px',
                            }}
                          >
                            {project.name}
                          </h3>
                          <Popover
                            className="w-10"
                            content={
                              modalOpen ? (
                                <Menu className="pa2">
                                  <MenuItem
                                    className="pa1"
                                    text="Update Project Name"
                                    onClick={(e: any) =>
                                      checkRoleForChangeName()
                                    }
                                  />
                                  <MenuItem
                                    className="pa1 red"
                                    text="Archive Project"
                                    onClick={(e: any) =>
                                      checkRoleForArchiveProject(
                                        project._id,
                                      )
                                    }
                                  />
                                </Menu>
                              ) : (
                                'Loading..'
                              )
                            }
                            target={
                              <Button
                                style={{
                                  transform: 'rotate(90deg)',
                                  OTransform: 'rotate(90deg)',
                                  msTransform: 'rotate(90deg)',
                                  WebkitTransform: 'rotate(90deg)',
                                }}
                                icon="more"
                                minimal={true}
                                className="outline-0"
                                onClick={(e: any) =>
                                  getProjectRole(project._id)
                                }
                              />
                            }
                          />
                          {props.companyRooms &&
                          unreadMessageNotification(
                            props.companyRooms,
                            'project',
                            project._id,
                          ) ? (
                            <span
                              className="ml1 br-100 bg-red"
                              style={{ width: '7px', height: '7px' }}
                            ></span>
                          ) : null}
                        </div>
                        <h3
                          className="mt0 mb2 flex-grow-1 fw6 overflow-hidden silver"
                          style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '220px',
                          }}
                        >
                          {project.departments &&
                            project.departments.map((dep: any) => (
                              <label style={{ paddingLeft: '2px' }}>
                                {dep.name}
                              </label>
                            ))}
                        </h3>
                      </div>
                    </Card>
                    {showUpdateNameDialog && (
                      <RightSidebar
                        onClose={() =>
                          setShowUpdateNameDialog(
                            !showUpdateNameDialog,
                          )
                        }
                      >
                        <ChangeName
                          projectName={props.currentProject.name}
                          projectId={props.currentProject._id}
                          color={props.currentProject.color}
                          setShowDialog={setShowUpdateNameDialog}
                        />
                      </RightSidebar>
                    )}
                  </div>
                ))
              ) : (
                noProjectsFound
              )}
            </div>
            {projectsLoaded === true &&
              props.projects.length > itemsPerPage && (
                <div className="flex flex-row items-center w-100 justify-center mt3">
                  <div
                    className="f6 fw5 flex flex-row items-center"
                    style={{ color: '#BBBBBB' }}
                  >
                    <Icon
                      icon="circle-arrow-left"
                      iconSize={25}
                      onClick={prevProjectsPage}
                      className={`mr2 ${
                        currentProjectPage > 1 && 'pointer'
                      }`}
                      style={{
                        color:
                          currentProjectPage > 1
                            ? '#3F61C5'
                            : '#656565',
                      }}
                    />
                    {currentProjectPage} of{' '}
                    {Math.ceil(props.projects.length / itemsPerPage)}
                    <Icon
                      icon="circle-arrow-right"
                      iconSize={25}
                      onClick={nextProjectsPage}
                      className={`ml2 ${
                        currentProjectPage <
                          Math.ceil(
                            props.projects.length / itemsPerPage,
                          ) && 'pointer'
                      }`}
                      style={{
                        color:
                          currentProjectPage <
                          Math.ceil(
                            props.projects.length / itemsPerPage,
                          )
                            ? '#3F61C5'
                            : '#656565',
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
          {props.company.role !== 'employee' && (
            <div>
              <h3 className="f3-ns f4">Archived Projects</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 265px))',
                  gridTemplateRows: 'repeat(2, 135px)',
                  gridGap: '10px 10px',
                }}
              >
                {props.archiveProjectList.map((archProject: any) => (
                  <Card
                    className="h-100"
                    interactive={true}
                    style={{
                      paddingLeft: '0px',
                      paddingBottom: '0px',
                    }}
                  >
                    <div
                      className=""
                      style={{
                        borderLeft: `5px solid 
                      ${
                        find(Color, ['code', archProject.color])
                          ? find(Color, ['code', archProject.color])!
                              .value
                          : 'red'
                      }`,
                        // TODO use dictionary
                        // borderLeft: '5px solid red',
                        paddingLeft: '20px',
                        marginLeft: '-2px',
                        borderRadius: '3px',
                      }}
                    >
                      <div className="flex">
                        <h3
                          className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f4 hover-dark-blue pointer"
                          style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '220px',
                          }}
                        >
                          {archProject.name}
                        </h3>
                        {permissions.grantAll && (
                          <Popover
                            className="w-10"
                            content={
                              <Menu className="pa2">
                                <MenuItem
                                  className="pa1 red"
                                  text="Restore Project"
                                  onClick={() =>
                                    checkRoleForUnarchiveProject(
                                      archProject._id,
                                    )
                                  }
                                />
                              </Menu>
                            }
                            target={
                              <Button
                                style={{
                                  transform: 'rotate(90deg)',
                                  OTransform: 'rotate(90deg)',
                                  msTransform: 'rotate(90deg)',
                                  WebkitTransform: 'rotate(90deg)',
                                }}
                                icon="more"
                                minimal={true}
                                className="outline-0"
                              />
                            }
                          />
                        )}
                      </div>
                      <h3
                        className="mt0 mb2 flex-grow-1 fw6 overflow-hidden silver"
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          width: '220px',
                        }}
                      >
                        {archProject.departments.map((dep: any) => (
                          <label style={{ paddingLeft: '2px' }}>
                            {dep.name}
                          </label>
                        ))}
                      </h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {props.company.role !== 'employee' && (
            <div>
              <img
                onClick={() =>
                  setShowProjectDialog(!showProjectDialog)
                }
                src={addIcon}
                className={`fixed pointer addButton ${
                  showProjectDialog ? 'dn' : 'db'
                }`}
                style={{
                  boxShadow: '0px 6px 6px #00000029',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        </div>
      </div>
      {showProjectDialog && (
        <RightSidebar
          onClose={() => setShowProjectDialog(!showProjectDialog)}
        >
          <FormProject setShowProjectDialog={setShowProjectDialog} />
        </RightSidebar>
      )}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <MuiAlert severity="warning">
          You are not allowed to do this change!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  projects: state.projectReducer.allProjects,
  archiveProjectList: state.projectReducer.allArchive,
  company: state.companyReducer.currentCompany,
  companyRooms: state.roomReducer.companyRooms,
  role:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project.optionalRole,
  currentProject:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project,
  companyRole: state.companyReducer.currentCompany.role,
});

export const MyProject = connect(mapStateToProps, {
  getAllProjects,
  getAllDepartments,
  archiveProject,
  unarchiveProject,
  getProjectArchive,
  getSingleProject,
  setCurrentProjectId,
  getAllAssociates,
  getRoleForProject,
})(withRouter(MyProjectPageComponent));
