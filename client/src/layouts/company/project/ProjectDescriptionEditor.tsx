import { connect } from 'react-redux';

import TextareaAutosize from 'react-textarea-autosize';
import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import {
  projectPrefaceDescriptionUpdate,
  getSingleProject,
} from '../../../stores/project/Actions';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';

import './textArea.css';

interface IProjectDescriptionFormProps {
  getSingleProject: (pid: string) => void;
  setEditDescriptionDialog: (val: boolean) => void;
  editableDescription: string;
  editDescriptionDialog: boolean;
  projectPrefaceDescriptionUpdate: any;
  pid: string;
}

export const ProjectDescriptionEditorComponent = (
  props: IProjectDescriptionFormProps,
) => {
  const onSubmit = async (values: any) => {
    await props.projectPrefaceDescriptionUpdate(
      props.pid,
      values.description,
    );
    await props.getSingleProject(props.pid);
    props.setEditDescriptionDialog(false);
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          description: props.editableDescription
            ? props.editableDescription
            : '',
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
          <form onSubmit={handleSubmit}>
            <div className="pr2">
              <SubmitError errorMessage={submitError} />
            </div>
            <div className="pr2 pt2">
              <Field<string>
                name="description"
                validate={composeValidators(required, maxValue(5000))}
                render={({ input, meta }) => (
                  <div>
                    <TextareaAutosize
                      value={input.value}
                      onChange={input.onChange}
                      className="description-area"
                      placeholder="Write the project description here"
                      minRows={5}
                      useCacheForDOMMeasurements
                    />
                    {checkError(meta) && (
                      <p className="mv2" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="flex justify-end mt2">
                <Button
                  className="mr2"
                  style={{ background: 'transparent' }}
                  icon="cross"
                  onClick={() =>
                    props.setEditDescriptionDialog(
                      !props.editDescriptionDialog,
                    )
                  }
                />
                <Button
                  type="submit"
                  style={{ background: '#08A0F7' }}
                  loading={submitting}
                  icon={
                    <Icon
                      icon="tick"
                      iconSize={20}
                      style={{ color: 'white' }}
                    />
                  }
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

const mapStateToProps = (state: any) => ({
  pid: state.projectReducer.pid,
});

export const ProjectDescriptionEditor = connect(mapStateToProps, {
  projectPrefaceDescriptionUpdate,
  getSingleProject,
})(ProjectDescriptionEditorComponent);
