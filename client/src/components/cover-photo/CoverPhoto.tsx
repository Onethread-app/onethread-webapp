import React, { useState } from 'react';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { Dialog, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ProfilePicture } from 'components/profile-picture/ProfilePicture';
import coverPic from 'resources/images/coverPhoto.png';
import { ImageEdit } from 'components/image-editor/ImageEditor';
import editIcon from '../../resources/images/editIcon.png';
import { PositionEditor } from 'layouts/user/profile/PositionEditor';
import { RightSidebar } from 'components/RightSidebar';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { companyPermit } from 'stores/UtilsActions';
import { useTranslation } from 'react-i18next';

interface ICoverPhotoProps {
  company?: ICompany;
  user?: User;
  type: 'company' | 'user';
}

interface IUserProps {
  user: User;
  setShowDialogPosition: (val: any) => void;
}

interface ICompanyProps {
  company: ICompany;
  setShowDialogPosition: (val: any) => void;
}

interface IChangeButtonProps {
  company?: ICompany;
  user?: User;
  setShowDialogPicture: (val: any) => void;
}

const UserCustomView = (props: IUserProps) => {
  return (
    <>
      <CustomView condition={!isMobileOnly}>
        <div
          className="relative flex"
          style={{ marginTop: '-120px', marginLeft: '50px' }}
        >
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray"
            style={{ width: '235px', height: '235px' }}
          >
            <ProfilePicture user={props.user} />
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
                onClick={() => props.setShowDialogPosition(true)}
              />
            </div>
          </div>
        </div>
      </CustomView>
      <MobileOnlyView>
        <div className="relative flex companyProfilepicOuterOuter">
          <div className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray companyProfilepicOuter">
            <ProfilePicture user={props.user} />
          </div>
        </div>
        <div className="mw5 center" style={{ marginTop: '3rem' }}>
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
              onClick={() => props.setShowDialogPosition(true)}
            />
          </div>
        </div>
      </MobileOnlyView>
    </>
  );
};

const CompanyCustomView = (props: ICompanyProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative flex companyProfilepicOuterOuter ">
        <div className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray companyProfilepicOuter">
          <ProfilePicture company={props.company} />
        </div>
        <CustomView condition={!isMobileOnly}>
          <div className="flex flex-grow-1 justify-between">
            <div className="flex">
              <div
                className="ml5 ml1-m"
                style={{ marginTop: '10rem' }}
              >
                <h1 className="f6 ma0 ws-break ttc">
                {t('app.company.Company-profile.Total-Employee')}
                  {/* Total Employee */}
                </h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break tc">
                  {props.company.totalMember
                    ? props.company.totalMember
                    : 0}
                </h1>
              </div>
              <div
                className="ml4 ml1-m"
                style={{ marginTop: '10rem' }}
              >
                <h1 className="f6 ma0 ws-break ttc">
                    {t('app.company.Company-profile.Associates')}
                  {/* Total Partners */}
                </h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break tc ">
                  {props.company.totalAssociate
                    ? props.company.totalAssociate
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
            <h1 className="f7 ma0 ws-break ttc">{t('app.company.Company-profile.Total-Employee')}</h1>
            {/* <h1 className="f7 ma0 ws-break ttc">Total Employee</h1> */}
            <h1 className="fw4 ma0 ws-break tc">
              {props.company.totalMember
                ? props.company.totalMember
                : 0}
            </h1>
          </div>
          <div className="">
            <h1 className="f7 ma0 ws-break ttc">{t('app.company.Company-profile.Associates')}</h1>
            {/* <h1 className="f7 ma0 ws-break ttc">Partners</h1> */}
            <h1 className="fw4 ma0 ws-break tc ">
              {props.company.totalAssociate
                ? props.company.totalAssociate
                : 0}
            </h1>
          </div>
        </div>
      </MobileOnlyView>
    </>
  );
};

const ChangeButton = (props: IChangeButtonProps) => {
  const { t } = useTranslation();
  if (props.company) {
    return (
      <div className="h-100 child bg-black-40 br4">
        {companyPermit(props.company.role) && (
          <Button
            className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3 child f7 f5-ns companyCoverButton"
            style={{
              color: 'white',
            }}
            onClick={() => props.setShowDialogPicture(true)}
          >
            {t('app.user.Personal-profile.Cover')}
            {/* Change Cover */}
          </Button>
        )}
      </div>
    );
  } else {
    return (
      <div className="h-100 child bg-black-40 br4">
        <Button
          className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3 companyCoverButton f7 f5-ns"
          style={{
            color: 'white',
          }}
          onClick={() => props.setShowDialogPicture(true)}
        >
          {t('app.user.Personal-profile.Cover')}
          {/* Change Cover */}
        </Button>
      </div>
    );
  }
};

const CoverPhotoComponent = (props: ICoverPhotoProps) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  const [showDialogPosition, setShowDialogPosition] = useState(false);

  let bgSrc;
  let uploadType;
  if (props.company && props.type === 'company') {
    bgSrc = props.company.coverImage
      ? props.company.coverImage
      : coverPic;
    uploadType = 'company-cover-photo';
  }

  if (props.user && props.type === 'user') {
    bgSrc = props.user.coverImage ? props.user.coverImage : coverPic;
    uploadType = 'coverPhoto';
  }

  return (
    <>
      <div
        className="relative hide-child cover bg-center br4 individualcover"
        style={{
          backgroundImage: `url(${bgSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          objectFit: 'cover',
        }}
      >
        {props.type === 'company' ? (
          props.company ? (
            <ChangeButton
              company={props.company}
              setShowDialogPicture={setShowDialogPicture}
            />
          ) : null
        ) : props.user ? (
          <ChangeButton
            user={props.user}
            setShowDialogPicture={setShowDialogPicture}
          />
        ) : null}
      </div>
      {props.type === 'company' ? (
        props.company ? (
          <CompanyCustomView
            company={props.company}
            setShowDialogPosition={setShowDialogPosition}
          />
        ) : null
      ) : props.user ? (
        <UserCustomView
          user={props.user}
          setShowDialogPosition={setShowDialogPosition}
        />
      ) : null}

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
            type={uploadType}
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
    company: state.companyReducer.currentCompany,
    user: state.userReducer.user,
  };
};

export const CoverPhoto = connect(mapStateToProps)(
  CoverPhotoComponent,
);
