import React, { useState } from 'react';
import { User } from 'stores/user/Reducer';
import { Icon, Dialog } from '@blueprintjs/core';
import { upperFirst } from 'lodash';
import { connect } from 'react-redux';
import { ImageUploadEdit } from './ImageUploadEditor';

import DefaultUserImage from './../../../resources/images/user.png';

interface ImageUploadViewProps {
  user: User;
}

const ImageUploadViewComponent = (props: ImageUploadViewProps) => {

  const [showDialogPicture, setShowDialogPicture] = useState(false);

  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
        <div className="cf flex relative center" style={{ width: '112px' }}>
          <img
            className="db br-100 ba b--black-10"
            style={{ width: '112px', height: '112px', objectFit: 'cover' }}
            src={props.user.profileImage ? props.user.profileImage.imageSource : DefaultUserImage}
          />
          <div className="absolute bg-tigrowLightBlue br-100 pointer"
            onClick={() => setShowDialogPicture(true)}
            style={{ top: '4.5rem', right: '3px', width: '33px', height: '33px', paddingTop: '7px' }}
          >
            <Icon className="white" icon="camera" iconSize={20} ></Icon>
          </div>
        </div>
        <h1
          className="f6 lh-copy tigrow-lightGray-1 ws-break">
          {upperFirst(props.user.firstName)} {upperFirst(props.user.lastName)}
        </h1>
      </div>
      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ImageUploadEdit setShowDialog={setShowDialogPicture} />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const ImageUploadView = connect(mapStateToProps)(ImageUploadViewComponent);
