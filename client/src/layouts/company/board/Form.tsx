import React, { useState } from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button, Icon } from '@blueprintjs/core';
import { createBoard } from 'stores/board/Actions';
import { TaskBoard } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import {
  checkError,
  required,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { DropdownFieldErrorWithLabel } from 'components/fields/DropdownField';
import { Color } from 'stores/UtilsActions';
import { ICompany } from 'stores/company/Reducer';
import { isEqual } from 'lodash';

const FormComponent = (props: {
  setShowTaskBoardDialog?: (val: boolean) => void;
  createBoard: (board: TaskBoard) => void;
  departments: [];
  company: ICompany;
}) => {
  const onSubmit = async (values: any) => {
    await props.createBoard(values);
    if (props.setShowTaskBoardDialog) {
      props.setShowTaskBoardDialog(false);
    }
    return {};
  };

  const [labelColor, setLabelColor] = useState(null as any);

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>Create Board</h3>
      </div>
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
          <form onSubmit={handleSubmit}>
            <div className="pa3-ns pa2 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                  >
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      label="Board Name*"
                    />
                  </div>
                )}
              />
              <Field<string>
                name="department"
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                  >
                    <DropdownFieldErrorWithLabel
                      id={input.name}
                      selectedValue={input.value}
                      options={
                        props.departments &&
                        props.departments.length > 0
                          ? props.departments
                          : ([] as any)
                      }
                      onChange={input.onChange}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      label="Department"
                      className="bn"
                    />
                  </div>
                )}
              />
              <Field<string>
                name="color"
                render={({ input, meta }) => (
                  <div className="mb3">
                    <p
                      className="fw5 mb3"
                      style={{ fontSize: '.8rem' }}
<<<<<<< HEAD
<<<<<<< HEAD
=======
            <form onSubmit={handleSubmit}>
              <div className="pa3-ns pa2 justify-content w-100">
                <Field<string>
                  name="name"
                  validate={composeValidators(required, maxValue(32))}
                  render={({ input, meta }) => (
                    <div
                      className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                    >
                      <InputGroupFieldWithLabel
                        id="name"
                        value={input.value}
                        onChange={input.onChange}
                        style={{
                          boxShadow: 'none',
                          fontSize: '18px',
                        }}
                        error={
                          checkError(meta) &&
                          (meta.error || meta.submitError)
                        }
                        label="Board Name*"
                      />
                    </div>
                  )}
                />
                <Field<string>
                  name="department"
                  render={({ input, meta }) => (
                    <div
                      className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
                    >
                      Label
                    </p>
                    <div className="flex">
                      {Color.map((color) => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={
                              isEqual(color.code, labelColor) === true
                                ? 'tick'
                                : 'blank'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border:
                                isEqual(color.code, labelColor) ===
                                true
                                  ? '3px solid #ffffff'
                                  : 'none',
                              height: '3rem',
                              padding: '0.8rem',
                            }}
                          />
                        </div>
                      ))}
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
                  </div>
                )}
              />
              <div className="fr">
                <Button
                  className="w4 grow h2 pointer mr3"
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '1px solid #0fa3a3',
                    color: '#0fa3a3',
                  }}
                  onClick={(e: any) => {
                    if (props.setShowTaskBoardDialog) {
                      props.setShowTaskBoardDialog(false);
                    }
                  }}
                >
                  cancel
                </Button>
                <Button
                  className="grow pointer white bp3-minimal w4 mt2"
                  style={{
                    background: '#0FA3A3',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Create
<<<<<<< HEAD
=======
            <form onSubmit={handleSubmit}>
              <div className="pa3-ns pa2 justify-content w-100">
                <Field<string>
                  name="name"
                  validate={composeValidators(required, maxValue(32))}
                  render={({ input, meta }) => (
                    <div
                      className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                    >
                      <InputGroupFieldWithLabel
                        id="name"
                        value={input.value}
                        onChange={input.onChange}
                        style={{
                          boxShadow: 'none',
                          fontSize: '18px',
                        }}
                        error={
                          checkError(meta) &&
                          (meta.error || meta.submitError)
                        }
                        label="Board Name*"
                      />
                    </div>
                  )}
                />
                <Field<string>
                  name="department"
                  render={({ input, meta }) => (
                    <div
                      className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
                    >
                      Label
                    </p>
                    <div className="flex">
                      {Color.map((color) => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={
                              isEqual(color.code, labelColor) === true
                                ? 'tick'
                                : 'blank'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border:
                                isEqual(color.code, labelColor) ===
                                true
                                  ? '3px solid #ffffff'
                                  : 'none',
                              height: '3rem',
                              padding: '0.8rem',
                            }}
                          />
                        </div>
                      ))}
                    </div>
<<<<<<< HEAD
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
                  )}
                />
                <div className="fr">
                  <Button
                    className="w4 grow h2 pointer mr3"
                    style={{
                      background: '#fff',
                      outline: 'none',
                      border: '1px solid #0fa3a3',
                      color: '#0fa3a3',
                    }}
                    onClick={(e: any) => {
                      if (props.setShowTaskBoardDialog) {
                        props.setShowTaskBoardDialog(false);
                      }
                    }}
                  >
                    cancel
                  </Button>
                  <Button
                    className="grow pointer white bp3-minimal w4 mt2"
                    style={{
                      background: '#0FA3A3',
                      outline: 'none',
                      color: 'white',
                    }}
                    loading={submitting}
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    Create
<<<<<<< HEAD
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
                  </div>
                )}
              />
              <div className="fr">
                <Button
                  className="w4 grow h2 pointer mr3"
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '1px solid #0fa3a3',
                    color: '#0fa3a3',
                  }}
                  onClick={(e: any) => {
                    if (props.setShowTaskBoardDialog) {
                      props.setShowTaskBoardDialog(false);
                    }
                  }}
                >
                  cancel
                </Button>
                <Button
                  className="grow pointer white bp3-minimal w4 mt2"
                  style={{
                    background: '#0FA3A3',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Create
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany,
  };
};

export const FormBoard = connect(mapStateToProps, { createBoard })(
  FormComponent,
);
