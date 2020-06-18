import React from 'react';
import {
  Icon,
  Button,
  InputGroup,
  TextArea,
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import {
  required,
  checkError,
  composeValidators,
  isEmail,
} from 'components/final-form/utils';
import { IconNames } from '@blueprintjs/icons';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { isEqual } from 'lodash';
import { FORM_ERROR } from 'final-form';

interface VideoCallRequestProps {
  setShowVideoCallDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const VideoCallRequest = (props: VideoCallRequestProps) => {
  const onSubmit: any = async (values: any) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.post(
          `contact/contact-sale`,
          values,
          headers,
        );
        if (response.status === 201) {
          props.setShowVideoCallDialog(false);
        }
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        return { [FORM_ERROR]: 'Network Error' };
      }
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return {};
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        name: '',
        email: '',
        subject: 'Video call request',
        message: '',
      }}
      render={({
        handleSubmit,
        submitting,
        pristine,
        submitError,
      }) => (
        <div className="ph4">
          <div className="flex justify-end pt2 pb2">
            <Icon
              icon={IconNames.DELETE}
              iconSize={20}
              className="grow pointer"
              style={{
                marginRight: '-16px',
                color: '#707070',
              }}
              onClick={(e: any) =>
                props.setShowVideoCallDialog(false)
              }
            />
          </div>
          <h3 className="mv0 tc fw6 c-tigrowViolet">
            Please fill in your requirement, Our Sales Team will
            contact you
          </h3>
          <form className="fl w-100 pt0" onSubmit={handleSubmit}>
            <h4 className="c-tigrowViolet mb1">Name</h4>
            <Field<string>
              name="name"
              validate={required}
              render={({ input, meta }) => (
                <div>
                  <InputGroup
                    id={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                    className={`br2 ${
                      checkError(meta)
                        ? 'ba b--red'
                        : 'ba b--tigrowGray'
                    }`}
                    style={{ boxShadow: 'none' }}
                  />
                  {checkError(meta) && (
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  )}
                </div>
              )}
            />
            <h4 className="c-tigrowViolet mb1">Email</h4>
            <Field<string>
              name="email"
              validate={composeValidators(required, isEmail)}
              render={({ input, meta }) => (
                <div>
                  <InputGroup
                    id={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                    className={`br2 ${
                      checkError(meta)
                        ? 'ba b--red'
                        : 'ba b--tigrowGray'
                    }`}
                    style={{ boxShadow: 'none' }}
                  />
                  {checkError(meta) && (
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  )}
                </div>
              )}
            />
            <h4 className="c-tigrowViolet mb1">
              For how many persons do you want this solution?
            </h4>
            <Field<string>
              name="message"
              validate={required}
              render={({ input, meta }) => (
                <div>
                  <TextArea
                    growVertically={true}
                    fill={true}
                    id={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                    className={`br2 ${
                      checkError(meta)
                        ? 'ba b--red'
                        : 'ba b--tigrowGray'
                    }`}
                    style={{
                      boxShadow: 'none',
                      height: '87px',
                      resize: 'none',
                    }}
                  />
                  {checkError(meta) && (
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  )}
                </div>
              )}
            />
            <div className="tc">
              <Button
                className="grow h2 pointer bp3-minimal w4 mt3 br3"
                style={{
                  backgroundColor: '#43466d',
                  color: 'white',
                  outline: 'none',
                }}
                loading={submitting}
                type="submit"
                disabled={submitting || pristine}
              >
                <span className="fw6 tracked">Send</span>
              </Button>
              {submitError && (
                <div className="red mt2">{submitError}</div>
              )}
            </div>
          </form>
        </div>
      )}
    />
  );
};
