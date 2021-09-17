import React from 'react';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import {
  projectPrefaceOutlineUpdate,
  getSingleProject,
} from '../../../stores/project/Actions';

import { SubmitError } from 'components/final-form/SubmitError';

import './textArea.css';

interface IProjectOutlineEditorFormProps {
  projectPrefaceOutlineUpdate: (
    pid: string,
    description: any,
  ) => void;
  editableOutline: string;
  getSingleProject: (pid: string) => void;
  setEditDescriptionDialog: (val: boolean) => void;
  editDescriptionDialog: boolean;
  pid: string;
}

export const ProjectOutlineEditorComponent = (
  props: IProjectOutlineEditorFormProps,
) => {
  const onSubmit = async (values: any) => {
    await props.projectPrefaceOutlineUpdate(
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
          description: props.editableOutline
            ? props.editableOutline
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
                      placeholder="Write the project outline here"
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
                  style={{ background: '#34b3e9' }}
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

export const ProjectOutlineEditor = connect(mapStateToProps, {
  projectPrefaceOutlineUpdate,
  getSingleProject,
})(ProjectOutlineEditorComponent);
