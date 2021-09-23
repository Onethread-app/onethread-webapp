import { Component } from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router';
// import Pusher from 'pusher-js';

import '../../assets/fonts/css/icons.css';
import './index.css';
import Axios from 'axios';
import { tokenConfig } from 'stores/UtilsActions';
import { server } from 'config';
import { InputChannel } from './InputChannel';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinBtn: false,
      channel: '',
      baseMode: 'avc',
      transcode: 'interop',
      attendeeMode: 'video',
      videoProfile: '480p_4',
      confLink: null,
    };
  }

  componentDidMount() {
    window.addEventListener('keypress', (e) => {
      e.keyCode === 13 && this.handleJoin();
    });
  }

  handleChannel = (val, state) => {
    this.setState({
      channel: val,
      joinBtn: state,
    });
  };

  handleJoin = () => {
    if (!this.state.joinBtn) {
      return;
    }
    Cookies.set('channel', this.state.channel);
    Cookies.set('baseMode', this.state.baseMode);
    Cookies.set('transcode', this.state.transcode);
    Cookies.set('attendeeMode', this.state.attendeeMode);
    Cookies.set('videoProfile', this.state.videoProfile);
    const host = process.env.PUBLIC_URL || `${document.location.host}/`;
    const link = `${host}/vc/join/?conf=${window.btoa(this.state.channel)}`;

    const headers = tokenConfig();

    Axios.post(
      `${server}video-conferences/save-record`,
      { link, name: this.state.channel },
      headers,
    )
      .then((res) => {
        this.setState({ confLink: link });
      })
      .catch((err) => {
        // console.log(err)
      });

    // this.props.history.push('/video/conferences/join');
  };

  render() {
    return (
      <div className='video-conferences'>
        <div className='vc-main'>
          <section className='vc-login-wrapper'>
            <div className='vc-login-header'>
              {/* <p className="vc-login-title">
                <b>Video Conferences</b>
              </p> */}
              <p className='vc-login-subtitle'>
                <b>Empowering remote teams</b>
              </p>
            </div>
            <div className='vc-login-body'>
              <div className='vc-team-input'>
                <InputChannel
                  onChange={this.handleChannel}
                  placeholder='Enter team name'
                />
              </div>
            </div>
            <div className='conf-link'>
              {this.state.confLink && (
                <h3>
                  <a
                    href={this.state.confLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {this.state.confLink}
                  </a>
                </h3>
              )}
            </div>
            <div className='vc-login-footer'>
              <div
                id='joinBtn'
                onClick={this.handleJoin}
                disabled={!this.state.joinBtn}
                className='vc-join-btn'
                href='button'
              >
                Create link
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default withRouter(Index);
