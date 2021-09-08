import React, { useState } from 'react';

import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { companyPermit } from 'stores/UtilsActions';

import DefaultUserImage from './../../resources/images/profilePhoto.svg';

import { ImageEdit } from '../image-editor/ImageEditor';

interface IProfilePictureProps {
  company?: ICompany;
  user?: User;
}
export const ProfilePicture = (props: IProfilePictureProps) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);

  let type;
  if (props.company) {
    type = 'company-logo';
  }
  if (props.user) {
    type = 'profilePic';
  }

  let imageSrc;
  if (props.company) {
    imageSrc = props.company.logo
      ? props.company.logo
      : DefaultUserImage;
  }

  if (props.user) {
    imageSrc = props.user.profileImage
      ? props.user.profileImage
      : DefaultUserImage;
  }

  const handleClick = () => {
    if (props.company) {
      if (companyPermit(props.company.role)) {
        setShowDialogPicture(true);
      }
    }
    if (props.user) {
      setShowDialogPicture(true);
    }
  };

  return (
    <>
      <div>
        <img
          className="companyProfilepic"
          style={{
            objectFit: 'cover',
          }}
          src={imageSrc}
          alt=""
          onClick={handleClick}
        />
        {props.company ? (
          <div>
            <h1 className="ma1 ws-break ttc f3-ns f4">
              {' '}
              {props.company.name}{' '}
            </h1>
            <h1 className="f6 fw6 ma1 ws-break">
              {props.company.type}
            </h1>
          </div>
        ) : null}
      </div>
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
            type={type}
          />
        </Dialog>
      )}
    </>
  );
};
