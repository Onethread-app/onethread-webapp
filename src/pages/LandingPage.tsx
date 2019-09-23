import React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { Icon, Divider } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';
import { BasicInfoList } from 'components/company/BasicInfoList';
import { EduInfoList } from 'components/company/EduInfoList';

export const LandingPage = () => {
  return (
    <div className="bg-near-white ">
      <NavbarTop />
      <div className="w-100 cf ">
        <div className="fl bg-white w-10 pv6 vh-100 fixed">
          <Sidebar />
        </div>
        <div className="fl w-80 mt6 ml7">
          <div className="cf">
            <h1 className="f5 lh-title tigrow-lightGray-1 ml3 tigrow-lightGray-1 mb0">Profile</h1>
            <div>
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
              <div className="fl w-75-ns">
                <BasicInfoList />
                <EduInfoList />
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
      </div>
    </div >
  )
}
