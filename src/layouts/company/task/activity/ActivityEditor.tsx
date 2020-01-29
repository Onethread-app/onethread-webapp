import React from 'react';
import { SubmitError } from 'components/final-form/SubmitError';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { EditableText, Button } from '@blueprintjs/core';

import userIcon from 'resources/images/profilePhoto.svg';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';

interface ICommentReplyFormProps {
  setShowReply: (val: boolean) => void;
  showReply: boolean;
}
export const ActivityEditor = () => {
  const onSubmit = async (values: any) => {
    console.log(values);
    // props.setEditDescriptionDialog(false);
    // try {
    //   const response = await tigrowApi.post('accounts/forget-password', values, {
    //     'Content-Type': 'application/json'
    //   } as AxiosRequestConfig);
    //   if (response.status === 200) {
    //     props.setEmailComponentView(true);
    //   }
    //   return true;
    // } catch (error) {
    //   const err = errorMessgeHandler(error);
    //   return { [err.fieldName]: err.message };
    // }
  };
  return (
    <div className="w-100">
      <Form
        onSubmit={onSubmit}
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
            <form
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <div className="pl4 pt2 w-100 flex">
                <Field<string>
                  name="comment"
                  validate={required}
                  render={({ input, meta }) =>
                    <div className={`w-80 ${checkError(meta) ? 'mb3' : 'mb2'}`}
                    >
                      <InputGroupFieldWithError
                        id="comment"
                        value={input.value}
                        onChange={input.onChange}
                        className="ba br2"
                        />
                      {checkError(meta) &&
                        <small className="mv3" style={{ color: 'red' }}>
                          {meta.error || meta.submitError}
                        </small>}
                    </div>
                  }
                />
                <div className="w-20 pl2">
                  <Button
                    type="submit"
                    className="w-100"
                    style={{ background: '#0FA3A3', color: '#ffffff' }}
                    loading={submitting}
                    text="Send"
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

export const CommentReply = (props: ICommentReplyFormProps) => {
  const onSubmit = async (values: any) => {
    console.log(values);
    props.setShowReply(false);
    // props.setEditDescriptionDialog(false);
    // try {
    //   const response = await tigrowApi.post('accounts/forget-password', values, {
    //     'Content-Type': 'application/json'
    //   } as AxiosRequestConfig);
    //   if (response.status === 200) {
    //     props.setEmailComponentView(true);
    //   }
    //   return true;
    // } catch (error) {
    //   const err = errorMessgeHandler(error);
    //   return { [err.fieldName]: err.message };
    // }
  };
  return (
    <div>
      <Form
        onSubmit={onSubmit}
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
            <form
              className="fl w-90 pl5"
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <article className="dt pb2 mt2 w-100">
                <div className="dtc w2">
                  <img
                    src={userIcon}
                    className="ba b--black-10 db br-100 w2 h2" />
                </div>
                <div className="dtc v-mid pl3">
                  <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                  <h1 className="f7 fw6 lh-title silver mv1">UI/Ux Designer</h1>
                </div>
              </article>
              <Field<string>
                name="reply"
                validate={required}
                render={({ input, meta }) =>
                  <div className={`w-100 ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                    <EditableText
                      multiline={true}
                      minLines={3}
                      maxLines={20}
                      value={input.value}
                      onChange={input.onChange}
                      className="ba br2"
                      placeholder=""
                    />
                    {checkError(meta) &&
                      <small className="mv3" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </small>}
                  </div>
                }
              />
              <div className="fr">
                <Button
                  className="grow pointer white bp3-minimal w4 mt2"
                  style={{
                    background: '#0FA3A3',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                  text="Reply"
                />
              </div>
            </form>
          )}
      />
    </div>
  );
};