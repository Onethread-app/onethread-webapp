import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

import { projectFileUpload } from '../../../stores/project/Actions';

interface IFileUploadProps {
  setShowDialog: (val: boolean) => void;
  projectFileUpload: (imageSelected: any, projectID: string) => any;
  projectID: string;
}
interface IFileUploadInternalProps extends IFileUploadProps {
  isLoading: boolean;
}
const FileUploadComponent = (props: IFileUploadInternalProps) => {
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const sizeLimit = 25;

  const checkMimetype = [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-zip-compressed',
    'application/pdf',
    'application/msword',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain',
    'text/csv',
    'image/webp',
    'image/apng',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/svg',
    'image/svg+xml',
    'image/bmp',
    'image/vnd.microsoft.icon',
  ];

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        if (!checkMimetype.includes(file.type)) {
          setImageName('');
          setImageError('This file format is not supported');
          return false;
        } else if (file.size / 1024 / 1024 > sizeLimit) {
          setImageName('');
          setImageError(
            `File size can't be greater than ${sizeLimit} MB`,
          );
          return false;
        } else {
          const data = new FormData();
          data.append('file', file, file.name);
          setImageName(file);
          setImageSelected(data);
          setImageError('');
          return data;
        }
      }
    }
    return false;
  };

  return (
    <div className="pa3 cf">
      <h1 className="f5 tigrow-lightBlue">Upload File</h1>
      <label className="bp3-file-input .modifier bp3-fill">
        <input type="file" onChange={(e) => imageChangeHandler(e)} />
        <span className="bp3-file-upload-input">
          {imageName.name ? (
            imageName.name
          ) : (
            <p>choose your file...</p>
          )}
        </span>
      </label>
      {imageError ? (
        <small style={{ color: 'red' }}>{imageError}</small>
      ) : null}
      <div className="flex justify-end mt3">
        <Button
          className="w4 grow h2 pointer mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #34b3e9',
            color: '#34b3e9',
          }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
            setImageName({});
            setImageLoading(false);
            setImageError('');
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={
            imageName && isEmpty(imageName.name) === false
              ? {
                  background: '#34b3e9',
                  outline: 'none',
                  color: 'white',
                }
              : {
                  background: '#011b1b2e',
                  outline: 'none',
                  color: 'white',
                }
          }
          onClick={async (e: any) => {
            e.preventDefault();
            setImageLoading(true);
            const response = await props.projectFileUpload(
              imageSelected,
              props.projectID,
            );
            if (response && props.isLoading === false) {
              props.setShowDialog(false);
              setImageName({});
            }
            setImageLoading(false);
          }}
          disabled={
            imageLoading === true || isEmpty(imageName.name)
              ? true
              : false
          }
        >
          {imageLoading ? <Spinner size={15} /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};
const mapStateToProps = (state: any) => ({
  projectID: state.projectReducer.pid,
  isLoading: state.projectReducer.projectLoading,
});
export const FileUpload = connect(mapStateToProps, {
  projectFileUpload,
})(FileUploadComponent);
