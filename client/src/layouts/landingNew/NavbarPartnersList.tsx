import React from 'react';
import { Icon } from '@blueprintjs/core';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';
import { NavLink } from 'react-router-dom';

interface NavbarPartnersListProps {
  setShowPartnersDrawer: (val: boolean) => void;
}

export const NavbarPartnersList = (
  props: NavbarPartnersListProps
) => {

  return (
    <div className="w-100">
      <div
        className="top-0 z-2 flex justify-between items-center ph4 w-100"
        style={{
          height: '70px',
          position: 'sticky',
          backgroundColor: '#F0FBFF'
        }}
      >
        <NavLink to="/">
          <img className="mr1" style={{ width: '50px' }} src={tigrowMini} />
        </NavLink>
        <Icon
          icon="cross"
          iconSize={35}
          className="blue"
          onClick={() => props.setShowPartnersDrawer(false)}
        />
      </div>
      <div className="pa4 partnersList">
        <div className="tc">
          <p className="silver f5 fw4">Partners</p>
        </div>
        <div>
          <article className="flex items-center ba b--light-gray pa3 partnersList pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Hire a Partner</p>
                <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0 w-80">
                Find a partner in our global community of service providers who can help you grow.
              </p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 partnersList pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Partner with Us</p>
                <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Find the right partner program to help your business to grow.</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
        </div>
      </div>
    </div>
  );
};
