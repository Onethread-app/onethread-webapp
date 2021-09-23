import { Component } from 'react';

import Validator from '../../utils/Validator';

export class InputChannel extends Component {
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
    // eslint-disable-next-line no-else-return
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
    const state = this.validate(e.target.value);
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
        validateIcon = <i className='ag-icon ag-icon-valid' />;
        break;
      case 'is-danger':
        validateIcon = <i className='ag-icon ag-icon-invalid' />;
        break;
    }

    return (
      <div className='channel-wrapper control'>
        <input
          onChange={this.handleChange}
          id='channel'
          className={`ag-rounded input ${this.state.state}`}
          type='text'
          placeholder={this.props.placeholder}
        />
        <span className='validate-icon'>{validateIcon}</span>
        <div className='validate-msg'>{this.state.errorMsg}</div>
      </div>
    );
  }
}
