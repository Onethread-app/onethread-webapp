import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { find, orderBy } from 'lodash';

import moment from 'moment';
import { Card } from '@blueprintjs/core/lib/esm/components/card/card';
import { Elevation } from '@blueprintjs/core/lib/esm/common/elevation';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Menu } from '@blueprintjs/core/lib/esm/components/menu/menu';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

import { getAllAssociates } from 'stores/associate/Actions';
import { getAllDepartments } from '../../../stores/company/Actions';
import {
  archiveProject,
  getAllProjects,
  getProjectArchive,
  getRoleForProject,
  getSingleProject,
  setCurrentProjectId,
  unarchiveProject,
} from '../../../stores/project/Actions';
import {
  Color,
  unreadMessageNotification,
} from 'stores/UtilsActions';

import { RightSidebar } from 'components/RightSidebar';
import { UpdateProject } from './ChangeProjectName';
import { FormProject } from './CreateProjectForm';
import { projectRules } from './settings/projectrules';
import NoProjectsFound from 'NoProjectsFound';

import addIcon from '../../../resources/images/addIcon.png';
import './MyProjects.scss';

const CompletedProjectsComponent = (
  props: any & RouteComponentProps,
) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = useState(
    false,
  );
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [allProjects, setAllProjects] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [currentProjects, setCurrentProjects] = useState<any>([]);
  const [itemsPerPage] = useState(15);
  const permissions = projectRules(props.role, props.optionalRole);
  const indexOfLastProject = currentProjectPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;

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
      `/company/${props.company.uniqueName}/project/${pid}/overview`,
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

  const nextProjectsPage = (e: any) => {
    e.preventDefault();
    if (
      currentProjectPage <
      Math.ceil(props.projects.length / itemsPerPage)
    ) {
      setCurrentProjectPage(currentProjectPage + 1);
    }
  };

  const prevProjectsPage = (e: any) => {
    e.preventDefault();
    if (currentProjectPage > 1) {
      setCurrentProjectPage(currentProjectPage - 1);
    }
  };

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
  }, [props.company._id]);

  useEffect(() => {
    setAllProjects(
      orderBy(
        props.projects.filter(
          (p) => p.status === 'completed' && p.removed === false,
        ),
        ['createdAt'],
        ['desc'],
      ),
    );
  }, [props.projects]);

  useEffect(() => {
    setFilteredProjects(allProjects);
  }, [allProjects]);

  useEffect(() => {
    setCurrentProjects(
      filteredProjects.slice(indexOfFirstProject, indexOfLastProject),
    );
  }, [filteredProjects, indexOfLastProject, indexOfFirstProject]);

  return (
    <>
      <div>
        <div className="overflow-auto my-projects">
          <div className="flex flex-column relative">
            <div
              style={
                projectsLoaded && filteredProjects.length > 0
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
              ) : filteredProjects.length > 0 ? (
                currentProjects.map((project: any) => (
                  <div className="pa1">
                    <Card
                      key={project._id}
                      className="h-100"
                      interactive={true}
                      elevation={Elevation.TWO}
                      style={{
                        paddingLeft: '0px',
                        paddingBottom: '0px',
                        cursor: 'default',
                      }}
                    >
                      <div className="flex flex-column">
                        <div className="flex items-start">
                          <h3
                            style={{
                              borderLeft: `5px solid 
                              ${
                                find(Color, ['code', project.color])
                                  ? find(Color, [
                                      'code',
                                      project.color,
                                    ])!.value
                                  : 'white'
                              }`,
                              paddingLeft: '20px',
                              marginLeft: '-2px',
                              borderRadius: '3px',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              width: '220px',
                              height: '2rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              singleProjectOnClick(project._id);
                            }}
                            className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f4 hover-dark-blue pointer"
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
                                    text="Update Project"
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
                        <div
                          className="flex flex-column items-start mt2"
                          style={{ paddingLeft: '25px' }}
                        >
                          <span
                            className={`bp3-tag modifier ${
                              project.status === 'not-started'
                                ? 'bg-blue'
                                : project.status === 'ongoing'
                                ? 'bg-orange'
                                : 'bg-green'
                            }`}
                          >
                            {project.status.replace(/-|\s/g, ' ')}
                          </span>

                          <p
                            className="f7 fw5"
                            style={{ marginTop: '10px' }}
                          >
                            Deadline:
                            {project.deadline
                              ? moment(project.deadline).format(
                                  'DD/MM/YYYY',
                                )
                              : 'Not Set'}
                          </p>
                        </div>
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
                        <UpdateProject
                          projectName={props.currentProject.name}
                          projectId={props.currentProject._id}
                          color={props.currentProject.color}
                          deadline={
                            props.currentProject.deadline
                              ? props.currentProject.deadline
                              : undefined
                          }
                          setShowDialog={setShowUpdateNameDialog}
                        />
                      </RightSidebar>
                    )}
                  </div>
                ))
              ) : (
                <NoProjectsFound />
              )}
            </div>
            {projectsLoaded === true &&
              filteredProjects.length > itemsPerPage && (
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
                            ? '#34b3e9'
                            : '#656565',
                      }}
                    />
                    {currentProjectPage} of{' '}
                    {Math.ceil(
                      filteredProjects.length / itemsPerPage,
                    )}
                    <Icon
                      icon="circle-arrow-right"
                      iconSize={25}
                      onClick={nextProjectsPage}
                      className={`ml2 ${
                        currentProjectPage <
                          Math.ceil(
                            filteredProjects.length / itemsPerPage,
                          ) && 'pointer'
                      }`}
                      style={{
                        color:
                          currentProjectPage <
                          Math.ceil(
                            filteredProjects.length / itemsPerPage,
                          )
                            ? '#34b3e9'
                            : '#656565',
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
          {/* Add Icon */}
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
                alt=""
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

export const CompletedProjects = connect(mapStateToProps, {
  getAllProjects,
  getAllDepartments,
  archiveProject,
  unarchiveProject,
  getProjectArchive,
  getSingleProject,
  setCurrentProjectId,
  getAllAssociates,
  getRoleForProject,
})(withRouter(CompletedProjectsComponent));
