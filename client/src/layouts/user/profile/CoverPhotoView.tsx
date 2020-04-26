import React, { useState } from 'react';
import { User } from 'stores/user/Reducer';
import { Dialog, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ProfilePictureView } from './ProfilePictureView';
import { PositionEditor } from './PositionEditor';
import { RightSidebar } from 'components/RightSidebar';

import editIcon from '../../../resources/images/editIcon.png';
import coverPic from 'resources/images/coverPhoto.png';
import { ImageEdit } from './ImageEditor';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
interface IImageUploadViewProps {
  user: User;
}

const CoverPhotoViewComponent = (props: IImageUploadViewProps) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  const [showDialogPosition, setShowDialogPosition] = useState(false);

  return (
    <>
      <div
        className="relative hide-child cover bg-center br4 individualcover"
        style={{
          backgroundImage: `url(${
            props.user.coverImage ? props.user.coverImage : coverPic
            })`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          objectFit: 'cover',
        }}
      >
        <div className="h-100 child bg-black-40 br4">
          <Button
            className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3 companyCoverButton f7 f5-ns"
            style={{
              color: 'white',
            }}
            onClick={() => setShowDialogPicture(true)}
          >
            Change Cover
          </Button>
        </div>
      </div>
      <CustomView condition={!isMobileOnly}>
        <div
          className="relative flex"
          style={{ marginTop: '-120px', marginLeft: '50px' }}
        >
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray"
            style={{ width: '235px', height: '235px' }}
          >
            <ProfilePictureView />
          </div>
          <div
            className="ml5-tigrow-l ml1-m"
            style={{ marginTop: '9rem' }}
          >
            <h1 className="f3-l f4 ma0 ws-break ttc">
              {props.user.firstName} {props.user.lastName}
            </h1>
            <div className="cf ">
              <h1 className="f5 dib ws-break black-70 ttc">
                {props.user.position
                  ? props.user.position
                  : 'No designation'}
              </h1>
              <img
                src={editIcon}
                width="30"
                height="30"
                className="br2 pointer fr mv1"
                onClick={() => setShowDialogPosition(true)}
              />
            </div>
          </div>
        </div>
      </CustomView>
      <MobileOnlyView>
        <div
          className="relative flex companyProfilepicOuterOuter"
        >
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray companyProfilepicOuter"
          >
            <ProfilePictureView />
          </div>
        </div>
        <div
          className="mw5 center"
          style={{ marginTop: '3rem' }}
        >
          <h1 className="f3-l f4 ma0 ws-break ttc">
            {props.user.firstName} {props.user.lastName}
          </h1>
          <div className="cf ">
            <h1 className="f5 dib ws-break black-70 ttc">
              {props.user.position
                ? props.user.position
                : 'No designation'}
            </h1>
            <img
              src={editIcon}
              width="30"
              height="30"
              className="br2 pointer fr mv1"
              onClick={() => setShowDialogPosition(true)}
            />
          </div>
        </div>
      </MobileOnlyView>
      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <ImageEdit
            setShowDialog={setShowDialogPicture}
            type="coverPhoto"
          />
        </Dialog>
      )}
      {showDialogPosition && (
        <RightSidebar
          onClose={() => setShowDialogPosition(!showDialogPosition)}
        >
          <PositionEditor setShowDialog={setShowDialogPosition} />
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const CoverPhotoView = connect(mapStateToProps)(
  CoverPhotoViewComponent,
);
