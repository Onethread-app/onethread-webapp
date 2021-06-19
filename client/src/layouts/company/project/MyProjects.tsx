import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Popover,
  Button,
  Menu,
  MenuItem,
  Icon,
  Elevation,
} from '@blueprintjs/core';

import {
  DateRangeInput,
  DateRange,
  TimePrecision,
} from '@blueprintjs/datetime';

import { Snackbar, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Select from 'react-select';
import moment from 'moment';
import addIcon from '../../../resources/images/addIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { FormProject } from './CreateProjectForm';
import { UpdateProject } from './ChangeProjectName';
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

import './MyProjects.scss';

const MyProjectPageComponent = (props: any & RouteComponentProps) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showUpdateNameDialog, setShowUpdateNameDialog] = useState(
    false,
  );
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showClearFilter, setShowClearFilter] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [allProjects, setAllProjects] = useState<any>([]); // projects after first render or after applying filters
  const [filteredProjects, setFilteredProjects] = useState<any>([]); // projects after applying search
  const [currentProjects, setCurrentProjects] = useState<any>([]); // projects in current page
  const [selectedOption, setSelectedOption] = useState({
    label: 'All',
    value: 'all',
  });

  const [range, setRange] = useState<DateRange>([
    undefined,
    undefined,
  ]);
  const [searchValue, setSearchValue] = useState('');
  const [itemsPerPage] = useState(15);

  const permissions = projectRules(props.role, props.optionalRole);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'not-started', label: 'Not Started' },
    // { value: 'extended', label: 'Extended' },
  ];

  const indexOfLastProject = currentProjectPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;

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

  useEffect(() => {
    setAllProjects(orderBy(props.projects, ['createdAt'], ['desc']));
    console.log(props.projects);
  }, [props.projects]);

  useEffect(() => {
    if (searchValue) {
      setCurrentProjectPage(1);
      const filteredProjects = allProjects.filter((project: any) =>
        project.name
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      );
      setFilteredProjects(filteredProjects);
    } else setFilteredProjects(allProjects);
  }, [allProjects, searchValue]);

  useEffect(() => {
    setCurrentProjects(
      filteredProjects.slice(indexOfFirstProject, indexOfLastProject),
    );
  }, [filteredProjects, indexOfLastProject, indexOfFirstProject]);

  useEffect(() => {
    setCurrentProjectPage(1);
    if (
      range[0] === undefined &&
      range[1] === undefined &&
      selectedOption.value === 'all'
    ) {
      setAllProjects(
        orderBy(props.projects, ['createdAt'], ['desc']),
      );
      setShowClearFilter(false);
    } else if (
      range[0] === undefined &&
      range[1] === undefined &&
      selectedOption.value !== 'all'
    ) {
      const filteredProjects = props.projects.filter(
        (project: any) => {
          return project.status === selectedOption.value;
        },
      );
      setAllProjects(filteredProjects);
      setShowClearFilter(true);
    } else if (
      range[0] !== undefined &&
      range[1] !== undefined &&
      selectedOption.value === 'all'
    ) {
      let filteredProjects: any;
      if (range[0] && range[1]) {
        filteredProjects = props.projects.filter((project: any) => {
          if (range[0] && range[1]) {
            return (
              project.createdAt > range[0].toISOString() &&
              project.createdAt < range[1].toISOString()
            );
          }
          return;
        });
        setAllProjects(filteredProjects);
        setShowClearFilter(true);
      }
    } else {
      let filteredProjects: any;
      if (range[0] && range[1]) {
        filteredProjects = props.projects.filter((project: any) => {
          if (range[0] && range[1]) {
            return (
              project.createdAt > range[0].toISOString() &&
              project.createdAt < range[1].toISOString() &&
              project.status === selectedOption.value
            );
          }
          return;
        });
        setAllProjects(filteredProjects);
        setShowClearFilter(true);
      }
    }
  }, [range, selectedOption]);

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
  const checkRoleForUnarchiveProject = (projectId: string) => {
    permissions.grantAll
      ? props.unarchiveProject(projectId)
      : permissions.projectModerator.includes(
          'updateProjectPreface',
        ) && props.unarchiveProject(projectId);
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

  const handleRangeChange = (range: DateRange) => {
    setRange(range);
  };

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleSelect = (selected: any) => {
    setSelectedOption(selected);
  };

  const handleClear = () => {
    setRange([undefined, undefined]);
    setSelectedOption({ value: 'all', label: 'All' });
    setAllProjects(orderBy(props.projects, ['createdAt'], ['desc']));
    setShowClearFilter(false);
  };

  const noProjectsFound = (
    <div className={`tc  ${searchValue ? '' : 'mt4 mb5'} `}>
      <h1 style={{ color: '#34495E' }}>No Projects Found</h1>
      {!searchValue && props.companyRole !== 'employee' && (
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
            alt=""
          />{' '}
          icon below
        </p>
      )}
    </div>
  );

  return (
    <>
      <div>
        <div className="overflow-auto my-projects">
          <div className="flex flex-column relative">
            <div
              className="projects-filter mh1 mt1 mb3 self-start flex flex-row-l flex-column items-center justify-between w-90"
              style={{ gap: '.5rem' }}
            >
              <div className="flex flex-row-l flex-column items-center filter mb0-ns mb2">
                <Select
                  options={statusOptions}
                  value={selectedOption}
                  onChange={handleSelect}
                />
                <DateRangeInput
                  maxDate={new Date()}
                  formatDate={(date) => date.toLocaleString()}
                  onChange={handleRangeChange}
                  parseDate={(str) => new Date(str)}
                  timePickerProps={{
                    precision: TimePrecision.MINUTE,
                    showArrowButtons: true,
                  }}
                  value={range}
                />
                {showClearFilter && (
                  <Button
                    icon={
                      <Icon
                        icon="refresh"
                        style={{
                          color: '#fff',
                          background: '#3F61C5',
                        }}
                      />
                    }
                    onClick={handleClear}
                    style={{
                      height: '38px',
                      background: '#3F61C5',
                    }}
                  />
                )}
              </div>
              <div className="bp3-input-group .modifier">
                <span className="bp3-icon bp3-icon-search"></span>
                <input
                  type="text"
                  className="bp3-input"
                  placeholder="Search"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
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
                          <div className="flex items-center justify-between w-100">
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
                            {project.status !== 'not-started' && (
                              <span className="f7 fw5 mr2">
                                Remaining Tasks:{' '}
                                {`${project.remainingTasks}/${project.totalTasks}`}
                              </span>
                            )}
                          </div>

                          <p
                            className="f7 fw5"
                            style={{ marginTop: '10px' }}
                          >
                            Deadline:{' '}
                            {project.deadline
                              ? moment(project.deadline).format(
                                  'DD/MM/YYYY',
                                )
                              : 'Not Set'}
                          </p>
                        </div>
                        {/* <h3
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
                        </h3> */}
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
                noProjectsFound
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
                            ? '#3F61C5'
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
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <MuiAlert severity="error">
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
