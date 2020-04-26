import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Icon, Drawer } from '@blueprintjs/core';
import { MobileListView } from 'layouts/company/MobileListView';
interface NavbarProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

const NavbarIndividualComponent = (props: NavbarProps) => {

  return (
    <>
      <Navbar fixedToTop
        className="flex justify-end items-center"
      >
        <Icon icon="menu" iconSize={25}
          className="blue"
          onClick={() => props.setShowDialog(true)}
        />
      </Navbar>
      {props.showDialog && (
        <Drawer
          onClose={() => props.setShowDialog(!props.showDialog)}
          isOpen={props.showDialog}
          canOutsideClickClose={false}
          style={{ width: '70%' }}
        >
          <div>
            <MobileListView
              showDialog={props.showDialog}
              setShowDialog={props.setShowDialog}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const NavbarIndividual = connect(mapStateToProps)(NavbarIndividualComponent);
