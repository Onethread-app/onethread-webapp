import React from 'react';
import { Icon } from '@blueprintjs/core';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';

interface NavbarResourcesListProps {
  setShowResourcesDrawer: (val: boolean) => void;
}

export const NavbarResourcesList = (
  props: NavbarResourcesListProps
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
          onClick={() => props.setShowResourcesDrawer(false)}
        />
      </div>
      <div className="pa4">
        <div className="tc">
          <p className="silver f5 fw4">Resources</p>
        </div>
        <div>
          <article className="flex items-center ba b--light-gray pa3 pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Blog</p>
                <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Read project management, freelancer success stories, b2B Partnership Strategy and many more</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Ebooks, Guides & More</p>
                <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0 w-80">Get access to TiGrow's resources about procurement, agile management and more.</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Onboarding & Services</p>
                <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Find training and consulting services to help you thrive with tiGrow.</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Customer Support</p>
                <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Get help if you have questions about Tigrow software</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
        </div>
      </div>
    </div>
  );
};
