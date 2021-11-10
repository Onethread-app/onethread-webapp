import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { SubmitError } from 'components/final-form/SubmitError';

interface IOPtionalRole {
  optionalRole?: [];
}
interface IProjectRole {
  role?: string;
  onSubmit: (values: IOPtionalRole) => Promise<void>;
  optionalRole?: [];
}

const GeneralPageComponent = (props: IProjectRole) => {
  const { t } = useTranslation();
  const [disabled] = useState(false);
  const [open, setOpen] = useState(false);

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
            <p className="b f5 mb3">
              {t('app.project.Project-settings.General')}
            </p>
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
                    {t('app.project.Project-settings.Update-archive')}
                  </label>
                )}
              />
            </div>
            <p className="b f5 mb3">
              {t('app.project.Project-settings.Preface')}
            </p>
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
                    {t('app.project.Project-settings.Update-preface')}
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
                    {t('app.project.Project-settings.Add-files')}
                  </label>
                )}
              />
            </div>
            <p className="b f5 mb3">
              {t('app.project.Project-settings.Rooms')}
            </p>
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
                    {t('app.project.Project-settings.Change-members')}
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
                    {t('app.project.Project-settings.Room-related')}
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
                    {t('app.project.Project-settings.Archive-room')}
                  </label>
                )}
              />
            </div>
            <p className="b f5 mb3">
              {t('app.project.Project-settings.Board')}
            </p>
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
                    {t('app.project.Project-settings.Change-board')}
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
                    {t('app.project.Project-settings.Change-column')}
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
                    {t('app.project.Project-settings.Assigning')}
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
            {props.role &&
            props.role === 'admin' &&
            disabled === false ? (
              <div>
                <Button
                  className="w4 grow h2 pointer"
                  style={{
                    background: '#08A0F7',
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
