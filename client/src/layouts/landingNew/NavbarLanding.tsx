import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Popover, Icon, Drawer, Position } from '@blueprintjs/core';
import task from './../../resources/LandingImages/task-complete.svg';
import client from './../../resources/LandingImages/international-client.svg';
import business from './../../resources/LandingImages/business.svg';
import support from './../../resources/LandingImages/support.svg';
import team from './../../resources/LandingImages/team.svg';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';
import { CustomView, isMobileOnly, MobileOnlyView } from 'react-device-detect';
import { NavbarListView } from './NavbarListView';

export const NavbarLanding = () => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <CustomView condition={!isMobileOnly}>
        <div
          className="top-0 z-2 flex justify-between items-center ph5 ph1-m navmain w-100"
          style={{
            height: '70px',
            position: 'fixed',
            backgroundColor: '#F0FBFF'
          }}
        >
          <div className="flex items-center">
            <NavLink to="/">
              <img className="mr1 tigrowLogo"  src={tigrowMini} />
            </NavLink>
            <Popover
              position={Position.BOTTOM}
              popoverClassName="pv4 ph3 bg-white"
              targetClassName="h-100"
              className=""
              content={
                <>
                  <article className="flex bb b--light-silver pb3 pointer">
                    <img
                      src={task}
                    />
                    <div className="ml2">
                      <p className="fw7 mv0 pv0">Project Management Tool</p>
                      <p className="f7 mv0 pv0">A Robust Project management tool for all type of projects!</p>
                    </div>
                  </article>
                  <article className="flex pt4 pointer">
                    <img
                      src={client}
                    />
                    <div className="ml2">
                      <p className="fw7 mv0 pv0">Work From Home Solution</p>
                      <p className="f7 mv0 pv0">An Effortless WFH Experience to manage your remote teams.</p>
                    </div>
                  </article>
                  <NavLink to="vendor-management-tool">
                    <article className="flex pt4 pointer">
                      <img
                        src={business}
                      />
                      <div className="ml2">
                        <div className="flex">
                          <p className="fw7 mv0 pv0">Vendor Management Tool</p>
                          <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
                        </div>
                        <p className="f7 mv0 pv0">Managing all those vendors wasn't this much easier before!</p>
                      </div>
                    </article>
                  </NavLink>
                  <article className="flex pt4 pointer">
                    <img
                      src={support}
                    />
                    <div className="ml2">
                      <div className="flex">
                        <p className="fw7 mv0 pv0">Finding Partners</p>
                        <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
                      </div>
                      <p className="f7 mv0 pv0">Search And Find Partner Companies From Around The World!</p>
                    </div>
                  </article>
                  <article className="flex pt4 bb b--light-silver pb3 pointer">
                    <img
                      src={team}
                    />
                    <div className="ml2">
                      <div className="flex">
                        <p className="fw7 mv0 pv0">Finding Teammates</p>
                        <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
                      </div>
                      <p className="f7 mv0 pv0">Find The Perfect Team Mate For Your Team!</p>
                    </div>
                  </article>
                  <article className="pt3 pointer">
                    <div className="flex">
                      <p className="fw7 mv0 pv0">App Marketplace</p>
                      <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
                    </div>
                    <p className="f7 mv0 pv0">Find TiGrow apps for the tools and software you use to run your business.</p>
                  </article>
                </>
              }
              target={
                <Button
                  style={{ color: "#707070" }}
                  className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding"
                  rightIcon="caret-down">
                  Software
            </Button>
              }
            />
            <NavLink to="/pricing">
              <Button
                style={{ color: "#707070" }}
                className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding">
                Pricing
              </Button>
            </NavLink>
            <Popover
              position={Position.BOTTOM}
              popoverClassName="pv4 ph3 bg-white"
              targetClassName="h-100"
              className=""
              content={
                <div style={{ width: '35rem' }}>
                  <div className="flex pb3 bb b--light-silver">
                    <article className="pointer">
                      <div className="flex">
                        <p className="fw7 mv0 pv0">Blog</p>
                        <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
                      </div>
                      <p className="f7 mv0 pv0">Read project management, freelancer success stories, b2B Partnership Strategy and many more</p>
                    </article>
                    <article className="pointer pl3">
                      <div className="flex">
                        <p className="fw7 mv0 pv0">Ebooks, Guides & More</p>
                        <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
                      </div>
                      <p className="f7 mv0 pv0">Get access to TiGrow's resources about procurement, agile management and more.</p>
                    </article>
                  </div>
                  <div className="flex pt3">
                    <article className="pointer">
                      <div className="flex">
                        <p className="fw7 mv0 pv0">Onboarding & Services</p>
                        <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
                      </div>
                      <p className="f7 mv0 pv0">Find training and consulting services to help you thrive with tiGrow.</p>
                    </article>
                    <article className="pointer pl3">
                      <p className="fw7 pv0">Customer Support</p>
                      <p className="f7 mv0 pv0">Get help if you have questions about TiGrow software.</p>
                    </article>
                  </div>
                </div>
              }
              target={
                <Button
                  style={{ color: "#707070" }}
                  className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding"
                  rightIcon="caret-down">
                  Resources
            </Button>
              }
            />
            <Popover
              position={Position.BOTTOM}
              popoverClassName="pv4 ph3 bg-white"
              targetClassName="h-100"
              className=""
              content={
                <div style={{ width: '33rem' }} className="flex">
                  <article className="pointer">
                    <div className="flex">
                      <p className="fw7 mv0 pv0">Hire a Partner</p>
                      <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
                    </div>
                    <p className="f7 mv0 pv0">Find a partner in our global community of service providers who can help you grow.</p>
                  </article>
                  <article className="pointer pl3">
                    <div className="flex">
                      <p className="fw7 mv0 pv0">Partner with Us</p>
                      <p style={{ backgroundColor: "#0FB7A0" }} className="br2 f7 pa1 white ml2 ">Upcoming</p>
                    </div>
                    <p className="f7 mv0 pv0">Find the right partner program to help your business to grow.</p>
                  </article>
                </div>
              }
              target={
                <Button
                  style={{ color: "#707070" }}
                  className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding"
                  rightIcon="caret-down">
                  Partners
            </Button>
              }
            />
            <NavLink to="#">
              <Button
                style={{ color: "#707070" }}
                className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding">
                Teammate
              </Button>
            </NavLink>
            <Popover
              position={Position.BOTTOM}
              popoverClassName="pa4 bg-white"
              targetClassName="h-100"
              className=""
              content={
                <div style={{ width: '20rem' }} className="flex">
                  <div className="flex flex-column">
                    <h1 className="f6">Company</h1>
                    <small className="pointer mv1">About Us</small>
                    <small className="pointer mv1">Contact Us</small>
                    <small className="pointer mv1">Management Team</small>
                    <small className="pointer mv1">Investors and Advisers</small>
                    <small className="pointer mv1">Careers</small>
                  </div>
                  <div className="flex flex-column">
                    <h1 className="f6">News</h1>
                    <small className="pointer mv1">TiGrow News</small>
                    <small className="pointer mv1">Press Resources</small>
                  </div>
                </div>
              }
              target={
                <Button
                  style={{ color: "#707070" }}
                  className="bp3-minimal outline-0 h-100 f5-l f7-m fw6 pa1-m targetPadding"
                  rightIcon="caret-down">
                  About
            </Button>
              }
            />
          </div>
          <div>
            <NavLink to="/signin">
              <Button
                className="f4-l f7-m fw7-l bp3-minimal pa2-l w4-l br2 mr3-l"
                style={{ color: '#4B6BC8', border: 'solid 2px #4B6BC8', backgroundColor: 'white' }}
              >
                SIGN IN
              </Button>
            </NavLink>
            <NavLink to="/signup">
              <Button
                className="f5-l f7-m fw6-l bp3-minimal pa2-l br2 ml2-m"
                style={{ color: 'WHITE', border: 'solid 4px #4B6BC8', backgroundColor: '#4B6BC8' }}
              >
                GET TiGrow FREE
              </Button>
            </NavLink>

          </div>
        </div>
      </CustomView>
      <MobileOnlyView>
        <div
          className="top-0 z-2 flex justify-between items-center ph2-ns ph2 w-100"
          style={{
            height: '70px',
            position: 'fixed',
            backgroundColor: '#F0FBFF'
          }}
        >
          <NavLink to="/">
            <img className="mr1" style={{ width: isMobileOnly ? '40px' : '50px' }} src={tigrowMini} />
          </NavLink>
          <Icon
            icon="menu"
            iconSize={25}
            className="blue"
            onClick={() => setShowDialog(true)}
          />
        </div>
      </MobileOnlyView>
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <NavbarListView
              setShowDialog={setShowDialog}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};