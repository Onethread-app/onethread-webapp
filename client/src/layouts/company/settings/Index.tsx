
import React, { useState } from 'react';
import { Tabs, Tab, Navbar, Drawer } from '@blueprintjs/core';
import { GeneralView } from './companyName/General';
import { DepartmentView } from './department/View';
import { AdminRoleView } from './adminRole/View';
import { MobileView } from 'react-device-detect';
import user from './../../../resources/images/profilePhoto.svg';
import { User } from 'stores/user/Reducer';
import { connect } from 'react-redux';
import { MobileListView } from '../MobileListView';

interface SettingsPageProps {
  user: User;
}

const SettingsPagComponent = (props: SettingsPageProps) => {

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <MobileView>
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
          <h1 className="f3">My Settings</h1>
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
      <div className="fl w-100 pl4-ns pr2-ns ph3 pb4 mt5 mt0-ns">
        <div className="fl w-100">
          <h3 className="f3 b">Settings</h3>
        </div>
        <Tabs
          id="TabsExample"
          className="fl w-100 min-vh-75"
          vertical={true}
        >
          <Tab
            id="General"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="General"
            panel={<GeneralView />}
            className="outline-0 f6-ns f7"
          />
          <Tab
            id="admin_role_permissions"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="Role Permissions"
            panel={<AdminRoleView />}
            className="outline-0 w-100 f6-ns f7"
          />
          <Tab
            id="department"
            panelClassName="b--black-05 bl bw1 ml3-ns ml1 w-100"
            title="Department"
            panel={<DepartmentView />}
            className="outline-0 f6-ns f7"
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
export const SettingsPage = connect(mapStateToProps, null)(SettingsPagComponent);

