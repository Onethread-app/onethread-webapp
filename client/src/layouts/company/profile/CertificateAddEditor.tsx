import { Button, TextArea } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { addCertificate } from 'stores/company/Actions';

interface ICertificateAddProps {
  setShowDialog: (val: boolean) => void;
  addCertificate: (certificate: {}) => any;
}

const CertificateAddComponent = (props: ICertificateAddProps) => {
  const onSubmit = async (values: any) => {
    const res = await props.addCertificate(values);
    if (res === 201) {
      props.setShowDialog(false);
    }
  };

  return (
    <>
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
            <h1 className="f5 lh-copy white pb4">Certifications</h1>
            <Field<string>
              name="name"
              validate={maxValue(32)}
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>Certification Name</label>
                  <InputGroupFieldWithError
                    id="name"
                    className="mt1 ba"
                    value={input.value}
                    onChange={input.onChange}
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
            <Field<string>
              name="description"
              render={({ input, meta }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <label>Description</label>
                  <TextArea
                    id="description"
                    className="mt1"
                    value={input.value}
                    onChange={input.onChange}
                    style={{
                      resize: 'none',
                      minHeight: '50px',
                      maxHeight: '150px',
                    }}
                    fill={true}
                    growVertically={true}
                  />
                  {checkError(meta) && (
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}
                    </small>
                  )}
                </div>
              )}
            />
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
    </>
  );
};

export const CertificateAdd = connect(null, { addCertificate })(
  CertificateAddComponent,
);
