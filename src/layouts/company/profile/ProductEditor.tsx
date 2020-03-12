import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { isEmpty } from 'lodash';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
interface IProductEditProps {
  setShowDialog: (val: boolean) => void;
}

const ProductEditComponent = (props: IProductEditProps) => {

  const onSubmit = async (values: any) => {
    if (isEmpty(values.product)) {
      values.product = '';
    }
    // const response = await props.editInfoAction(values);
    // if (response.message === 200) {
    //   props.setShowDialog(false);
    //   return true;
    // }
    // return { [response.fieldName]: response.message };
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          product: ''
        }}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            className="ph4 pt6"
            onSubmit={handleSubmit}
          >
            <SubmitError errorMessage={submitError} />
            <h1 className="f5 lh-copy white pb4">Add Products/Services</h1>
            <Field<string>
              name="product"
              validate={maxValue(32)}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Project/Service Name</label>
                  <InputGroupFieldWithError
                    id="product"
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
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const ProductEdit = connect(mapStateToProps, null)(ProductEditComponent);