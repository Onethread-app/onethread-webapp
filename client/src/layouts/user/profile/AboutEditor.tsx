import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';
import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Divider } from '@blueprintjs/core/lib/esm/components/divider/divider';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { User } from 'stores/user/Reducer';
import { editUserInfoAction } from 'stores/user/Actions';

import { checkError, maxValue } from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';

interface AboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
}
interface AboutEditInternalProps extends AboutEditComponentProps {
  editInfoAction: (val: User) => any;
  user: User;
}

const AboutEditComponent = (props: AboutEditInternalProps) => {
  const onSubmit = async (values: any) => {
    if (isEmpty(values.about)) {
      values.about = '';
    }
    const response = await props.editInfoAction(values);
    if (response.message === 200) {
      props.setShowDialog(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        about: props.user.about,
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
        <form className="fl w-100 ph4 pt6" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <h1 className="f5 lh-copy white">About</h1>
          <Field<string>
            name="about"
            validate={maxValue(2000)}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
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
          <Divider />
          <div className="flex justify-end">
            <Button
              className="w4 grow h2 pointer mr3"
              style={{
                background: '#08A0F7',
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
                border: '1px solid #08A0F7',
                color: '#08A0F7',
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
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const AboutEdit = connect(mapStateToProps, {
  editInfoAction: editUserInfoAction,
})(AboutEditComponent);
