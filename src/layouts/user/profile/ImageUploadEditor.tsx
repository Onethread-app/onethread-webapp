import React, { useState } from 'react';
import { Button, Spinner } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { profileImageUploadAction } from 'stores/user/Actions';

interface ImageUploadEditProps {
  setShowDialog: (val: boolean) => void;
  profileImageUploadAction: (val: any) => any;

}
const ImageUploadEditComponent = (props: ImageUploadEditProps) => {
  
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (event.target.files[0].size / 1024 / 1024 > 1) {
          setImageName('');
          setImageError(true);
          return false;
        } else {
          const data = new FormData();
          data.append('file', event.target.files[0], event.target.files[0].name);
          setImageName(event.target.files[0]);
          setImageSelected(data);
          setImageError(false);
          return data;
        }
      }
    }
    return false;
  };

  return (
    <div className="pa3 cf">
      <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
      <label className="bp3-file-input .modifier bp3-fill">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => imageChangeHandler(e)}
        />
        <span className="bp3-file-upload-input">
          {imageName.name ? imageName.name : <p>choose your file...</p>}
        </span>
      </label>
      {imageError &&
        <small style={{ color: 'red' }}>Image size can't be greater than 1 MB</small>}
      <div className="flex justify-end mt3">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
            setImageName({});
            setImageLoading(false);
            setImageError(false);
          }}
        >
          cancel
            </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={imageName && isEmpty(imageName.name) === false ?
            {
              background: '#0fa3a3',
              outline: 'none',
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: 'none',
              color: 'white'
            }
          }
          onClick={async (e: any) => {
            e.preventDefault();
            setImageLoading(true);
            const response = await props.profileImageUploadAction(imageSelected);
            if (response) {
              props.setShowDialog(false);
              setImageName({});
            }
            setImageLoading(false);
          }}
          disabled={imageLoading === true || isEmpty(imageName.name) ? true : false}
        >
          {imageLoading ? <Spinner size={15} /> : 'Save'}
        </Button>
      </div>
    </div>

  );
};

export const ImageUploadEdit = connect(null, { profileImageUploadAction })(ImageUploadEditComponent);
