import React from 'react';
import { connect } from 'react-redux';
// import { isEqual } from 'lodash';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Button } from '@blueprintjs/core';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { projectRules } from './projectrules';

interface IOPtionalRole {
  optionalRole?: [];
}
interface IProjectRole {
  role?: string;
  onSubmit: (values: IOPtionalRole) => Promise<void>;
  optionalRole?: [];
}

const GeneralPageComponent = (props: IProjectRole) => {
  const [disabled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const permissions = projectRules(props.role, props.optionalRole);
  return (
    <div className="bl b--black-05 bw1 pl5-ns pl2 ml5-ns h-100">
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
              <p className="b f5 mb3">General</p>
              {
                permissions.grantAll ?
                  <div className="mb3 ml2">
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
                            value="updateArchiveProject"
                            disabled={disabled}
                          />
                          Update Archive Project
                        </label>
                      )}
                    />
                  </div>
                  : null
              }
            <p className="b f5 mb3">Project Preface</p>
            <div className="mb3 ml2">
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
                      value="updateProjectPreface"
                      disabled={disabled}
                    />
                    Update info's in Project Preface
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
                      value="addFileProject"
                      disabled={disabled}
                    />
                    Add files in Project Preface
                  </label>
                )}
              />
            </div>
            <p className="b f5 mb3">Rooms</p>
            <div className="mb3 ml2">
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
            <p className="b f5 mb3">Board</p>
            <div className="mb3 ml2">
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
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MuiAlert severity="success">
                  Role Updated Successfully
                </MuiAlert>
              </Snackbar>
            </div>
            { props.role && props.role === 'admin' && disabled === false ? (
              <div>
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
                  onClick={() => setOpen(true)}
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
  role:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project.optionalRole,
});
export const GeneralPage = connect(
  mapStateToProps,
  null,
)(GeneralPageComponent);
