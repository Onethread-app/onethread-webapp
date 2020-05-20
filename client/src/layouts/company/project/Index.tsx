import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { NavbarCompany } from 'components/NavbarCompany';

const _ProjectPage = (props: any) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
import user from './../../../resources/images/profilePhoto.svg';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';
=======
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> 2650e2be... Feature/mobile responsive (#148)

const _ProjectPage = (props: any) => {

>>>>>>> 05623007... mobile responsive for project preface
  return (
    <>
      <NavbarCompany title="My Projects" />
      <div className="ph5-ns ph4 pt5 pt0-ns">
<<<<<<< HEAD
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
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
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
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
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
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
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
=======
    user: state.userReducer.user,
>>>>>>> 4e99f05f... code style issue fixed
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {},
)(withRouter(_ProjectPage));
