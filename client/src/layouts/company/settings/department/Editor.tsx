import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { addDepartment } from 'stores/company/Actions';

import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface DepartmentEditorProps {
  setShowDialog: (val: boolean) => void;
}
interface DepartmentEditorInternalProps
  extends DepartmentEditorProps {
  addDepartment: (val: string) => any;
  isCompanyLoading: boolean;
}

const DepartmentEditorComponent = (
  props: DepartmentEditorInternalProps,
) => {
  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    const response = await props.addDepartment(values.name);
    if (response && props.isCompanyLoading === false) {
      props.setShowDialog(false);
    }
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
        <form className="ph4 pv2" onSubmit={handleSubmit}>
          <h1 className="f5 lh-copy tigrow-lightBlue">
            {t('app.company.Departments.Add-department')}
          </h1>
          <div className="mw9 center mb2">
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name="name"
            validate={maxValue(32)}
            render={({ input, meta }) => (
              <div className={`${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="name"
                  placeHolder={t(
                    'app.company.Departments.Add-department',
                  )}
                  className={`bb ${
                    checkError(meta) ? 'b--red' : 'b--lightBlue'
                  }`}
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon="comparison"
                  style={{
                    boxShadow: 'none',
                  }}
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                />
              </div>
            )}
          />
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
    isCompanyLoading: state.companyReducer.loading,
  };
};
export const DepartmentEditor = connect(mapStateToProps, {
  addDepartment,
})(DepartmentEditorComponent);
