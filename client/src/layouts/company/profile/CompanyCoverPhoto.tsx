import React, { useState } from 'react';
import { ICompany } from 'stores/company/Reducer';
import { Dialog, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { CompanyProfilePicture } from './CompanyProfilePicture';
import coverPic from 'resources/images/coverPhoto.png';
import { ImageEdit } from './ImageEditor';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { companyPermit } from 'stores/UtilsActions';

interface ICompanyCoverUploadViewProps {
  currentCompany: ICompany;
}

const CompanyCoverPhotoComponent = (
  props: ICompanyCoverUploadViewProps,
) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);

  return (
    <>
      <div
        // className="relative cover br4 w-100"
        className="relative hide-child cover bg-center br4 companyCover"
        style={{
          backgroundImage: `url(${
            props.currentCompany.coverImage
              ? props.currentCompany.coverImage
              : coverPic
            })`,
        }}
      >
        {/* <div className="absolute flex" style={{ left: "40px", top: "63%" }}>
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray"
            style={{ width: "235px", height: "235px" }}
          >
            <CompanyProfilePicture />
          </div>
          <div className="flex flex-grow-1 justify-between">
            <div className="flex">
              <div className="ml5 ml1-m" style={{ marginTop: "15rem" }}>
                <h1 className="f6 ma0 ws-break ttc">Total Employee</h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break">{props.currentCompany.totalMember}</h1>
              </div>
              <div className="ml4 ml1-m" style={{ marginTop: "15rem" }}>
                <h1 className="f6 ma0 ws-break ttc">Associates</h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break">{props.currentCompany.totalAssociate}</h1>
              </div>
            </div>
          </div>
        </div> */}
        <div className="h-100 child bg-black-40 br4">
          {
            companyPermit(props.currentCompany.role) && (
              <Button
            className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3 child f7 f5-ns companyCoverButton"
            style={{
              color: 'white',
            }}
            onClick={() => setShowDialogPicture(true) }
          >
            Change Cover
          </Button>
            )
          }
          
        </div>
      </div>
      <div className="relative flex companyProfilepicOuterOuter ">
        <div className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray companyProfilepicOuter">
          <CompanyProfilePicture />
        </div>
        <CustomView condition={!isMobileOnly}>
          <div className="flex flex-grow-1 justify-between">
            <div className="flex">
              <div
                className="ml5 ml1-m"
                style={{ marginTop: '10rem' }}
              >
                <h1 className="f6 ma0 ws-break ttc">
                  Total Employee
                </h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break tc">
                  {props.currentCompany.totalMember
                    ? props.currentCompany.totalMember
                    : 0}
                </h1>
              </div>
              <div
                className="ml4 ml1-m"
                style={{ marginTop: '10rem' }}
              >
                <h1 className="f6 ma0 ws-break ttc">Total Associates</h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break tc ">
                  {props.currentCompany.totalAssociate
                    ? props.currentCompany.totalAssociate
                    : 0}
                </h1>
              </div>
            </div>
          </div>
        </CustomView>
      </div>
      <MobileOnlyView>
        <div
          className="flex  justify-between mh4"
          style={{ marginTop: '5rem' }}
        >
          <div className="">
            <h1 className="f7 ma0 ws-break ttc">Total Employee</h1>
            <h1 className="fw4 ma0 ws-break tc">
              {props.currentCompany.totalMember
                ? props.currentCompany.totalMember
                : 0}
            </h1>
          </div>
          <div className="">
            <h1 className="f7 ma0 ws-break ttc">Associates</h1>
            <h1 className="fw4 ma0 ws-break tc ">
              {props.currentCompany.totalAssociate
                ? props.currentCompany.totalAssociate
                : 0}
            </h1>
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
            type="company-cover-photo"
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentCompany: state.companyReducer.currentCompany,
  };
};

export const CoverPhotoView = connect(mapStateToProps)(
  CompanyCoverPhotoComponent,
);
