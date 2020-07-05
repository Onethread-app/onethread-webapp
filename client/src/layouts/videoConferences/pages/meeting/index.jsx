import React from 'react';
import * as Cookies from 'js-cookie';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { withRouter } from 'react-router';
// import { connect } from 'react-redux';
=======
>>>>>>> d6893708... implemented video conferences using agora (#228)
=======
>>>>>>> 1059a963... implemented video conferences using agora
=======
import { withRouter } from 'react-router';
// import { connect } from 'react-redux';
>>>>>>> 1d9824de... Bugfix/controller (#259)

import './meeting.css';
import AgoraVideoCall from '../../components/AgoraVideoCall';
import { AGORA_APP_ID } from '../../agora.config';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// import { getVideoConferencesJoinee } from 'stores/auth/Actions';
=======
>>>>>>> d6893708... implemented video conferences using agora (#228)
=======
>>>>>>> 1059a963... implemented video conferences using agora
=======
// import { getVideoConferencesJoinee } from 'stores/auth/Actions';
>>>>>>> 1d9824de... Bugfix/controller (#259)

class Meeting extends React.Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const query = new URLSearchParams(props.history.location.search);
    const room = query.get('conf');
    this.videoProfile =
      (Cookies.get('videoProfile') &&
        Cookies.get('videoProfile').split(',')[0]) ||
      '480p_4';
    this.channel = window.atob(room);

=======
    this.videoProfile =
      Cookies.get('videoProfile').split(',')[0] || '480p_4';
    this.channel = Cookies.get('channel') || 'test';
>>>>>>> d6893708... implemented video conferences using agora (#228)
=======
    this.videoProfile =
      Cookies.get('videoProfile').split(',')[0] || '480p_4';
    this.channel = Cookies.get('channel') || 'test';
>>>>>>> 1059a963... implemented video conferences using agora
=======
    const query = new URLSearchParams(props.history.location.search);
    const room = query.get('conf');
    this.videoProfile =
      (Cookies.get('videoProfile') &&
        Cookies.get('videoProfile').split(',')[0]) ||
      '480p_4';
    this.channel = window.atob(room);

>>>>>>> 1d9824de... Bugfix/controller (#259)
    this.transcode = Cookies.get('transcode') || 'interop';
    this.attendeeMode = Cookies.get('attendeeMode') || 'video';
    this.baseMode = Cookies.get('baseMode') || 'avc';
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert('Get App ID first!');
    }
    this.uid = undefined;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)

    this.state = {
      showInvitaion: true,
    };
  }

  componentDidMount() {
    // this.props.getVideoConferencesJoinee();
<<<<<<< HEAD
  }

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
        <button className="invite-btn" onClick={this.joinMeeting}>
          Please Click to Join
        </button>
      </div>
    );

    return (
      <>
        <div className="wrapper meeting">
          {this.state.showInvitaion ? inviatationFrame : videoFrame}
        </div>
      </>
=======
=======
>>>>>>> 1059a963... implemented video conferences using agora
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
  }

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
<<<<<<< HEAD
>>>>>>> d6893708... implemented video conferences using agora (#228)
=======
>>>>>>> 1059a963... implemented video conferences using agora
    );

    const inviatationFrame = (
      <div className="invitation-frame">
        <button className="invite-btn" onClick={this.joinMeeting}>
          Please Click to Join
        </button>
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
export default withRouter(Meeting);

// const mapStateToProps = (state) => {
//   return {
//     user: state.userReducer.user,
//   };
// };

// export default connect(mapStateToProps, {
//   getVideoConferencesJoinee,
// })(withRouter(Meeting));
<<<<<<< HEAD
=======
export default Meeting;
>>>>>>> d6893708... implemented video conferences using agora (#228)
=======
export default Meeting;
>>>>>>> 1059a963... implemented video conferences using agora
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
