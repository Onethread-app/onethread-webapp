import React from 'react';
import { SubmitError } from 'components/final-form/SubmitError';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { EditableText, Button } from '@blueprintjs/core';

export const ActivityEditor = () => {
  const onSubmit = async (values: any) => {
    console.log(values);
    // props.setEditDescriptionDialog(false);
    // try {
    //   const response = await tigrowApi.post('accounts/forget-password', values, {
    //     'Content-Type': 'application/json'
    //   } as AxiosRequestConfig);
    //   if (response.status === 200) {
    //     props.setEmailComponentView(true);
    //   }
    //   return true;
    // } catch (error) {
    //   const err = errorMessgeHandler(error);
    //   return { [err.fieldName]: err.message };
    // }
  };
  return (
    <div>
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
            <form
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <div className="ph2 pt2 w-100 flex">
                <Field<string>
                  name="description"
                  validate={required}
                  render={({ input, meta }) =>
                    <div className={`w-70 ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                      <EditableText
                        multiline={true}
                        minLines={3}
                        maxLines={20}
                        value={input.value}
                        onChange={input.onChange}
                        className="outline"
                        placeholder=""
                      />
                      {checkError(meta) &&
                        <small className="mv3" style={{ color: 'red' }}>
                          {meta.error || meta.submitError}
                        </small>}
                    </div>
                  }
                />
                <div className="w-10 pt2 pl2">
                  <Button
                    type="submit"
                    style={{ background: '#0FA3A3', color: '#ffffff' }}
                    loading={submitting}
                    text="Send"
                    disabled={submitting || pristine}
                  />
                </div>

              </div>
            </form>
          )}
      />
    </div>

  );
};