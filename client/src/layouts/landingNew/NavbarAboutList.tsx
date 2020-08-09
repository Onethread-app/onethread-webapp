import React from 'react';
import { Icon } from '@blueprintjs/core';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';

interface NavbarAboutListProps {
  setShowAboutDrawer: (val: boolean) => void;
}

export const NavbarAboutList = (
  props: NavbarAboutListProps
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
        <img className="mr1" style={{ width: '50px' }} src={tigrowMini} />
        <Icon
          icon="cross"
          iconSize={35}
          className="blue"
          onClick={() => props.setShowAboutDrawer(false)}
        />
      </div>
      <div className="pa4 aboutList">
        <div className="tc">
          <p className="silver f5 fw4">About</p>
        </div>
        <div>
          <p className="b--light-silver ba bg-light-gray br3 f5 fw6 pa3 aboutList tc w-100">Company</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">About Us</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Contact</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Management Team</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Investors and Advisers</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Careers</p>
        </div>
        <div>
          <p className="b--light-silver ba bg-light-gray br3 f5 fw6 pa3 aboutList tc w-100">News</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Tigrow News</p>
          <p className="b--light-silver ba  br3 fw6 pa3 aboutList w-100 f5">Press Resources</p>
        </div>
      </div>
    </div>
  );
};
