import { connect } from 'react-redux';

import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Form, Field } from 'react-final-form';

import { ICertificates } from 'stores/company/Reducer';
import { editCertificate } from 'stores/company/Actions';

import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface ICertificateEditProps {
  setShowDialog: (val: boolean) => void;
  editCertificate: (certificate: {}, id: string) => any;
  certificate: ICertificates;
}

const CertificateEditComponent = (props: ICertificateEditProps) => {
  const onSubmit = async (values: any) => {
    const res = await props.editCertificate(
      values,
      props.certificate._id,
    );
    if (res === 200) {
      props.setShowDialog(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: props.certificate.name,
          description: props.certificate.description,
        }}
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
    </>
  );
};

export const CertificateEdit = connect(null, { editCertificate })(
  CertificateEditComponent,
);
