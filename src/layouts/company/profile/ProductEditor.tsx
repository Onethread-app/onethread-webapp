import React from 'react';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { DropdownField } from 'components/fields/DropdownField';
import { InputGroupField } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
interface ProductEditProps {
  setShowDialog: (val: boolean) => void;
  showDialog: boolean;
}

export const ProductEditComponent = (props: ProductEditProps) => {

  const onSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="ph4 pt6"
          onSubmit={handleSubmit}
        >
          <SubmitError errorMessage={submitError} />
          <div>
            <h1 className="f5 lh-copy">Add Products/Services</h1>
            <div className="mb4">
              <label>Product Type</label>
              <Field<string>
                name="productType"
                render={({ input, meta }) =>
                  <DropdownField
                    id="productType"
                    selectedValue={input.value}
                    options={
                      [{ _id: 'cosmetics', name: 'cosmetics' },
                      { _id: 'electronics', name: 'electronics' },
                      { _id: 'vegetables', name: 'vegetables' }]
                    }
                    onChange={input.onChange}
                    className="bn"
                  />
                }
              />
            </div>
            <div className="mb4">
              <label>Product Sub Categories</label>
              <Field<string>
                name="productSubCategories"
                render={({ input, meta }) =>
                  <DropdownField
                    id="productSubCategories"
                    selectedValue={input.value}
                    options={
                      [{ _id: 'cosmetics', name: 'cosmetics' },
                      { _id: 'electronics', name: 'electronics' },
                      { _id: 'vegetables', name: 'vegetables' }]
                    }
                    onChange={input.onChange}
                    className="bn"
                  />
                }
              />
            </div>
            <div className="mb4">
              <label>Product Name</label>
              <Field<string>
                name="productName"
                render={({ input, meta }) =>
                  <div className="mb4">
                    <InputGroupField
                      id="productName"
                      className="mt1 bg-white"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                }
              />
            </div>
          </div>
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

export const ProductEdit = connect(null, null)(ProductEditComponent);