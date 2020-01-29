import React from 'react';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
// import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { Button, Icon, EditableText } from '@blueprintjs/core';
import { SubmitError } from 'components/final-form/SubmitError';
// import { SubmitError } from 'components/final-form/SubmitError';
// import { IconNames } from '@blueprintjs/icons';

interface ITaskDescriptionFormProps {
  setEditDescriptionDialog: (val: boolean) => void;
  editDescriptionDialog: boolean;
}

export const TaskDescriptionEditor = (props: ITaskDescriptionFormProps) => {
  const onSubmit = async (values: any) => {
    console.log(values);
    props.setEditDescriptionDialog(false);
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
              onSubmit={handleSubmit}
            >
              <SubmitError errorMessage={submitError} />
              <div className="ph2 pt2">
                <Field<string>
                  name="description"
                  validate={required}
                  render={({ input, meta }) =>
                    <div className={` ${checkError(meta) ? 'mb3' : 'mb2'}`}>
                      <EditableText
                        multiline={true}
                        minLines={3}
                        maxLines={20}
                        value={input.value}
                        onChange={input.onChange}
                        className="outline"
                        placeholder=""
                      />
                      {checkError(meta) &&
                        <small className="mv3" style={{ color: 'red' }}>
                          {meta.error || meta.submitError}
                        </small>}
                    </div>
                  }
                />
                <div className="flex justify-end mt2">
                  <Button
                    className="mr2"
                    type="submit"
                    style={{ background: 'transparent' }}
                    icon="cross"
                    onClick={() => props.setEditDescriptionDialog(!props.editDescriptionDialog)}
                  />
                  <Button
                    type="submit"
                    style={{ background: '#0FA3A3' }}
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
    // <div>
    //   <Form
    //     onSubmit={onSubmit}
    //     render={({ handleSubmit, submitting, pristine, submitError }) => (
    //       <form className="w-25-l w-50-m center mt4-ns" onSubmit={handleSubmit}>
    //         <SubmitError errorMessage={submitError} />
    //         <div className="flex justify-end">
    //           <Icon
    //             icon={IconNames.DELETE}
    //             iconSize={20}
    //             className="grow pointer tigrow-lightBlue"
    //             onClick={(e: any) => props.setEditDescriptionDialog(!props.editDescriptionDialog)}
    //           />
    //         </div>
    //         <Field<string>
    //           name="description"
    //           validate={required}
    //           render={({ input, meta }) =>
    //             <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
    //               <EditableText
    //                 className="mb4 bg-white black"
    //                 multiline={true}
    //                 minLines={3}
    //                 maxLines={20}
    //                 value={input.value}
    //                 onChange={input.onChange}
    //               />
    //               {checkError(meta) &&
    //                 <small className="mv3" style={{ color: 'red' }}>
    //                   {meta.error || meta.submitError}
    //                 </small>}
    //             </div>
    //           }
    //         />
    //         <Button
    //           className="grow pointer white bp3-minimal w-100 mt3"
    //           style={{
    //             background: '#0fa3a3',
    //             outline: 'none',
    //             color: 'white',
    //             height: '42px',
    //             fontSize: '1rem'
    //           }}
    //           loading={submitting}
    //           type="submit"
    //           disabled={submitting || pristine}
    //         >
    //           Save
    //         </Button>
    //       </form>
    //     )}
    //   />
    // </div>
  );
};
