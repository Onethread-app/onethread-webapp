import React from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router';

import './meeting.css';
import AgoraVideoCall from '../../components/AgoraVideoCall';
import { AGORA_APP_ID } from '../../agora.config';

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(props.history.location.search);
    const room = query.get('conf');
    this.videoProfile =
      Cookies.get('videoProfile').split(',')[0] || '480p_4';
    this.channel = window.atob(room);

    this.transcode = Cookies.get('transcode') || 'interop';
    this.attendeeMode = Cookies.get('attendeeMode') || 'video';
    this.baseMode = Cookies.get('baseMode') || 'avc';
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert('Get App ID first!');
    }
    this.uid = undefined;
  }

  render() {
    return (
      <div className="wrapper meeting">
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
      </div>
    );
  }
}

export default withRouter(Meeting);
