import { useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';

import { companyLogoUploadAction } from 'stores/company/Actions';
import { imageUploadAction } from 'stores/user/Actions';

interface IImageEditProps {
  setShowDialog: (val: boolean) => void;
  companyLogoUploadAction: (imageSelected: any, type: string) => any;
  imageUploadAction: (val: any, type: string) => any;
  type: string;
}
const ImageEditComponent = (props: IImageEditProps) => {
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  const checkMimetype = [
    'image/apng',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/svg',
  ];

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (!checkMimetype.includes(event.target.files[0].type)) {
          setImageName('');
          setImageError('This file format is not supported');
          return false;
        } else if (event.target.files[0].size / 1024 / 1024 > 5) {
          setImageName('');
          setImageError(`Image size can't be greater than 5 MB`);
          return false;
        } else {
          const data = new FormData();
          data.append(
            'file',
            event.target.files[0],
            event.target.files[0].name,
          );
          setImageName(event.target.files[0]);
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
      <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
      <label className="bp3-file-input .modifier bp3-fill">
        <input
          type="file"
          accept=".gif, .jpg, .apng, .jpeg, .bmp, .svg, .png"
          onChange={(e) => imageChangeHandler(e)}
        />
        <span className="bp3-file-upload-input">
          {imageName.name ? (
            imageName.name
          ) : (
            <p>choose your file...</p>
          )}
        </span>
      </label>
      {imageError && (
        <small style={{ color: 'red' }}>{imageError}</small>
      )}
      <div className="flex justify-end mt3">
        <Button
          className="w4 grow h2 pointer mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #08A0F7',
            color: '#08A0F7',
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
                  background: '#08A0F7',
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
            let response;
            if (
              props.type === 'company-logo' ||
              props.type === 'company-cover-photo'
            ) {
              response = await props.companyLogoUploadAction(
                imageSelected,
                props.type,
              );
            }
            if (
              props.type === 'coverPhoto' ||
              props.type === 'profilePic'
            ) {
              response = await props.imageUploadAction(
                imageSelected,
                props.type,
              );
            }
            if (response) {
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

export const ImageEdit = connect(null, {
  companyLogoUploadAction,
  imageUploadAction,
})(ImageEditComponent);
