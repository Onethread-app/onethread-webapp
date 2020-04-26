import React, { useState } from 'react';
import { Tabs, Tab, Navbar, Drawer } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import user from './../../../resources/images/profilePhoto.svg';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';

const _ProjectPage = (props: any) => {

  const [showDialog, setShowDialog] = useState(false);

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
        <h3 className="f3">Projects</h3>
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
    companyRole: state.companyReducer.currentCompany.role,
    PendingProjects: state.projectReducer.pendingProjects,
    user: state.userReducer.user
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {},
)(withRouter(_ProjectPage));
