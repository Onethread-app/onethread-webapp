import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Popover, Button, Menu, MenuItem } from '@blueprintjs/core';
import addIcon from '../../../resources/images/addIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { FormProject } from './CreateProjectForm';
import { ChangeName } from './ChangeProjectName';
import { getAllProjects, archiveProject, getProjectArchive } from '../../../stores/project/Actions';
import { getAllDepartments } from '../../../stores/company/Actions';
import { find } from 'lodash';
import { boardColor } from 'stores/UtilsActions';

const ProjectPageComponent = (props: any) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = useState(false);

  const projectType = [
    { _id: 'sd', name: 'Single Department' },
    { _id: 'md', name: 'Multiple Department' },
    { _id: 'associates', name: 'Associates' }
  ];

  const projectArchive = async (pid: string) => {
    await props.archiveProject(pid);
    props.getAllProjects();
    props.getProjectArchive();
  };

  useEffect(() => {
    props.getAllProjects();
    props.getAllDepartments();
    props.getProjectArchive();
  }, []);
  return (
    <>
      <div >
        <h3 className="f3 ph4">
          My Projects
		    </h3>
        <div className="overflow-auto pa4">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 265px))',
              gridTemplateRows: 'repeat(2, 135px)',
              gridGap: '10px 10px'
            }}>
            {props.projects.map((project: any) =>
              <div>
                <Card
                  key={project._id}
                  className="h-100"
                  interactive={true}
                  onClick={async (e) => {
                    e.preventDefault();
                    // const currentBoard: any = await props.getSelectedBoard(board._id);
                    // if (currentBoard._id) {
                    // 	props.history.push(`/company/${props.company.name}/board/${currentBoard._id}`);
                    // }
                  }}
                  style={{ paddingLeft: '0px', paddingBottom: '0px' }}
                >
                  {console.log(project)}
                  <div
                    className=""
                    style={{
                      borderLeft: `5px solid 
                    ${find(boardColor, ['code', project.color]) ?
                          find(boardColor, ['code', project.color])!.value : 'white'
                        }`, // TODO use dictionary
                      // borderLeft: '5px solid',
                      paddingLeft: '20px',
                      marginLeft: '-2px',
                      borderRadius: '3px'
                    }}
                  >
                    <div className="flex">
                      <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                        {/* {board.name} */}
                        {project.name}
                      </h3>
                      <Popover
                        className="w-10"
                        content={
                          <Menu className="pa2">
                            <MenuItem
                              className="pa1"
                              text="Update Project Name"
                              onClick={(e: any) => setShowUpdateNameDialog(true)}
                            />
                            <MenuItem
                              className="pa1 red"
                              text="Archive Project"
                              onClick={(e: any) => projectArchive(project._id)}
                            />
                            {console.log(project._id)}
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
                    <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f7 silver"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                      {/* {board.name} */}
                      {project.departments.map((dep: any) => dep.name)}
                    </h3>
                  </div>
                  <div className="flex pt3 pr3" style={{ justifyContent: 'space-between', paddingLeft: '20px' }}>
                    <div>
                      <p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
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
                    onClose={() => setShowUpdateNameDialog(!showUpdateNameDialog)}
                  >
                    <ChangeName pid={project._id} setShowDialog={setShowUpdateNameDialog} />
                  </RightSidebar>
                )}
              </div>
            )
            }
          </div>
          <div>
            <h3 className="f3">
              Archieved Projects
		        </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 265px))',
                gridTemplateRows: 'repeat(2, 135px)',
                gridGap: '10px 10px'
              }}>
              {props.archiveProjectList.map((archProject: any) =>
                <Card
                  className="h-100"
                  interactive={true}
                  onClick={async (e) => {
                    e.preventDefault();
                    // const currentBoard: any = await props.getSelectedBoard(board._id);
                    // if (currentBoard._id) {
                    // 	props.history.push(`/company/${props.company.name}/board/${currentBoard._id}`);
                    // }
                  }}
                  style={{ paddingLeft: '0px', paddingBottom: '0px' }}
                >
                  <div
                    className=""
                    style={{
                      // borderLeft: `5px solid 
                      // ${find(boardColor, ['code', board.color]) ?
                      // 		find(boardColor, ['code', board.color])!.value : 'white'
                      // 	}`, // TODO use dictionary
                      borderLeft: '5px solid red',
                      paddingLeft: '20px',
                      marginLeft: '-2px',
                      borderRadius: '3px'
                    }}
                  >
                    <div className="flex">
                      <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                        {/* {board.name} */}
                        {archProject.name}
                      </h3>
                      <Popover
                        className="w-10"
                        content={
                          <Menu className="pa2">
                            <MenuItem
                              className="pa1"
                              text="Update Project Name"
                            // onClick={(e: any) => setShowColumnFormDialog(true)}
                            />
                            <MenuItem
                              className="pa1 red"
                              text="Archive Project"
                            // onClick={(e: any) => projectArchive(project._id)}
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
                    <h3 className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f7 silver"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                      {/* {board.name} */}
                      By Labiba
						        </h3>
                  </div>
                  <div className="flex pt3 pr3" style={{ justifyContent: 'space-between', paddingLeft: '20px' }}>
                    <div>
                      <p className="mb0 ws-break" style={{ fontSize: '0.7rem' }}>
                        Assigned Members
							</p>
                      <p className="fw8">
                        {/* {board.members ? board.members.length : 0} */}
                        15
							</p>
                    </div>
                  </div>
                </Card>
              )}
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
        <RightSidebar
          onClose={() => setShowProjectDialog(!showProjectDialog)}
        >
          <FormProject setShowProjectDialog={setShowProjectDialog}
            projectType={projectType} />
        </RightSidebar>
      )}

    </>
  );
};

const mapStateToProps = (state: any) => ({
  projects: state.projectReducer.allProjects,
  archiveProjectList: state.projectReducer.allArchive
});

export const ProjectPage = connect(mapStateToProps,
  { getAllProjects, getAllDepartments, archiveProject, getProjectArchive })
  (ProjectPageComponent);