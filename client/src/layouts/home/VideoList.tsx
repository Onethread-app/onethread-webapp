import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { isMobileOnly, CustomView } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { withRouter, RouteComponentProps } from 'react-router';
import Card from '@material-ui/core/Card';
import video from './../../resources/images/noVideo.png';
import { getAllVideoHistory } from '../../stores/user/Actions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { Grid, makeStyles, ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

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

interface VideoComponentProps {
  getAllVideoHistory: () => void;
  user: User;

}

export const VideoConferenceComponent = (props: VideoComponentProps & RouteComponentProps) => {
  const classes = useStyles();

  useEffect(() => {
    props.getAllVideoHistory();
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between items-center mv4">
        <h1 className="f3-ns f5">{t('app.homepage.Video-conferences')}</h1>
        {/* <h1 className="f3-ns f5">Video Conferences</h1> */}
        <Button
          onClick={() => (props.history.push(`/video/conferences`))}
          icon="plus"
          className="pa3-ns pa2 ml2"
          style={{ background: '#0F0C4E', color: 'white', width: isMobileOnly ? '215px' : '285px' }}>
          {t('app.homepage.Create-conference')}
          {/* Create A Video Conference */}
          </Button>
      </div>
      {props.user.videos && props.user.videos.length > 0 ?
        <div className="overflow-y-auto h5">
          <CustomView condition={!isMobileOnly}>
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
          </CustomView>
          {props.user.videos.map((v: any) => {
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
                          {v.room}
                        </Typography>
                      </Paper>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Paper
                        className={classes.heading}
                        elevation={0}
                      >
                        <Typography>
                        <a href={v.link} target="_blank"  rel="noopener noreferrer" >Invitation Link: {v.link}</a>
                        </Typography>
                      </Paper>
                      <Paper
                        className={`pl4 ${classes.heading}`}
                        elevation={0}
                      >
                        <Typography>
                          Scheduled Time: {v.createdAt ? moment(v.createdAt).format('MM/DD/YYYY HH:mm:ss') : ''}
                        </Typography>
                      </Paper>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
                :
                <Card style={{ marginTop: '10px', padding: '10px' }}>
                  <Grid container>
                    <Grid item xs>
                      <div className="ml1">{v.room}</div>
                    </Grid>
                    <Grid item xs>
                      <a href={v.link} target="_blank" rel="noopener noreferrer">{v.link}</a>
                    </Grid>
                    <Grid item xs>
                      <div className="ml1">{v.createdAt ? moment(v.createdAt).format('MM/DD/YYYY HH:mm:ss') : ''}</div>
                    </Grid>
                  </Grid>
                </Card>
            );
          })}
        </div>
        :
        <div className="tc white pv4 bg-white">
          <img className={`${isMobileOnly && 'w4'}`} src={video} alt="video" />
          <h1 className="light-silver fw4 f5 f3-ns">{t('app.homepage.No-video-conference')}</h1>
          {/* <h1 className="light-silver fw4 f5 f3-ns">There's no existing Video Conference to show</h1> */}
          <h2 className="light-silver fw4 f7 f4">
            {t('app.homepage.Click-a-button')}
            {/* Simply click on 'Create Video Conference' button to create a new one */}
          </h2>
        </div>
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const VideoConference = connect(
  mapStateToProps,
  {
    getAllVideoHistory
  },
)(withRouter(VideoConferenceComponent));
