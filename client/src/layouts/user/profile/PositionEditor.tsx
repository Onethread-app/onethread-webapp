import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { User } from 'stores/user/Reducer';
import { editUserInfoAction } from 'stores/user/Actions';

import { checkError, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';

interface IPositionEditProps {
  setShowDialog: (val: boolean) => void;
}
interface IPositionEditInternalProps extends IPositionEditProps {
  editInfoAction: (val: User) => any;
  user: User;
}

const PositionEditComponent = (props: IPositionEditInternalProps) => {
  const onSubmit = async (values: any) => {
    if (isEmpty(values.position)) {
      values.position = '';
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
        position: props.user.position,
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
        <form className="ph4 pt6" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <h1 className="f5 lh-copy white">Position</h1>
          <Field<string>
            name="position"
            validate={maxValue(32)}
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <InputGroupFieldWithError
                  id="position"
                  className="mt1 ba"
                  value={input.value}
                  onChange={input.onChange}
                  style={{
                    boxShadow: 'none',
                  }}
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                />
              </div>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="w4 grow h2 pointer mr3"
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
            <Button
              className="w4 grow h2 pointer"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #34b3e9',
                color: '#34b3e9',
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

export const PositionEditor = connect(mapStateToProps, {
  editInfoAction: editUserInfoAction,
})(PositionEditComponent);
