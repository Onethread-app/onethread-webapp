import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { SubmitError } from 'components/final-form/SubmitError';
import { companyOptionalRole } from 'stores/company/Actions';

interface AdminRoleInternalProps {
  companyOptionalRole: (companyRole: any) => void;
  optionalRole: string[];
  companyRole: string;
}

const AdminRoleViewComponent = (props: AdminRoleInternalProps) => {
  const { t } = useTranslation();
  const [disabled] = useState(
    isEqual(props.companyRole, 'superAdmin') === false,
  );

  const onSubmit = async (values: any) => {
    await props.companyOptionalRole(values);
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
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
          <form className='fl w-100' onSubmit={handleSubmit}>
            <div className='mb3'>
              <SubmitError errorMessage={submitError} />
            </div>
            <p className='b f5 mb3'>
              {t('app.project.Project-teammates.Admins')}
            </p>
            <div className='mb3'>
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='cRUDAnnouncement'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-1')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='editProfile'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-2')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='archiveProject'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-3')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='addRemoveModerator'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-4')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='messageAssociate'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-5')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='addAcceptRejectAssociate'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-6')}
                  </label>
                )}
              />
              <Field<string>
                name='optionalRole'
                type='checkbox'
                render={({ input, meta }) => (
                  <label
                    className={`flex items-center mb2 ${
                      disabled ? 'not-allowed' : 'pointer'
                    }`}
                  >
                    <Field
                      name='optionalRole'
                      className='mr2'
                      component='input'
                      type='checkbox'
                      value='acceptRejectProjectFromAssociate'
                      disabled={disabled}
                    />
                    {t('app.company.Role-Permissions.Permission-7')}
                  </label>
                )}
              />
            </div>
            {disabled === false ? (
              <div>
                <Button
                  className='w4 grow h2 pointer'
                  style={{
                    background: '#34b3e9',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type='submit'
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

const mapStateToProps = (state: any) => ({
  optionalRole: state.companyReducer.currentCompany.optionalRole,
  companyRole: state.companyReducer.currentCompany.role,
});

export const AdminRoleView = connect(mapStateToProps, {
  companyOptionalRole,
})(AdminRoleViewComponent);
