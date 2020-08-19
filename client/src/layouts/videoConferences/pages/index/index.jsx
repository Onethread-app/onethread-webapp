import React from 'react';
import * as Cookies from 'js-cookie';
import { withRouter } from 'react-router';
// import Pusher from 'pusher-js';

import '../../assets/fonts/css/icons.css';
import Validator from '../../utils/Validator';
import './index.css';
import Axios from 'axios';
import { tokenConfig } from 'stores/UtilsActions';
import { server } from 'config';

class Index extends React.Component {
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
    const host =
      process.env.PUBLIC_URL || `${document.location.host}/`;
    const link =
      host + 'vc/join/?conf=' + window.btoa(this.state.channel);

    const headers = tokenConfig();

    Axios.post(
      `${server}video-conferences/save-record`,
      { link: link, name: this.state.channel },
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
      <div className="video-conferences">
        <div className="vc-main">
          <section className="vc-login-wrapper">
            <div className="vc-login-header">
              {/* <p className="vc-login-title">
                <b>Video Conferences</b>
              </p> */}
              <p className="vc-login-subtitle">
                <b>Empowering remote teams</b>
              </p>
            </div>
            <div className="vc-login-body">
              <div className="vc-team-input">
                <InputChannel
                  onChange={this.handleChannel}
                  placeholder="Enter team name"
                ></InputChannel>
              </div>
            </div>
            <div className="conf-link">
              {this.state.confLink && (
                <h3>
                  <a
                    href={this.state.confLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {this.state.confLink}
                  </a>
                </h3>
              )}
            </div>
            <div className="vc-login-footer">
              <div
                id="joinBtn"
                onClick={this.handleJoin}
                disabled={!this.state.joinBtn}
                className="vc-join-btn"
                href="button"
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

class InputChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
      state: '',
    };
  }

  validate = (val) => {
    this.setState({
      state: '',
      errorMsg: '',
    });
    if (Validator.isNonEmpty(val.trim())) {
      this.setState({
        errorMsg: 'Cannot be empty!',
        state: 'is-danger',
      });
      return false;
    } else if (Validator.minLength(val.trim(), 1)) {
      this.setState({
        errorMsg: 'No shorter than 1!',
        state: 'is-danger',
      });
      return false;
    } else if (Validator.maxLength(val.trim(), 16)) {
      this.setState({
        errorMsg: 'No longer than 16!',
        state: 'is-danger',
      });
      return false;
    } else if (Validator.validChar(val.trim())) {
      this.setState({
        state: 'is-danger',
        errorMsg:
          'Only capital or lower-case letter, number and "_" are permitted!',
      });
      return false;
    } else {
      this.setState({
        state: 'is-success',
      });
      return true;
    }
  };

  handleChange = (e) => {
    let state = this.validate(e.target.value);
    this.props.onChange(e.target.value, state);
  };

  render() {
    let validateIcon = '';
    switch (this.state.state) {
      default:
      case '':
        validateIcon = '';
        break;
      case 'is-success':
        validateIcon = <i className="ag-icon ag-icon-valid"></i>;
        break;
      case 'is-danger':
        validateIcon = <i className="ag-icon ag-icon-invalid"></i>;
        break;
    }

    return (
      <div className="channel-wrapper control">
        <input
          onInput={this.handleChange}
          id="channel"
          className={'ag-rounded input ' + this.state.state}
          type="text"
          placeholder={this.props.placeholder}
        />
        <span className="validate-icon">{validateIcon}</span>
        <div className="validate-msg">{this.state.errorMsg}</div>
      </div>
    );
  }
}

export default withRouter(Index);
