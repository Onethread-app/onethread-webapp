import React from 'react';
import { SubmitError } from 'components/final-form/SubmitError';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { Button } from '@blueprintjs/core';

// import userIcon from 'resources/images/profilePhoto.svg';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { createComment } from 'stores/comment/Actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icomment } from 'stores/comment/Reducer';
import { useTranslation } from 'react-i18next';

interface ICommentReplyInternalProps {
  createComment: (text: Icomment['text']) => any;
  isCreating: boolean;
}
export const ActivityEditorPageComponent = (
  props: ICommentReplyInternalProps & RouteComponentProps,
) => {
  const onSubmit = async (values: any) => {
    const response = await props.createComment(values.text);
    if ( response && !props.isCreating ) {
      values.text = '';
    }
  };

  const { t } = useTranslation();

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
          <form onSubmit={handleSubmit}>
            <div>
              <SubmitError errorMessage={submitError} />
            </div>
            <div className="pl2 pt2 w-100 flex">
              <Field<string>
                name="text"
                validate={required}
                render={({ input, meta }) => (
                  <div
                    className={`w-80 ${
                      checkError(meta) ? 'mb3' : 'mb2'
                    }`}
                  >
                    <InputGroupFieldWithError
                      id="text"
                      value={input.value}
                      onChange={input.onChange}
                      className="br2"
                      placeHolder={t('app.project.Project-boards.Write-comment')}
                      // placeHolder="Write comment"
                      style={{
                        height: '40px',
                        background: '#D4D4D47A',
                      }}
                    />
                    {checkError(meta) && (
                      <small className="mv3" style={{ color: 'red' }}>
                        {meta.error || meta.submitError}
                      </small>
                    )}
                  </div>
                )}
              />
              <div className="w-20 pl2">
                <Button
                  type="submit"
                  className="w-100"
                  style={{
                    background: '#3F61C5',
                    color: '#ffffff',
                    height: '40px',
                  }}
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

const mapStateToProps = (state: any) => {
  return {
    isCreating: state.commentReducer.isCreating,
  };
};

export const ActivityEditor = connect(mapStateToProps, { createComment })(
  withRouter(ActivityEditorPageComponent),
);

// export const CommentReply = () => {
//   const onSubmit = async (values: any) => {
//     console.log(values);
//   };
//   // const [showReply, setShowReply] = useState(false);
//   return (
//     <div>
//       <Form
//         onSubmit={onSubmit}
//         render={({
//           handleSubmit,
//           form,
//           submitting,
//           pristine,
//           values,
//           submitError,
//           hasValidationErrors,
//           ...rest
//         }) => (
//             <form
//               className="fl w-90 pl5"
//               onSubmit={handleSubmit}
//             >
//               <SubmitError errorMessage={submitError} />
//               <article className="dt pb2 mt2 w-100">
//                 <div className="dtc w2">
//                   <img
//                     src={userIcon}
//                     className="ba b--black-10 db br-100 w2 h2" />
//                 </div>
//                 <div className="dtc v-mid pl3">
//                   <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
//                   <h1 className="f7 fw6 lh-title silver mv1">UI/Ux Designer</h1>
//                 </div>
//               </article>
//               <Field<string>
//                 name="reply"
//                 validate={required}
//                 render={({ input, meta }) =>
//                   <div className={`w-100 ${checkError(meta) ? 'mb3' : 'mb2'}`}>
//                     <EditableText
//                       multiline={true}
//                       minLines={3}
//                       maxLines={20}
//                       value={input.value}
//                       onChange={input.onChange}
//                       className="ba br2"
//                       placeholder=""
//                     />
//                     {checkError(meta) &&
//                       <small className="mv3" style={{ color: 'red' }}>
//                         {meta.error || meta.submitError}
//                       </small>}
//                   </div>
//                 }
//               />
//               <div className="fr">
//                 <Button
//                   className="grow pointer white bp3-minimal w4 mt2"
//                   style={{
//                     background: '#3F61C5',
//                     outline: 'none',
//                     color: 'white',
//                   }}
//                   loading={submitting}
//                   type="submit"
//                   disabled={submitting || pristine}
//                   text="Reply"
//                 />
//               </div>
//             </form>
//           )}
//       />
//     </div>
//   );
// };
