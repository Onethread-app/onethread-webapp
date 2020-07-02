import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Icon, Dialog, Button } from '@blueprintjs/core';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { getProjectsIndividual } from 'stores/project/Actions';
import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { CompanySignupForm } from 'layouts/company/Form';
import { isMobileOnly } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { IMember } from 'stores/project/Reducer';
import { getNotifications } from '../../stores/notifications/Action';
import { getCompanyDetails } from 'stores/company/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import { addSpace } from 'stores/UtilsActions';
import { ICompanyResponse } from 'stores/company/Reducer';
import { Grid, makeStyles, ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import company from './../../resources/images/noCompany.png';
import project from './../../resources/images/noProject.png';
import video from './../../resources/images/noVideo.png';
import { ProjectAdd } from './CreateProjectForm';
import { isEqual } from 'lodash';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { getAllVideoHistory } from '../../stores/user/Actions';

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
interface HomePageComponentProps {
  currentCompany: string;
  getAllCompaniesByUserId: (userId: string) => void;
  getProjectsIndividual: () => void;
  getNotifications: () => void;
  getCompanyDetails: (companyId: string, history: History) => void;
  getAllVideoHistory: () => void;
  user: User;
  project: IMember[];
  
}

export const HomePageComponent = (props: HomePageComponentProps & RouteComponentProps) => {
  const classes = useStyles();

  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const [searchProjects, setSearchProjects] = useState('');

  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const load = async () => {
    await props.getAllCompaniesByUserId(props.user._id);
    await props.getProjectsIndividual();
  };

  useEffect(() => {
    props.getAllVideoHistory();
    load();
  }, []);

  return (
    <>
      <div className="pt5 pt0-ns" style={{ background: '#0F0C4E' }}>
        <div className="pa4-ns pa2">
          {props.user.companies && props.user.companies.length > 0 ?
            <>
              <h1 className="f3-ns f5 white pt4">Places You Work</h1>
              <div className="flex">
                <div className="overflow-x-auto w-85 pv1"
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'column'
                  }}>
                  <>
                    {props.user.companies.map((c) => (<article className={`ma2-ns ma1 pointer ${
                      props.currentCompany === c.company._id
                        ? 'bg-black-20'
                        : ''
                      }`}
                      style={{ width: isMobileOnly ? '160px' : '245px' }}
                      onClick={async () => {
                        props.getNotifications();
                        const response = (await props.getCompanyDetails(
                          c.company.uniqueName,
                          props.history,
                        )) as any;
                        if (response.status === 200) {
                          dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
                          props.history.push(
                            `/company/${
                              (response as ICompanyResponse).data.company.uniqueName
                            }/dashboard`,
                          );
                        }
                      }}
                    >
                      <div className="bg-white pt3 tc"
                      style={{height: isMobileOnly ? '5.5rem' : '8rem'}}>
                        <img
                          className="br-100"
                          src={
                            c.company.logo ? c.company.logo : CompanyIcon
                          }
                          alt="user"
                          style={{
                            width: isMobileOnly ? '60px' : '80px',
                            height: isMobileOnly ? '60px' : '80px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div className="tc">
                        <h1 className="f6 f5-ns lh-title white ws-break">
                          {c.company.name}{' '}
                        </h1>
                        <h2 className="f6-ns f7 fw4 mt0 mb0 white ws-break">{`Role: ${addSpace(c.role)}`}</h2>
                      </div>
                    </article>
                    ))
                    }
                  </>
                </div>
                <div className="flex flex-column">
                  <div className="pointer tc b--dotted b--light-gray ml4-ns ml2 w-15 pt3 pt0-ns"
                    style={{
                      width: isMobileOnly ? '110px' : '215px',
                      marginTop: '13px',
                      height: isMobileOnly ? '5rem' : '8rem'
                    }}
                    onClick={() => setShowDialog(!showDialog)}
                  >
                    <Icon
                      icon="plus"
                      iconSize={isMobileOnly ? 25 : 60}
                      color="white"
                    />
                    <h1 className="f6-ns f7 white db-ns dn">Create a Company</h1>
                  </div>
                  <h1 className="ml2 f7 white db dn-ns">Create a Company</h1>
                </div>
              </div>
            </>
            :
            (
              <div className="flex-ns ph6-ns w-100">
                <div className="w-40-ns db-ns dn">
                  <img
                    src={company}
                    alt="company"
                  />
                </div>
                <article className="w-60-ns w-100 pa3 pa0-ns">
                  <h1 className="white f2-ns f3 fw6">Add a company to get started with all of your projects</h1>
                  <h3 className="white fw3 f4-ns f5">
                    Or, want to join an existing company? Ask your peer to add you at his/her company at TiGrow
                  </h3>
                  <Button
                    onClick={() => setShowDialog(!showDialog)}
                    className="pa3-ns pa2 f5-ns fw6 br2"
                    style={{ color: '#0F0C4E' }}>
                    Create A Company
                  </Button>
                </article>
              </div>
            )
          }
        </div>
        <div className="pa4-ns pa2 br4" style={{ background: '#F6F7FB' }}>
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
              <Button
                onClick={() => (setShowProjectDialog(true))}
                icon="plus"
                className="pa3-ns pa2 ml2"
                style={{ background: '#0F0C4E', color: 'white', width: isMobileOnly ? '180px' : '285px' }}>
                Start A New Project
              </Button>
            </div>
          </div>
          {props.project && props.project.length > 0 ?
            <div className="overflow-y-auto h5">
              <Grid container >
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
              {searchProjects ?
                (
                  props.project.filter(item => isEqual(item.name, searchProjects)).map(
                    filteredProjects => (
                      <Card style={{ marginTop: '10px', padding: '10px' }}>
                        <Grid container >
                          <Grid item xs>
                            <div className="ml1">{filteredProjects.name}</div>
                          </Grid>
                          <Grid item xs>
                            <div className="ml1">{filteredProjects.type}</div>
                          </Grid>
                          <Grid item xs>
                            <div className="ml1">
                              {filteredProjects.concernedAdmin.firstName}
                              {filteredProjects.concernedAdmin.lastName}
                            </div>
                          </Grid>
                        </Grid>
                      </Card>
                    ))
                )
                : (props.project.map((p) => {
                  return (
                    isMobileOnly ? 
                      <div className="mt2">
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
                          <ExpansionPanelDetails>
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
                              <Typography>Lead: {p.concernedAdmin.firstName}{p.concernedAdmin.lastName}</Typography>
                            </Paper>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>
                    :
                    <Card style={{ marginTop: '10px', padding: '10px' }}>
                      <Grid container >
                        <Grid item xs>
                          <div className="ml1">{p.name}</div>
                        </Grid>
                        <Grid item xs>
                          <div className="ml1">{p.type}</div>
                        </Grid>
                        <Grid item xs>
                          <div className="ml1">{p.concernedAdmin.firstName}{p.concernedAdmin.lastName}</div>
                        </Grid>
                      </Grid>
                    </Card>
                  );
                }))}
            </div>
            :
            (
              <div className="white pv4 tc bg-white">
                <img className={`${isMobileOnly && 'w4'}`} src={project} alt="project" />
                <h1 className="light-silver fw4 f5 f3-ns">There's no existing project to show</h1>
                <h2 className="light-silver fw4 f7 f4">
                  Simply click on 'Start a New Project' button to create a new one
                </h2>
              </div>
            )
          }
          <div className="flex justify-between items-center mv4">
            <h1 className="f3-ns f5">Video Conferences</h1>
            <Button
              onClick={() => (props.history.push(`/video/conferences`))}
              icon="plus"
              className="pa3-ns pa2 ml2"
              style={{ background: '#0F0C4E', color: 'white', width: isMobileOnly ? '215px' : '285px' }}>
              Create A Video Conference
          </Button>
          </div>
          {props.user.videos && props.user.videos.length > 0 ?
            <div className="overflow-y-auto h5">
              <Grid container>
                <Grid item xs>
                  <div className="b">Name</div>
                </Grid>
                <Grid item xs>
                  <div className="b">Invitation Link</div>
                </Grid>
                <Grid item xs>
                  <div className="b">Scheduled Time</div>
                </Grid>
              </Grid>
              {props.user.videos.map((v: any) => {
                return (
                  <Card style={{ marginTop: '10px', padding: '10px' }}>
                    <Grid container>
                      <Grid item xs>
                        <div className="ml1">{v.room}</div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">{v.link}</div>
                      </Grid>
                      <Grid item xs>
                        <div className="ml1">{v.createdAt}</div>
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
            </div>
            :
            <div className="tc white pv4 bg-white">
              <img className={`${isMobileOnly && 'w4'}`} src={video} alt="video" />
              <h1 className="light-silver fw4 f5 f3-ns">There's no existing Video Conference to show</h1>
              <h2 className="light-silver fw4 f7 f4">
                Simply click on 'Create Video Conference' button to create a new one
              </h2>
            </div>
          }
        </div>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
      {showProjectDialog && (
        <Dialog
          onClose={() => setShowDialog(!showProjectDialog)}
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
    user: state.userReducer.user,
    project: state.projectReducer.projectList,
    currentCompany: state.companyReducer.currentCompany._id
  };
};

export const HomePageNew = connect(
  mapStateToProps,
  {
    getAllCompaniesByUserId,
    getProjectsIndividual,
    getNotifications,
    getCompanyDetails,
    getAllVideoHistory
  },
)(withRouter(HomePageComponent));
