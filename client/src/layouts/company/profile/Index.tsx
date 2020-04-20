import React from 'react';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { CoverPhotoView } from './CompanyCoverPhoto';
import { Tabs, Tab } from '@blueprintjs/core';
import { AdvancedInfo } from './AdvancedInfoView';
<<<<<<< HEAD
<<<<<<< HEAD
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { NavbarCompany } from 'components/NavbarCompany';
=======
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
<<<<<<< HEAD
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> a51ad486... Feature/mobile responsive (#148)

export const CompanyProfilePage = () => (
  <div className="w-100 pa4-ns pa2">
    <CoverPhotoView />
    <Tabs id="TabsExample" className="mt6-ns mt5 ph5-ns ph3">
      <Tab
        id="basic_info"
        title="Basic Information"
        panel={<BasicInfoDetailsView />}
        className="outline-0"
      />
      <Tab
        id="advance_info"
        title="Advanced Information"
        panel={<AdvancedInfo />}
        className="outline-0"
      />
    </Tabs>
  </div>
);

const CompanyProfilePageComponent = (props: ProfilePageProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  return (
    <>
      <NavbarCompany title="Company Profile" />
=======

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <MobileView>
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
          <h1 className="f3">Company Profile</h1>
          <img
            src={
              props.user.profileImage
                ? props.user.profileImage
                : user
            }
            className="dim v-mid dib br-100 pointer"
            style={{
              width: '2rem',
              height: '2rem',
              objectFit: 'cover',
            }}
            alt="user"
            onClick={() => setShowDialog(true)}

          />
        </Navbar>
      </MobileView>
>>>>>>> b9e80fb9... mobile responsive for project preface
=======

=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
  return (
    <>
      <NavbarCompany title="Company Profile" />
>>>>>>> a51ad486... Feature/mobile responsive (#148)
      <div className="w-100 pa4-ns pa2 mt5 mt0-ns">
        <CoverPhotoView />
        <Tabs id="TabsExample" className="mt6-ns mt5 ph5-ns ph3">
          <Tab
            id="basic_info"
            title="Basic Information"
            panel={<BasicInfoDetailsView />}
            className="outline-0"
          />
          <Tab
            id="advance_info"
            title="Advanced Information"
            panel={<AdvancedInfo />}
            className="outline-0"
          />
        </Tabs>
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '70%' }}
        >
          <div>
            <MobileListView
              showDialog={showDialog}
              setShowDialog={setShowDialog}
            />
          </div>
        </Drawer>
      )}
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const CompanyProfilePage = connect(mapStateToProps, null)(CompanyProfilePageComponent);
