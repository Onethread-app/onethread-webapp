import React from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router';
import { Button } from '@blueprintjs/core';

import './meeting.css';
import AgoraVideoCall from '../../components/AgoraVideoCall';
import { AGORA_APP_ID } from '../../agora.config';

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(props.history.location.search);
    const room = query.get('conf');
    this.videoProfile =
      (Cookies.get('videoProfile') &&
        Cookies.get('videoProfile').split(',')[0]) ||
      '480p_4';
    this.channel = window.atob(room);

    this.transcode = Cookies.get('transcode') || 'interop';
    this.attendeeMode = Cookies.get('attendeeMode') || 'video';
    this.baseMode = Cookies.get('baseMode') || 'avc';
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert('Get App ID first!');
    }
    this.uid = undefined;

    this.state = {
      showInvitaion: true,
    };
  }

  componentDidMount() {}

  joinMeeting = () => {
    this.setState({ showInvitaion: false });
  };

  render() {
    const videoFrame = (
      <div className="ag-main">
        <div className="ag-container">
          <AgoraVideoCall
            videoProfile={this.videoProfile}
            channel={this.channel}
            transcode={this.transcode}
            attendeeMode={this.attendeeMode}
            baseMode={this.baseMode}
            appId={this.appId}
            uid={this.uid}
          />
        </div>
      </div>
    );

    const inviatationFrame = (
      <div className="invitation-frame">
        <div className="header">
          <h2>You are invited to join room - {this.channel}</h2>
        </div>
        <Button
          onClick={this.joinMeeting}
          className="pa3-ns pa2 ml2"
          style={{
            background: '#0F0C4E',
            color: 'white',
            width: '285px',
          }}
        >
          Please Click to Join
        </Button>
      </div>
    );

    return (
      <>
        <div className="wrapper meeting">
          {this.state.showInvitaion ? inviatationFrame : videoFrame}
        </div>
      </>
    );
  }
}

export default withRouter(Meeting);
