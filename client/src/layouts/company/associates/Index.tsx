import React, { useState } from 'react';
import { Tabs, Tab, Navbar, Drawer } from '@blueprintjs/core';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';
import user from './../../../resources/images/profilePhoto.svg';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';

interface AssociatesPageProps {
  user: User;
}

const AssociatesPageComponent = (props: AssociatesPageProps) => {

  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="ph4 w-100">
      <MobileView>
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
          <h1 className="f3">My Associates</h1>
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
      <Tabs id="associatesTab" className="mt5 mt0-ns">
        <Tab
          id="associates"
          title="Associates"
          panel={<AssociateList />}
          className="outline-0"
        />
        <Tab
          id="pending_associates"
          title="Pending Associates"
          panel={<PendingAssociateList />}
          className="outline-0"
        />
      </Tabs>
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
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const AssociatesPage = connect(mapStateToProps, null)(AssociatesPageComponent);