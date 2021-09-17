import React from 'react';
import { connect } from 'react-redux';

import { Toaster } from '@blueprintjs/core/lib/esm/components/toast/toaster';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Intent } from '@blueprintjs/core/lib/esm/common/intent';

import { inviteUserToSignUp } from 'stores/auth/Actions';
import { isValidEmail } from 'helpers/utils';

interface IUserInput {
  color: string;
}

interface IUserInputInternalProps extends IUserInput {
  inviteUserToSignUp: (email: string) => any;
}

export const AppToaster = Toaster.create({
  className: 'app-toaster',
  position: Position.TOP,
});

const UserInput = (props: IUserInputInternalProps) => {
  const [email, setEmail] = React.useState('');
  const handleChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      const response = await props.inviteUserToSignUp(email);
      if (response.status === 200) {
        AppToaster.show({
          message: response.data.message,
          intent: Intent.SUCCESS,
        });
      }
    } else {
      alert('Email is not valid');
    }
  };

  return (
    <div className="start-today-input-group flex items-center justify-center w-100">
      <input
        type="email"
        name="email"
        id="useremail"
        placeholder="Your email address"
        className="h-100 tc"
        onChange={handleChange}
      />
      <button
        className="h-100"
        style={{ color: props.color }}
        onClick={handleSubmit}
      >
        Get an Invite!
      </button>
    </div>
  );
};

export default connect(null, { inviteUserToSignUp })(UserInput);
