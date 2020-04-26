import React, { useState } from 'react';
import { Tabs, Tab, Navbar, Drawer } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { NavbarCompany } from 'components/NavbarCompany';

const _ProjectPage = (props: any) => {
<<<<<<< HEAD
=======
import user from './../../../resources/images/profilePhoto.svg';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';

const _ProjectPage = (props: any) => {

  const [showDialog, setShowDialog] = useState(false);

>>>>>>> 05623007... mobile responsive for project preface
  return (
    <>
      <MobileView>
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
          <h1 className="f3">My Projects</h1>
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
      <div className="ph5-ns ph4 pt5 pt0-ns">
<<<<<<< HEAD
=======
import user from './../../../resources/images/profilePhoto.svg';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';
=======
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> a51ad486... Feature/mobile responsive (#148)

const _ProjectPage = (props: any) => {

=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
  return (
    <>
      <NavbarCompany title="My Projects" />
      <div className="ph5-ns ph4 pt5 pt0-ns">
<<<<<<< HEAD
        <h3 className="f3">Projects</h3>
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
        <h3 className="f3">Projects</h3>
>>>>>>> 05623007... mobile responsive for project preface
        <Tabs id="TabsExample">
          <Tab
            id="MyProjects"
            title="My Projects"
            panel={<MyProject />}
            className="outline-0 mt4-ns mt2"
          />
          {props.companyRole !== 'employee' && (
            <Tab
              id="PendingProject"
              title="Pending Projects"
              panel={<PendingProjectRequest />}
              className="outline-0 mt4-ns mt2"
            />
          )}
        </Tabs>
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 05623007... mobile responsive for project preface
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
<<<<<<< HEAD
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> 05623007... mobile responsive for project preface
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
    PendingProjects: state.projectReducer.pendingProjects,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    user: state.userReducer.user,
=======
    user: state.userReducer.user
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
    user: state.userReducer.user,
>>>>>>> d06346b0... code style issue fixed
=======
    user: state.userReducer.user
>>>>>>> 05623007... mobile responsive for project preface
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {},
)(withRouter(_ProjectPage));
