import { User } from 'stores/user/Reducer';
import { EditableText, Divider, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { editUserInfoAction } from 'stores/user/Actions';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError } from 'components/final-form/utils';

import warningIcon from './../../../resources/images/warningIcon.png';
import { isEmpty } from 'lodash';
interface AboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
}
interface AboutEditInternalProps extends AboutEditComponentProps {
  editInfoAction: (val: User) => any;
  user: User;
}

const AboutEditComponent = (props: AboutEditInternalProps) => {

  const onSubmit = async (values: any) => {
    if (isEmpty(values.about)) {
      values.about = '';
    }
    const response = await props.editInfoAction(values);
    if (response.message === 200) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        about: props.user.about
      }}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="fl w-100 ph2 pt6"
          onSubmit={handleSubmit}
        >
          <div>
            <Field
              name="network"
              subscription={{
                touched: true,
                error: true,
                submitError: true,
                dirtySinceLastSubmit: true
              }}
              render={({ meta }) =>
                checkError(meta) && (
                  <div
                    className="flex"
                    style={{
                      backgroundColor: '#FCEBEB', paddingLeft: '10px', paddingTop: '10px'
                    }}>
                    <span className="bp3-icon">
                      <img
                        src={warningIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                    <p style={{ color: '#962414', paddingLeft: '10px' }}>{meta.error || meta.submitError}</p>
                  </div>
                )
              }
            />
            <Field
              name="authError"
              subscription={{
                touched: true,
                error: true,
                submitError: true,
                dirtySinceLastSubmit: true
              }}
              render={({ meta }) =>
                checkError(meta) && (
                  <div
                    className="flex"
                    style={{
                      backgroundColor: '#FCEBEB', paddingLeft: '10px', paddingTop: '10px'
                    }}>
                    <span className="bp3-icon">
                      <img
                        src={warningIcon}
                        width="20px"
                        height="20px"
                        color="#0fa3a3"
                      />
                    </span>
                    <p style={{ color: '#962414', paddingLeft: '10px' }}>{meta.error || meta.submitError}</p>
                  </div>
                )
              }
            />
          </div>
          <h1 className="f5 lh-copy white">About</h1>
          <Field<string>
            name="about"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <EditableText
                  className="mb4 bg-white black"
                  multiline={true}
                  minLines={3}
                  maxLines={20}
                  value={input.value}
                  onChange={input.onChange}
                />
                {checkError(meta) &&
                  <small className="mv3" style={{ color: 'red' }}>
                    {meta.error || meta.submitError}
                  </small>}
              </div>
            }
          />
          <Divider />
          <div className="flex justify-end">
            <Button className="w4 grow h2 pointer mr3"
              style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
              </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
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
    user: state.userReducer.user
  };
};

export const AboutEdit = connect(mapStateToProps, { editInfoAction: editUserInfoAction })(AboutEditComponent);