import { User } from 'stores/user/Reducer';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { editUserInfoAction } from 'stores/user/Actions';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError } from 'components/final-form/utils';

import warningIcon from './../../../resources/images/warningIcon.png';
import { isEmpty } from 'lodash';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
interface IPositionEditProps {
  setShowDialog: (val: boolean) => void;
}
interface IPositionEditInternalProps extends IPositionEditProps {
  editInfoAction: (val: User) => any;
  user: User;
}

const PositionEditComponent = (props: IPositionEditInternalProps) => {

  const onSubmit = async (values: any) => {
    if (isEmpty(values.position)) {
      values.position = '';
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
        position: props.user.position
      }}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="ph2 pt6"
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
          <h1 className="f5 lh-copy white">Position</h1>
          <Field<string>
            name="position"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="position"
                  className="mt1 ba"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none'
                  }}
                  error={checkError(meta) && (meta.error || meta.submitError)}
                />
              </div>
            }
          />
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

export const PositionEditor = connect(mapStateToProps, { editInfoAction: editUserInfoAction })(PositionEditComponent);