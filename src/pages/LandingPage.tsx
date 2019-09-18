import React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { Icon, Divider } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';

export const LandingPage = () => {
  return (
    <div className="bg-near-white ">
      <NavbarTop/> 
      <div className="w-100 cf ">
        <div className="fl bg-white w-10 pv6 vh-100 fixed">
          <Sidebar />
        </div>
        <div className="fl w-80 mt6 ml7">
          <div className="cf">
            <h1 className="f4 lh-copy tigrow-lightGray-1 ml3">Profile</h1>
            <div className="fl w-25-ns pa2 ">
              <div className="h-auto br3 ma2 pa3 bg-white cf tc">
                <img src={user}></img>
                <h1 className="f6 lh-copy tigrow-lightGray-1">Julian Martha</h1>
                <p className="tigrow-lightGray-1">Software Developer</p>
              </div>
              <div className="h-auto br3 ma2 pa3 bg-white cf">
                <h1 className="f6 lh-copy tigrow-lightGray-1">About</h1>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                 when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
              </div>
              <div className="h-auto br3 ma2 pa3 bg-white cf">
                <h1 className="f6 lh-copy">Skills</h1>
                <div className="tc">
                <img src={skill}></img>
                <p>No skill has selected</p>
                <button className="br3 grow ph4 pointer pv2 f7 bg-white ba b--lightBlue tigrow-lightBlue outline-0">
                  Add Skills
                </button>
                </div>
              </div>
            </div>
            <div className="fl w-75-ns  ">
              <div className="br3 bg-white h-auto pa4 mt3">
                <div className="cf ">
                  <h1 className="f5 lh-copy dib">Basic Information</h1>
                  <Icon className="fr mv3 tigrow-lightBlue" icon="edit" />
                </div>
                <Divider />
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Email</h1>
                  <p>Julian Martha</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Secondary Email</h1>
                  <p>No secondary email has set</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <div className="cf dib">
                    <h1 className="f6 lh-copy">Contact Number</h1>
                    <p>+880-18421421</p>
                  </div>
                  <Icon className="fr mv4 " icon="lock" />
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Address</h1>
                  <p>Mohakhali DOHS</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Gender</h1>
                  <p>Male</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Birthdate</h1>
                  <p>13th September, 2019</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">Blood Group</h1>
                  <p>A+</p>
                </div>
              </div>
              <div className="br3 bg-white h-auto pa4 mt3">
                <div className="cf ">
                  <h1 className="f5 lh-copy dib">Educational Information</h1>
                  <Icon className="fr mv3 tigrow-lightBlue" icon="edit" />
                </div>
                <Divider />
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">School</h1>
                  <p>Julian Martha</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">College</h1>
                  <p>No secondary email has set</p>
                </div>
                <div className="br3 bg-white h-auto">
                  <h1 className="f6 lh-copy">University</h1>
                  <p>A+</p>
                </div>
              </div>
              <div className="br3 bg-white h-auto pa4 mt3">
                <div className="cf ">
                  <h1 className="f5 lh-copy dib">Experience</h1>
                  <Icon className="fr mv3 tigrow-lightBlue" icon="add" />
                </div>
                <Divider />
                <div className="br3 bg-white h-auto">
                  <img src={skill}></img>
                  <p>No experience has added</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
