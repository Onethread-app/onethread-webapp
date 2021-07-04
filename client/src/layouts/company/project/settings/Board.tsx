import React from 'react';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

const BoardPageComponent = (props: any) => {
  const [disabled] = React.useState(false);
  const { t } = useTranslation();

  return (
    <div className="bl b--black-05 bw1 pl5 ml5 h5">
      <p>room</p>
      <Form
        onSubmit={props.onSubmit}
        initialValues={{ optionalRole: props.optionalRole }}
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
          <form className="fl w-100" onSubmit={handleSubmit}>
            <div className="mb3">
              <SubmitError errorMessage={submitError} />
            </div>
            <p className="b f5 mb3">{t('app.project.Project-teammates.Admins')}</p>
            {/* <p className="b f5 mb3">Admins</p> */}
            <div className="mb3">
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="createUpdateBoard"
                      disabled={disabled}
                    />
                    Create/Update Board
                  </label>
                )}
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="createUpdateColumn"
                      disabled={disabled}
                    />
                    Create/Update Column
                  </label>
                )}
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="assignDeleteMemberBoard"
                      disabled={disabled}
                    />
                    Assign/Delete Board Members
                  </label>
                )}
              />
            </div>
            {disabled === false ? (
              <div>
                <Button
                  className="w4 grow h2 pointer"
                  style={{
                    background: '#3F61C5',
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
            ) : undefined}
          </form>
        )}
      />
    </div>
  );
};

export const BoardPage = connect(null, null)(BoardPageComponent);
