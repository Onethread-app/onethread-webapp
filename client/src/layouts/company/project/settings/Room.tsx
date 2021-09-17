import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { SubmitError } from 'components/final-form/SubmitError';

const RoomPageComponent = (props: any) => {
  const { t } = useTranslation();
  const [disabled] = React.useState(false);

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
            <p className="b f5 mb3">
              {t('app.project.Project-teammates.Admins')}
            </p>
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
                      value="addRemoveMemberRoom"
                      disabled={disabled}
                    />
                    Add/Remove Members in Room
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
                      value="createUpdateRoom"
                      disabled={disabled}
                    />
                    Create/Update Room
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
                      value="archiveRoom"
                      disabled={disabled}
                    />
                    Archive Room
                  </label>
                )}
              />
            </div>
            {disabled === false ? (
              <div>
                <Button
                  className="w4 grow h2 pointer"
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
              </div>
            ) : undefined}
          </form>
        )}
      />
    </div>
  );
};

export const RoomPage = connect(null, null)(RoomPageComponent);
