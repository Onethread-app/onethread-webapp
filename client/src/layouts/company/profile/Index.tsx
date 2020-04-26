import React, { useState } from 'react';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { CoverPhotoView } from './CompanyCoverPhoto';
import { Tabs, Tab, Navbar, Drawer } from '@blueprintjs/core';
import { AdvancedInfo } from './AdvancedInfoView';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';
import { User } from 'stores/user/Reducer';
import user from './../../../resources/images/profilePhoto.svg';
import { connect } from 'react-redux';

interface ProfilePageProps {
  user: User;
}

const CompanyProfilePageComponent = (props: ProfilePageProps) => {

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
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const CompanyProfilePage = connect(mapStateToProps, null)(CompanyProfilePageComponent);