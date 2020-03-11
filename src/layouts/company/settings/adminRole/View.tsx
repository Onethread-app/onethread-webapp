import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { companyOptionalRole } from 'stores/company/Actions';
import { isEqual } from 'lodash';
interface AdminRoleInternalProps {
  companyOptionalRole: (companyRole: any) => void;
  optionalRole: string[];
  companyRole: string;
}

const AdminRoleViewComponent = (props: AdminRoleInternalProps) => {

  const [disabled] = useState(isEqual(props.companyRole, 'superAdmin') === false);

  const onSubmit = async (values: any) => {
    await props.companyOptionalRole(values);
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{ optionalRole: props.optionalRole }}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            className="fl w-100"
            onSubmit={handleSubmit}
          >
            <div className="mb3">
              <SubmitError errorMessage={submitError} />
            </div>
            <p className="b f5 mb3">Admins</p>
            <div className="mb3">
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="cRUDAnnoucment"
                      disabled={disabled}
                    />
                    Create/Update/Delete Company Announcement
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="editProfile"
                      disabled={disabled}
                    />
                    Edit Basic/Advanced Information of Profile
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="archiveProject"
                      disabled={disabled}
                    />
                    Archive Projects
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="addRemoveModerator"
                      disabled={disabled}
                    />
                    Add/Delete Project Moderator
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="messageAssociate"
                      disabled={disabled}
                    />
                    Message Associates
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="addAcceptRejectAssociate"
                      disabled={disabled}
                    />
                    Add/Accept/Reject Requests from Companies to be Associates
                  </label>
                }
              />
              <Field<string>
                name="optionalRole"
                type="checkbox"
                render={({ input, meta }) =>
                  <label className={`flex items-center mb2 ${disabled ? 'not-allowed' : 'pointer'}`}>
                    <Field
                      name="optionalRole"
                      className="mr2"
                      component="input"
                      type="checkbox"
                      value="acceptRejectProjectFromAssociate"
                      disabled={disabled}
                    />
                    Accept/Reject Project Request from Associates
                  </label>
                }
              />
            </div>
            {disabled === false ?
              <div>
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
              : undefined}
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    optionalRole: state.companyReducer.currentCompany.optionalRole,
    companyRole: state.companyReducer.currentCompany.role
  };
};

export const AdminRoleView = connect(mapStateToProps, { companyOptionalRole })(AdminRoleViewComponent);