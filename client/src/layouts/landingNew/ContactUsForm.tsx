import React from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { InputGroupField } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { required } from 'components/final-form/utils';
import { saveContactForm } from '../../stores/landing/Actions';

interface ContactUsFormProps {
  title: string;
  setShowDialog: (val: boolean) => void;
}
interface ContactUsFormInternalProps extends ContactUsFormProps {
  saveContactForm: (val: any) => void;
}

export const ContactUsFormComponent = (
  props: ContactUsFormInternalProps
) => {

  const onSubmit = async (values: any) => {
    await props.saveContactForm(values);
    props.setShowDialog(false);
    return {};
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        submitError,
        hasValidationErrors,
        ...rest
      }) => (
          <form className="pa4-ns pa2" onSubmit={handleSubmit}>
            <SubmitError errorMessage={submitError} />
            <div>
              <h1 className="f5 lh-copy">{props.title}</h1>
              <div className="mb4">
                <Field<string>
                  name="name"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className="mb4">
                      <InputGroupField
                        id="name"
                        className={`br0 bb b--lightBlue`}
                        value={input.value}
                        onChange={input.onChange}
                        style={{
                          boxShadow: 'none',
                        }}
                        leftIcon="user"
                        placeHolder="Your Name*"
                      />
                    </div>
                  )}
                />
              </div>
              <div className="mb4">
                <Field<string>
                  name="email"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className="mb4">
                      <InputGroupField
                        id="email"
                        className={`br0 bb b--lightBlue`}
                        value={input.value}
                        onChange={input.onChange}
                        style={{
                          boxShadow: 'none',
                        }}
                        leftIcon="envelope"
                        placeHolder="Your Email Address*"
                      />
                    </div>
                  )}
                />
              </div>
              <div className="mb4">
                <Field<string>
                  name="message"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className="mb4">
                      <TextArea
                        id="message"
                        className="mb4 w-100"
                        placeholder="Message For Tigrow Team*"
                        style={{ resize: 'none' }}
                        rows={5}
                        growVertically={false}
                        large={true}
                        onChange={input.onChange}
                        value={input.value}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="w4 grow h2 pointer mr3"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #0fa3a3',
                  color: '#0fa3a3',
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setShowDialog(false);
                }}
              >
                cancel
            </Button>
              <Button
                className="w4 grow h2 pointer"
                style={{
                  background: '#0fa3a3',
                  outline: 'none',
                  color: 'white',
                }}
                loading={submitting}
                type="submit"
                disabled={submitting || pristine}
              >
                Save
            </Button>
            </div>
          </form>
        )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const ContactUsForm = connect(
  mapStateToProps,
  { saveContactForm }
)(ContactUsFormComponent);

