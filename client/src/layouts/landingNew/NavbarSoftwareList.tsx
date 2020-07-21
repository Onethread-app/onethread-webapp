import React from 'react';
import task from './../../resources/LandingImages/task-complete.svg';
import { Icon } from '@blueprintjs/core';
import client from './../../resources/LandingImages/international-client.svg';
import business from './../../resources/LandingImages/business.svg';
import support from './../../resources/LandingImages/support.svg';
import team from './../../resources/LandingImages/team.svg';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';
import { NavLink } from 'react-router-dom';

interface NavbarSoftwareListProps {
  setShowSoftwareDrawer: (val: boolean) => void;
}

export const NavbarSoftwareList = (
  props: NavbarSoftwareListProps
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
          onClick={() => props.setShowSoftwareDrawer(false)}
        />
      </div>
      <div className="pa4 softwareList">
        <div className="tc">
          <p className="silver f5 fw4">Software</p>
        </div>
        <div>
          <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
            <img
              src={task}
            />
            <div className="ml2">
              <p className="fw7 mv0 pv0">Project Management Tool</p>
              <p className="f7 mv0 pv0">A Robust Project management tool for all type of projects!</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
            <img
              src={client}
            />
            <div className="ml2">
              <p className="fw7 mv0 pv0">Work From Home Solution</p>
              <p className="f7 mv0 pv0">An Effortless WFH Experience to manage your remote teams.</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <NavLink to="vendor-management-tool">
            <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
              <img
                src={business}
              />
              <div className="ml2">
                <div className="flex">
                  <p className="fw7 mv0 pv0">Vendor Management Tool</p>
                  <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
                </div>
                <p className="f7 mv0 pv0">Managing all those vendors wasn't this much easier before!</p>
              </div>
              <Icon className="ml-auto" icon="chevron-right" />
            </article>
          </NavLink>
          <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
            <img
              src={support}
            />
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Finding Partners</p>
                <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Search And Find Partner Companies From Around The World!</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
            <img
              src={team}
            />
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">Finding Teammates</p>
                <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Find The Perfect Team Mate For Your Team!</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
          <article className="flex items-center ba b--light-gray pa3 softwareList pointer mv2">
            <div className="ml2">
              <div className="flex">
                <p className="fw7 mv0 pv0">App Marketplace</p>
                <p style={{ backgroundColor: '#0FB7A0' }} className="br2 f7 pa1 white ml2 ma0">Upcoming</p>
              </div>
              <p className="f7 mv0 pv0">Find TiGrow apps for the tools and software you use to run your business.</p>
            </div>
            <Icon className="ml-auto" icon="chevron-right" />
          </article>
        </div>
      </div>
    </div>
  );
};
