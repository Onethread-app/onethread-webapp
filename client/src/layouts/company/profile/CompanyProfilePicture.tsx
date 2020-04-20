import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ImageEdit } from './ImageEditor';
import DefaultUserImage from './../../../resources/images/profilePhoto.svg';
import { companyPermit } from 'stores/UtilsActions';

const CompanyProfilePictureComponent = (props: any) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);

  return (
    <>
      <div>
        <img
          className="companyProfilepic"
          style={{
            objectFit: 'cover'
          }}
          src={
            props.company.logo ? props.company.logo : DefaultUserImage
          }
          onClick={() => companyPermit(props.company.role) ? setShowDialogPicture(true) : undefined}
        />
        <h1 className="ma1 ws-break ttc f3-ns f4"> {props.company.name} </h1>
        <h1 className="f6 fw6 ma1 ws-break">{props.company.type}</h1>
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
            type="company-logo"
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
  };
};

export const CompanyProfilePicture = connect(mapStateToProps)(
  CompanyProfilePictureComponent,
);
