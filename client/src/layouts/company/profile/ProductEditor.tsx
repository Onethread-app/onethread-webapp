import React, { useEffect, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { connect, useDispatch } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { DropdownField } from 'components/fields/DropdownField';
import { InputGroupField } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { tokenConfig, Entity } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { required } from 'components/final-form/utils';
import { ADD_PRODUCT } from 'stores/company/Types';
interface ProductEditProps {
  setShowDialog: (val: boolean) => void;
  showDialog: boolean;
}

interface ProductEditInternalProps extends ProductEditProps {
  company?: ICompany;
}

export const ProductEditComponent = (
  props: ProductEditInternalProps,
) => {
  const [category, setCategory] = useState([] as Entity[]);
  const [subcategory, setSubCategory] = useState([] as Entity[]);
  const [selectcategory, setSelectedCategory] = useState('');
  const dispatch = useDispatch();

  const onSubmit = async (values: any) => {
    const headers = tokenConfig();
    try {
      const response = await tigrowApi.post(
        `category/sub-category/${values.productSubCategories}`,
        {
          name: values.name,
          company: props.company ? props.company._id : undefined,
        },
        headers,
      );
      dispatch({
        type: ADD_PRODUCT,
        payload: response.data.newSubSubCategory,
      });
      if (response.status === 201) {
        props.setShowDialog(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    async function getAPI() {
      const headers = tokenConfig();
      try {
        const response = await tigrowApi.get(
          `category?type=business-category`,
          headers,
        );
        await setCategory(response.data.categories);
      } catch (error) {}
    }
    getAPI();
  }, []);

  useEffect(() => {
    async function getAPI(_selectcategory: string) {
      const headers = tokenConfig();
      try {
        const response = await tigrowApi.get(
          `category/${_selectcategory}`,
          headers,
        );
        await setSubCategory(response.data.subcategories);
      } catch (error) {}
    }
    if (selectcategory !== '') {
      getAPI(selectcategory);
    }
  }, [selectcategory]);

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
        <form className="ph4 pt6" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <div>
            <h1 className="f5 lh-copy">Add Products/Services</h1>
            <div className="mb4">
              <label>Product Type</label>
              <Field<string>
                name="productType"
                validate={required}
                render={({ input, meta }) => (
                  <DropdownField
                    id="productType"
                    selectedValue={input.value}
                    options={category}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      input.onChange(e.target.value);
                    }}
                    className="bn"
                  />
                )}
              />
            </div>
            <div className="mb4">
              <label>Product Sub Categories</label>
              <Field<string>
                name="productSubCategories"
                validate={required}
                render={({ input, meta }) => (
                  <DropdownField
                    id="productSubCategories"
                    selectedValue={input.value}
                    options={subcategory}
                    onChange={input.onChange}
                    className="bn"
                  />
                )}
              />
            </div>
            <div className="mb4">
              <label>Product Name</label>
              <Field<string>
                name="name"
                validate={required}
                render={({ input, meta }) => (
                  <div className="mb4">
                    <InputGroupField
                      id="name"
                      className="mt1 bg-white"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                      }}
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
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
            >
              Save
            </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #34b3e9',
                color: '#34b3e9',
              }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
            </Button>
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
  };
};

export const ProductEdit = connect(
  mapStateToProps,
  null,
)(ProductEditComponent);
