import React, { useState } from 'react';
import { User } from 'stores/user/Reducer';
import { Dialog, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { CompanyProfilePicture } from './CompanyProfilePicture';

import editIcon from '../../../resources/images/editIcon.png';
import coverPic from 'resources/images/coverPhoto.png';
import { ImageEdit } from './ImageEditor';
interface IImageUploadViewProps {
  user: User;
}

const CompanyCoverPhotoComponent = (props: IImageUploadViewProps) => {

  const [showDialogPicture, setShowDialogPicture] = useState(false);

  return (
    <>
      <div className="relative cover br4 w-100"
        style={{
          backgroundImage: `url(${props.user.coverImage ? props.user.coverImage.link : coverPic})`,
          height: '340px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          objectFit: 'cover'
        }}
      >
        <div
          className="absolute flex"
          style={{ left: '40px', top: '63%' }}
        >
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray"
            style={{ width: '235px', height: '235px' }}
          >
            <CompanyProfilePicture />
          </div>
          <div
            className="ml5-tigrow-l ml1-m"
            style={{ marginTop: '9rem' }}
          >
            <h1
              className="f3-l f4 ma0 ws-break ttc">
              {props.user.firstName} {props.user.lastName}
            </h1>
            <div className="cf ">
              <h1 className="f5 dib ws-break black-70 ttc">
                {props.user.position ? props.user.position : 'No designation'}
              </h1>
              <img
                src={editIcon}
                width="30"
                height="30"
                className="br2 pointer fr mv1"
                // onClick={() => setShowDialogPosition(true)}
              />
            </div>
          </div>
        </div>
        <Button
          className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3"
          style={{ marginTop: '265px', marginRight: '45px', color: 'white' }}
          onClick={() => setShowDialogPicture(true)}>Change Cover</Button>
      </div>
      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ImageEdit setShowDialog={setShowDialogPicture} type="coverPhoto" />
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

export const CompanyCoverPhoto = connect(mapStateToProps)(CompanyCoverPhotoComponent);
