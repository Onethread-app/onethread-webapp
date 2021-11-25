import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

// import { Tabs } from '@blueprintjs/core/lib/esm/components/tabs/tabs';
// import { Tab } from '@blueprintjs/core/lib/esm/components/tabs/tab';

import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';

// import Navbar from 'components/navbar/Navbar';
// import { AdvancedInfo } from './AdvancedInfoView';
// import { CoverPhoto } from 'components/cover-photo/CoverPhoto';
// import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { ProfileContainer, Table } from './Index.styles';
import { CompanyInfoForm } from './BasicInformationEditor';
import { Dialog } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { CompanyAboutEditor } from './AboutEditor';
import { ImageEdit } from 'components/image-editor/ImageEditor';
import { CompanyNameAvatar } from 'components/avatar/TextAvatar.styles';

interface ProfilePageProps {
  user: User;
  company: ICompany;
  subscriptiontExpired: boolean;
}

const CompanyProfilePageComponent = (props: ProfilePageProps) => {
  const [openEditCompany, setOpenEditCompany] =
    useState<boolean>(false);
  const [showDialogAbout, setShowDialogAbout] =
    useState<boolean>(false);
  const [showUpdateImage, setShowUpdateImage] =
    useState<boolean>(false);

  useEffect(() => {
    if (props.subscriptiontExpired) {
      props.company.role === 'superAdmin'
        ? window.location.replace(
            `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
          )
        : window.location.replace(
            `${window.location.origin}/${props.user.name}/home`,
          );
    }
  }, []);

  return (
    <ProfileContainer>
      <div className="small-text">COMPANY PROFILE</div>
      <div className="header">
        {props.company.logo ? (
          <img
            className="profile"
            src={props.company.logo}
            alt="company logo"
            onClick={() => setShowUpdateImage(true)}
          />
        ) : (
          <CompanyNameAvatar onClick={() => setShowUpdateImage(true)}>
            {props.company.name.slice(0, 1)}
          </CompanyNameAvatar>
        )}
        <div className="flex flex-column ml4">
          <div className="company-name">{props.company.name}</div>
          <div>
            Company Type:{' '}
            {props.company.type ? props.company.type : 'Not set'}
            {'  .  '}
            Location:{' '}
            {props.company.address
              ? props.company.address
              : 'Not set'}
            {/* TODO: Add company website and add learn more button */}
          </div>
        </div>
        <div
          className="simple-button"
          onClick={() => setOpenEditCompany(true)}
        >
          Edit company
        </div>
      </div>
      <div className="flex flex-column">
        <div className="about">
          About{' '}
          <span className="capitalize">{props.company.name}</span>
        </div>
        <div className="mt2 mb2">
          {props.company.about ? (
            props.company.about
          ) : (
            <>
              No about information set for this company.{' '}
              <Link to="#" onClick={() => setShowDialogAbout(true)}>
                Set now?
              </Link>
            </>
          )}{' '}
        </div>
      </div>
      <Table>
        <div className="flex">
          <span>Company Name</span>
          <span className="capitalize">{props.company.name}</span>
        </div>
        <div>
          <span>Company Type</span>
          <span>{props.company.type}</span>
        </div>
        <div>
          <span>Company Email Address</span>
          <span>{props.company.email}</span>
        </div>
        <div>
          <span>Legal Owner</span>
          <span>{props.company.legalOwnerName}</span>
        </div>
        <div>
          <span>Legal Owner Email Address</span>
          <span>{props.company.legalOwnerMail}</span>
        </div>
        {/* <div>
          <span>Website</span>
          <span></span>
        </div> */}
        {/* <div>
          <span>Industry</span>
          <span>Needs to get from backend</span>
        </div> */}
        <div>
          <span>Company Size</span>
          <span>{props.company.totalEmployees}</span>
        </div>
        <div>
          <span>Headquarter</span>
          <span>{props.company.address}</span>
        </div>
      </Table>

      {openEditCompany ? (
        <Dialog
          isOpen={openEditCompany}
          onClose={() => setOpenEditCompany(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
        >
          <CompanyInfoForm setShowDialog={setOpenEditCompany} />
        </Dialog>
      ) : null}
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(false)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanyAboutEditor
              company={props.company}
              setShowDialog={setShowDialogAbout}
            />
          </div>
        </Dialog>
      )}
      {showUpdateImage ? (
        <Dialog
          isOpen={showUpdateImage}
          onClose={() => setShowUpdateImage(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
        >
          <ImageEdit
            setShowDialog={setShowUpdateImage}
            type="company-logo"
          />
        </Dialog>
      ) : null}
    </ProfileContainer>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    company: state.companyReducer.currentCompany,
  };
};

export const CompanyProfilePage = connect(
  mapStateToProps,
  null,
)(CompanyProfilePageComponent);

export default CompanyProfilePage;
