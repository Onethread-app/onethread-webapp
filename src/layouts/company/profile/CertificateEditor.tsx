import { Button, TextArea } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, maxValue } from 'components/final-form/utils';
import { isEmpty } from 'lodash';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { fileUploadAction } from 'stores/room/Actions';

interface ICertificateEditProps {
  setShowDialog: (val: boolean) => void;
  fileUploadAction: (imageSelected: any, roomID: string) => any;
}

const CertificateEditComponent = (props: ICertificateEditProps) => {

  // const [imageSelected, setImageSelected] = useState({}) as any;
  // const [imageName, setImageName] = useState({}) as any;
  // const [imageLoading, setImageLoading] = useState(false);
  // const [imageError, setImageError] = useState('');
  // const sizeLimit = 25;

  const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, null, 2));
    if (isEmpty(values.name)) {
      values.name = '';
    }
    // const response = await props.editInfoAction(values);
    // if (response.message === 200) {
    //   props.setShowDialog(false);
    //   return true;
    // }
    // return { [response.fieldName]: response.message };
  };

  // const checkMimetype = [
  //   'application/zip',
  //   'application/x-rar-compressed',
  //   'application/x-7z-compressed',
  //   'application/x-zip-compressed',
  //   'application/pdf',
  //   'application/msword',
  //   'application/json',
  //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   'application/vnd.ms-powerpoint',
  //   'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   'application/vnd.ms-excel',
  //   'text/plain',
  //   'text/csv',
  //   'image/webp',
  //   'image/apng',
  //   'image/png',
  //   'image/bmp',
  //   'image/gif',
  //   'image/jpeg',
  //   'image/jpg',
  //   'image/svg',
  //   'image/svg+xml',
  //   'image/bmp',
  //   'image/vnd.microsoft.icon',
  // ];

  // const imageChangeHandler = (event: any) => {
  //   if (event.target.files) {
  //     const file = event.target.files[0];
  //     if (file) {
  //       if (!checkMimetype.includes(file.type)) {
  //         setImageName('');
  //         setImageError('This file format is not supported');
  //         return false;
  //       } else if (file.size / 1024 / 1024 > sizeLimit) {
  //         setImageName('');
  //         setImageError(`File size can't be greater than ${sizeLimit} MB`);
  //         return false;
  //       } else {
  //         const data = new FormData();
  //         data.append('file', file, file.name);
  //         setImageName(file);
  //         setImageSelected(data);
  //         setImageError('');
  //         return data;
  //       }
  //     }
  //   }
  //   return false;
  // };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            className="ph4 pt6"
            onSubmit={handleSubmit}
          >
            <SubmitError errorMessage={submitError} />
            <h1 className="f5 lh-copy white pb4">Certifications</h1>
            <Field<string>
              name="name"
              validate={maxValue(32)}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Certification Name</label>
                  <InputGroupFieldWithError
                    id="name"
                    className="mt1 ba"
                    value={input.value}
                    onChange={input.onChange}
                    style={{
                      boxShadow: 'none'
                    }}
                    error={checkError(meta) && (meta.error || meta.submitError)}
                  />
                </div>
              }
            />
            <Field<string>
              name="description"
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Description</label>
                  <TextArea
                    id="description"
                    className="mt1"
                    value={input.value}
                    onChange={input.onChange}
                    style={{
                      resize: 'none',
                      minHeight: '50px',
                      maxHeight: '150px'
                    }}
                    fill={true}
                    growVertically={true}
                  />
                  {checkError(meta) &&
                    <small className="mv3" style={{ color: 'red' }}>
                      {meta.error || meta.submitError}</small>}
                </div>
              }
            />
            {/* <Field<string>
              name="file"
              validate={maxValue(32)}
              render={({ input, meta }) =>
                <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                  <label>Attach Files</label>
                  <label className="bp3-file-input .modifier bp3-fill mv1">
                    <input
                      type="file"
                      accept=".gif, .jpg, .apng, .jpeg, .bmp, .svg, .png"
                      value={input.value}
                      onChange={(e) => imageChangeHandler(e)}
                    />
                    <span className="bp3-file-upload-input">
                      {imageName.name ? imageName.name : <p>choose your file...</p>}
                    </span>
                  </label>
                  {imageError &&
                    <small style={{ color: 'red' }}>{imageError}</small>}
                </div>
              }
            /> */}
            <div className="flex justify-end">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setShowDialog(false);
                  // setImageName({});
                  // setImageLoading(false);
                  // setImageError('');
                }}
              >
                cancel
              </Button>
              <Button
                className="w4 grow h2 pointer"
                style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
                loading={submitting}
                type="submit"
                onClick={async (e: any) => {
                  e.preventDefault();
                  // setImageLoading(true);
                  // const response = await props.fileUploadAction(imageSelected, '1');
                  // if (response) {
                  //   props.setShowDialog(false);
                  //   setImageName({});
                  // }
                  // setImageLoading(false);
                }}
                disabled={submitting || pristine
                  // || imageLoading === true || isEmpty(imageName.name) ? true : false
                }
              >
                Save
              </Button>
            </div>
          </form>
        )}
      />
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const CertificateEdit = connect(mapStateToProps, { fileUploadAction })(CertificateEditComponent);