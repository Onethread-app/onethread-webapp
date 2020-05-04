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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

  return (
    <>
>>>>>>> 05623007... mobile responsive for project preface
      <Navbar fixedToTop
        className="flex justify-end items-center"
      >
        <Icon icon="menu" iconSize={25}
<<<<<<< HEAD
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
  return (
    <>
=======
  return (
    <>
>>>>>>> 4e99f05f... code style issue fixed
      <Navbar fixedToTop className="flex justify-end items-center">
        <Icon
          icon="menu"
          iconSize={25}
<<<<<<< HEAD
>>>>>>> d06346b0... code style issue fixed
=======
>>>>>>> 05623007... mobile responsive for project preface
=======
>>>>>>> 4e99f05f... code style issue fixed
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export const NavbarIndividual = connect(mapStateToProps)(
  NavbarIndividualComponent,
);
=======
export const NavbarIndividual = connect(mapStateToProps)(NavbarIndividualComponent);
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
export const NavbarIndividual = connect(mapStateToProps)(
  NavbarIndividualComponent,
);
>>>>>>> d06346b0... code style issue fixed
=======
export const NavbarIndividual = connect(mapStateToProps)(NavbarIndividualComponent);
>>>>>>> 05623007... mobile responsive for project preface
=======
export const NavbarIndividual = connect(mapStateToProps)(
  NavbarIndividualComponent,
);
>>>>>>> 4e99f05f... code style issue fixed
