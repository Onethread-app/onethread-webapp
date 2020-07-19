import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dialog, Button, Popover } from '@blueprintjs/core';
import { getProjectsIndividual } from 'stores/project/Actions';
import { isMobileOnly, CustomView } from 'react-device-detect';
import { IMember } from 'stores/project/Reducer';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  Grid,
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import project from './../../resources/images/noProject.png';
import { ProjectAdd } from './CreateProjectForm';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import {
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
} from 'stores/project/Actions';
import { ICompany } from 'stores/company/Reducer';
import { getAllProjects } from 'stores/project/Actions';
import { Loading } from 'components/Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));
interface ProjectListProps {
  getProjectsIndividual: () => void;
  getSingleProject: (val: any) => void;
  setCurrentProjectId: (val: any) => void;
  getRoleForProject: (val: any) => void;
  getAllProjects: () => void;
  project: IMember[];
  company: ICompany;
}

export const ProjectListComponent = (
  props: ProjectListProps & RouteComponentProps,
) => {
  const classes = useStyles();

  const [searchProjects, setSearchProjects] = useState('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    if (props.company.name) {
      await props.getAllProjects();
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [props.company.name]);

  const singleProjectOnClick = async (pid: string) => {
    await props.getSingleProject(pid);
    await props.getRoleForProject(pid);
    await props.setCurrentProjectId(pid);
    props.history.push(
      `/company/${props.company.name}/project/${pid}`,
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mv2">
        <h1 className="f3-ns f5 dark-gray">Projects</h1>
        <div className="flex items-center">
          <div className="db-ns dn">
            <div className="bp3-input-group .modifier">
              <span className="bp3-icon bp3-icon-search"></span>
              <input
                className="bp3-input"
                type="search"
                placeholder="Search input"
                dir="auto"
                onChange={(e) => {
                  setSearchProjects(e.target.value);
                }}
              />
            </div>
          </div>
          <Popover
            popoverClassName="bg-white pa2"
            className="bg-white dn-ns db"
            content={
              <div className="bp3-input-group .modifier">
                <span className="bp3-icon bp3-icon-search"></span>
                <input
                  className="bp3-input"
                  type="search"
                  placeholder="Search input"
                  dir="auto"
                  onChange={(e) => {
                    setSearchProjects(e.target.value);
                  }}
                />
              </div>
            }
            target={
              <span className="bp3-icon bp3-icon-search mh2"></span>
            }
          />
          <Button
            onClick={() => setShowProjectDialog(true)}
            icon="plus"
            className="pa3-ns pa2 ml2"
            style={{
              background: '#0F0C4E',
              color: 'white',
              width: isMobileOnly ? '180px' : '285px',
            }}
          >
            Start A New Project
          </Button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : props.project && props.project.length > 0 ? (
        <div className="overflow-y-auto h5">
          <CustomView condition={!isMobileOnly}>
            <Grid container>
              <Grid item xs>
                <div className="b">Name</div>
              </Grid>
              <Grid item xs>
                <div className="b">Type</div>
              </Grid>
              <Grid item xs>
                <div className="b">Lead</div>
              </Grid>
            </Grid>
          </CustomView>
          {searchProjects
            ? props.project
                .filter((item) => !item.name.indexOf(searchProjects))
                .map((filteredProjects) => (
                  <Card
                    style={{ marginTop: '10px', padding: '10px' }}
                    onClick={(e) => {
                      singleProjectOnClick(filteredProjects._id);
                      e.preventDefault();
                    }}
                  >
                    <Grid container style={{ cursor: 'pointer' }}>
                      <Grid item xs>
                        <div className="ml1">
                          {filteredProjects.name}
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">
                          {filteredProjects.type}
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">
                          {filteredProjects.concernedAdmin.name}
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                ))
            : props.project.map((p) => {
                return isMobileOnly ? (
                  <div className="mt2 pointer">
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Paper
                          className={classes.heading}
                          elevation={0}
                        >
                          <Typography className="">
                            {p.name}
                          </Typography>
                        </Paper>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails
                        onClick={(e) => {
                          singleProjectOnClick(p._id);
                          e.preventDefault();
                        }}
                      >
                        <Paper
                          className={classes.heading}
                          elevation={0}
                        >
                          <Typography>Type: {p.type}</Typography>
                        </Paper>
                        <Paper
                          className={classes.heading}
                          elevation={0}
                        >
                          <Typography>
                            Lead: {p.concernedAdmin.name}
                          </Typography>
                        </Paper>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                ) : (
                  <Card
                    style={{ marginTop: '10px', padding: '10px' }}
                    onClick={(e) => {
                      singleProjectOnClick(p._id);
                      e.preventDefault();
                    }}
                  >
                    <Grid container style={{ cursor: 'pointer' }}>
                      <Grid item xs>
                        <div className="ml1">{p.name}</div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">{p.type}</div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">
                          {p.concernedAdmin.name}
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
        </div>
      ) : (
        <div className="white pv4 tc bg-white">
          <img
            className={`${isMobileOnly && 'w4'}`}
            src={project}
            alt="project"
          />
          <h1 className="light-silver fw4 f5 f3-ns">
            There's no existing project to show
          </h1>
          <h2 className="light-silver fw4 f7 f4">
            Simply click on 'Start a New Project' button to create a
            new one
          </h2>
        </div>
      )}
      {showProjectDialog && (
        <Dialog
          onClose={() => setShowProjectDialog(!showProjectDialog)}
          isOpen={showProjectDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ProjectAdd setShowDialog={setShowProjectDialog} />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    project: state.projectReducer.allProjects,
    company: state.companyReducer.currentCompany,
  };
};

export const ProjectList = connect(mapStateToProps, {
  getProjectsIndividual,
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
  getAllProjects,
})(withRouter(ProjectListComponent));
