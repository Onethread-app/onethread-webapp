import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Icon, Drawer } from '@blueprintjs/core';
import { MobileListView } from 'layouts/company/MobileListView';
interface NavbarProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

const NavbarIndividualComponent = (props: NavbarProps) => {
<<<<<<< HEAD
  return (
    <>
      <Navbar fixedToTop className="flex justify-end items-center">
        <Icon
          icon="menu"
          iconSize={25}
=======

  return (
    <>
      <Navbar fixedToTop
        className="flex justify-end items-center"
      >
        <Icon icon="menu" iconSize={25}
>>>>>>> b9e80fb9... mobile responsive for project preface
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

<<<<<<< HEAD
export const NavbarIndividual = connect(mapStateToProps)(
  NavbarIndividualComponent,
);
=======
export const NavbarIndividual = connect(mapStateToProps)(NavbarIndividualComponent);
>>>>>>> b9e80fb9... mobile responsive for project preface
