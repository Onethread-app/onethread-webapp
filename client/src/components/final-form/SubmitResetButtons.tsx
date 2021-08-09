import React from 'react';
import { Button } from '@blueprintjs/core';

interface ISubmitAndResetButtonsProps {
  reset: (initialValues?: object | undefined) => void;
  submitting: boolean;
  pristine: boolean;
  resetBtnName: string;
  submitBtnName: string;
}

export const SubmitAndResetButtons = (
  props: ISubmitAndResetButtonsProps,
) => (
  <div className="flex justify-end mt4">
    <Button
      icon="refresh"
      className="grow h2 pointer white bp3-minimal w4 mr3"
      style={{
        background: '#fff',
        outline: 'none',
        border: '1px solid #34b3e9',
        color: '#34b3e9',
      }}
      onClick={props.reset}
      disabled={props.submitting || props.pristine}
    >
      {props.resetBtnName}
    </Button>
    <Button
      className="grow h2 pointer white bp3-minimal w4"
      style={{
        background: '#34b3e9',
        outline: 'none',
        color: 'white',
      }}
      loading={props.submitting}
      type="submit"
      disabled={props.submitting || props.pristine}
    >
      {props.submitBtnName}
    </Button>
  </div>
);
