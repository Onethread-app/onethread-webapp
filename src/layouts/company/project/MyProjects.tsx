import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Popover,
  Button,
  Menu,
  MenuItem,
  HTMLSelect
} from '@blueprintjs/core';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import addIcon from '../../../resources/images/addIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { FormProject } from './CreateProjectForm';
import { ChangeName } from './ChangeProjectName';
import { find } from 'lodash';
import { boardColor, unreadMessageNotification } from 'stores/UtilsActions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getAllDepartments } from '../../../stores/company/Actions';
import {
  getAllProjects,
  archiveProject,
  getProjectArchive,
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject
} from '../../../stores/project/Actions';
import { getAllAssociates } from 'stores/associate/Actions';
import { projectRules } from './settings/projectrules';

const MyProjectPageComponent = (props: any & RouteComponentProps) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const projectArchive = async (pid: string) => {
    await props.archiveProject(pid);
    props.getAllProjects();
    props.getProjectArchive();
  };

  const singleProjectOnClick = async (pid: string) => {
    await props.getSingleProject(pid);
    await props.getRoleForProject(pid);
    await props.setCurrentProjectId(pid);
    props.history.push(`/company/${props.company.name}/project/${pid}`);
  };

  const getProjectRole = async (pid: string) => {
    await props.getRoleForProject(pid);
    setModalOpen(true);
  };
  const checkRoleForChangeName = () => {
    props.role === 'admin'
      ? setShowUpdateNameDialog(true)
      : projectRules(props.optionalRole)[props.role].includes(
          'updateProjectPreface'
        )
      ? setShowUpdateNameDialog(true)
      : setOpen(true);
  };

  const checkRoleForArchiveProject = (projectId: string) => {
    props.role === 'admin'
      ? projectArchive(projectId)
      : projectRules(props.optionalRole)[props.role].includes(
          'updateProjectPreface'
        )
      ? projectArchive(projectId)
      : setOpen(true);
  };
  useEffect(() => {
    props.getAllProjects();
    props.getAllDepartments();
    props.getProjectArchive();
    props.getAllAssociates();
  }, []);
  return (
    <>
      {' '}
      <div className="flex justify-end">
        <p className="pr3 fw7 mt1">Filter By</p>
        <div style={{ width: '200px' }}>
          {/* TODO: Use common dropdown component */}
          <HTMLSelect
            fill={true}
            minimal={true}
            style={{
              outline: 'none',
              border: '1px solid #E1E1E1',
              fontWeight: 600,
              textAlignLast: 'center'
            }}
          >
            <option selected value="">
              All
            </option>
          </HTMLSelect>
        </div>
      </div>
      <div>
        <h3 className="f3">My Projects</h3>
        <div className="overflow-auto">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 265px))',
              gridTemplateRows: 'repeat(2, 135px)',
              gridGap: '10px 10px'
            }}
          >
            {props.projects.map((project: any) => (
              <div>
                <Card
                  key={project._id}
                  className="h-100 ma1"
                  interactive={false}
                  style={{ paddingLeft: '0px', paddingBottom: '0px' }}
                >
                  <div
                    className=""
                    style={{
                      borderLeft: `5px solid 
                    ${
                      find(boardColor, ['code', project.color])
                        ? find(boardColor, ['code', project.color])!.value
                        : 'white'
                    }`,
                      // TODO use dictionary
                      // borderLeft: '5px solid',
                      paddingLeft: '20px',
                      marginLeft: '-2px',
                      borderRadius: '3px'
                    }}
                  >
                    <div className="flex">
                      <h3
                        onClick={e => {
                          singleProjectOnClick(project._id);
                          e.preventDefault();
                        }}
                        className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5 hover-dark-blue pointer"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
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
                                onClick={(e: any) => checkRoleForChangeName()}
                              />
                              <MenuItem
                                className="pa1 red"
                                text="Archive Project"
                                onClick={(e: any) =>
                                  checkRoleForArchiveProject(project._id)
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
                              WebkitTransform: 'rotate(90deg)'
                            }}
                            icon="more"
                            minimal={true}
                            className="outline-0"
                            onClick={(e: any) => getProjectRole(project._id)}
                          />
                        }
                      />
                      {props.companyRooms &&
                      unreadMessageNotification(
                        props.companyRooms,
                        'project',
                        project._id
                      ) ? (
                        <span
                          className="ml1 br-100 bg-red"
                          style={{ width: '7px', height: '7px' }}
                        ></span>
                      ) : null}
                    </div>
                    <h3
                      className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f7 silver"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {project.departments.map((dep: any) => (
                        <label style={{ paddingLeft: '2px' }}>{dep.name}</label>
                      ))}
                    </h3>
                  </div>
                  <div
                    className="flex pt3 pr3"
                    style={{
                      justifyContent: 'space-between',
                      paddingLeft: '20px'
                    }}
                  >
                    <div>
                      <p
                        className="mb0 ws-break"
                        style={{ fontSize: '0.7rem' }}
                      >
                        Assigned Members
                      </p>
                      <p className="fw8">
                        {/* {board.members ? board.members.length : 0} */}
                        15
                      </p>
                    </div>
                  </div>
                </Card>
                {showUpdateNameDialog && (
                  <RightSidebar
                    onClose={() =>
                      setShowUpdateNameDialog(!showUpdateNameDialog)
                    }
                  >
                    <ChangeName
                      projectId={project._id}
                      setShowDialog={setShowUpdateNameDialog}
                    />
                  </RightSidebar>
                )}
              </div>
            ))}
          </div>
          <div>
            <h3 className="f3">Archieved Projects</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 265px))',
                gridTemplateRows: 'repeat(2, 135px)',
                gridGap: '10px 10px'
              }}
            >
              {props.archiveProjectList.map((archProject: any) => (
                <Card
                  className="h-100"
                  interactive={true}
                  style={{ paddingLeft: '0px', paddingBottom: '0px' }}
                >
                  <div
                    className=""
                    style={{
                      borderLeft: `5px solid 
                      ${
                        find(boardColor, ['code', archProject.color])
                          ? find(boardColor, ['code', archProject.color])!.value
                          : 'red'
                      }`,
                      // TODO use dictionary
                      // borderLeft: '5px solid red',
                      paddingLeft: '20px',
                      marginLeft: '-2px',
                      borderRadius: '3px'
                    }}
                  >
                    <div className="flex">
                      <h3
                        className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {archProject.name}
                      </h3>
                      <Popover
                        className="w-10"
                        content={
                          <Menu className="pa2">
                            <MenuItem
                              className="pa1"
                              text="Update Project Name"
                            />
                            <MenuItem
                              className="pa1 red"
                              text="Archive Project"
                            />
                          </Menu>
                        }
                        target={
                          <Button
                            style={{
                              transform: 'rotate(90deg)',
                              OTransform: 'rotate(90deg)',
                              msTransform: 'rotate(90deg)',
                              WebkitTransform: 'rotate(90deg)'
                            }}
                            icon="more"
                            minimal={true}
                            className="outline-0"
                          />
                        }
                      />
                    </div>
                    <h3
                      className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f7 silver"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {archProject.departments.map((dep: any) => (
                        <label style={{ paddingLeft: '2px' }}>{dep.name}</label>
                      ))}
                    </h3>
                  </div>
                  <div
                    className="flex pt3 pr3"
                    style={{
                      justifyContent: 'space-between',
                      paddingLeft: '20px'
                    }}
                  >
                    <div>
                      <p
                        className="mb0 ws-break"
                        style={{ fontSize: '0.7rem' }}
                      >
                        Assigned Members
                      </p>
                      <p className="fw8">15</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <img
              onClick={() => setShowProjectDialog(!showProjectDialog)}
              src={addIcon}
              className={`fixed pointer ${showProjectDialog ? 'dn' : 'db'}`}
              style={{
                bottom: '5rem',
                right: '7rem',
                width: '5rem',
                boxShadow: '0px 6px 6px #00000029',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      </div>
      {showProjectDialog && (
        <RightSidebar onClose={() => setShowProjectDialog(!showProjectDialog)}>
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
    state.projectReducer.projectRole.projects.project.optionalRole
});

export const MyProject = connect(mapStateToProps, {
  getAllProjects,
  getAllDepartments,
  archiveProject,
  getProjectArchive,
  getSingleProject,
  setCurrentProjectId,
  getAllAssociates,
  getRoleForProject
})(withRouter(MyProjectPageComponent));
