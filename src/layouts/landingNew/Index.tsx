import React from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';
import { EmailVerificationForm } from './EmailVerificationForm';
import './styles.css';

import tigrowLogo from './../../resources/homepageImages/tigrowLogo.svg';
import heroSection from "./../../resources/homepageImages/heroSection.png";
import projects from "./../../resources/homepageImages/projects.png";
import project from "./../../resources/homepageImages/project.svg";
import chat from "./../../resources/homepageImages/chat.svg";
import board from "./../../resources/homepageImages/board.svg";
import customers from "./../../resources/homepageImages/customers.png";
import pack1 from "./../../resources/homepageImages/pack1.png";
import pack2 from "./../../resources/homepageImages/pack2.png";
import pack3 from "./../../resources/homepageImages/pack3.png";
import offers from "./../../resources/homepageImages/offers.png";
import service from './../../resources/homepageImages/service.png';
import meet from './../../resources/homepageImages/meet.png';

export const HomePage = () => {

  return (
    <div>
      <div>
        <Navbar className="ph5-ns shadow-0 fixed pv3 flex justify-between h-auto" >
          <Navbar.Group align={Alignment.LEFT}>
            <img src={tigrowLogo} className="companyLogo" alt="Site Logo"/>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT} >
            <a href="/signin" className="tryLink">Try for free</a>
          </Navbar.Group>
        </Navbar>
      </div>
      <div className="pl5-l pt6 pb4">
        <div className="flex-ns items-center pl5-ns">
          <div className="w-40-ns w-100 pl0-ns pl4">
            <div className="black primeText">An Enterprise Connectivity Platform</div>
            <div className="black secondaryText">where you can</div>
            <ul className='homeUl'>
              <li className="featureTitle">
                Manage Teams &amp; Projects on One Platform
              </li>
              <li className="featureTitle">
                Create Alliances with Thousands of Small &amp; Medium Enterprises
              </li>
            </ul>
            <div className='demoLink'>
              <a href="#" className="tryLink">See The Demo</a>
            </div>
            <ul className='homeUl light'>
              <li className="featureTitle">
                Full access to all features 
                </li>
              <li className="featureTitle">
                Zero obligation, no credit card needed 
                </li>
              <li className="featureTitle">
                Add unlimited users
                </li>
                <li className="featureTitle">
                Access to sales and technical support 
                </li>
              <li className="featureTitle">
                Test drive with 15-day free trial
              </li>
            </ul>
            <div className='demoLink'>
              <a href="/signin" className="tryLink">Try for free</a>
            </div>
          </div>
          <div className="w-60-ns w-100 tr">
            <img src={heroSection} alt="hero Section"/>
          </div>
        </div>
      </div>
      <div className="w-70-ns w100 center pv5-ns tc titleText">
        Use TiGrow Workplace for Remote Working with Teams, For Vendor Management &amp; To Collaborate with All of your Stakeholders at one place.
      </div>
      <div className="flex-ns items-center pl4-l pl4 ph2 pv4-ns">
        <div className="pl5-ns w-60-ns h-100-ns w-100 h-100">
          <img src={projects}/>
        </div>
        <div className="pr5-ns w-40-ns h-100-ns w-100 h-100 center">
          <div className="titleText tc" style={{fontWeight: 200}}>
            <span style={{color: '#588F8F', fontWeight: 'bold'}}>Introducing Projects</span><br/>Create Projects With <span style={{fontWeight: 'bold'}}>Single Department</span>, <span style={{fontWeight: 'bold'}}>Multiple Departments</span><br/>or <span style={{fontWeight: 'bold'}}>With External Stakeholders of the Company</span>
          </div>
        </div>
      </div>
      <div className="flex-ns items-center pl4-l pl4 ph4-ns pv4-ns" style={{justifyContent: 'space-around'}}>
        <div className="pl5-ns w-20-ns h-100-ns w-100 h-100">
          <img src={project} alt=""/>
        </div>
        <div className="pr5-ns pl4-ns w-80-ns h-100-ns w-100 h-100">
          <img src={chat} alt=""/>
          <div className="titleText tc pv4">
            <span style={{color: '#588F8F'}}>Chat from anywhere through Rooms</span><br/>Share your opinion, and your personality. Highlight Important <br/> Discussion in a group chat or in one-to-one messages.
          </div>
          <img src={board} alt=""/>
        </div>
      </div>
      <div className="flex-ns items-center pl4-l pl4 ph2" style={{justifyContent: 'space-around'}}>
        <div className="pl5-ns w-50-ns h-100-ns w-100 h-100">
          <div className="titleText tc">
            <span style={{color: '#588F8F'}}>Meet from anywhere</span><br/>
            Use video conference with features <br/> like screen sharing. Teams of 10 or <br/> 10,000 can meet in one place, no <br/> matter how many places they’re in.
          </div>
        </div>
        <div className="pr5-ns w-50-ns h-100-ns w-100 h-100">
          <img src={meet} style={{padding: '5rem', paddingLeft: 0}}/>
        </div>
      </div>
      <div className="flex-ns items-center ph6-ns ph4 pv3-ns">
        <div className="w-80-ns w-100 center">
            <img src={service} alt="funtionality tabs"/>
        </div>
      </div>
      <div className="flex-ns items-center ph6-ns ph4 pv3-ns">
        <div className="w-90-ns w-100 center">
            <img src={offers} alt="top offers"/>
        </div>
      </div>
      <div className="w-80-ns w100 center pv5 ph3-ns tc titleText">
        <span style={{color: '#588F8F', fontWeight: 'bold'}}>
          Tribe Feature To Create Alliances with Thousands of Small &amp; Medium Enterprises. 
        </span><br/>
        Then Start Working In Projects With Them in TiGrow Workplace. Why Waste Time Switching Between Multiple Platforms!!
      </div>
      <div className="flex-ns items-center pv5-ns pv4 ph2" style={{ backgroundColor: 'rgba(215, 197, 255, 0.4)', flexDirection: 'column' }}>
        <div className="w-80-ns w-100 tc center mb4 mb0-ns secondaryText" style={{fontWeight: 'bold', color: '#3E5578'}}>
          It's Completely Free for 15 Days, Let's Onboard
        </div>
        <a href="/signin" className="tryLink light mt2" style={{fontSize: '1.2rem'}}>Try for free</a>
      </div>
      <div className="flex-ns items-center ph6-ns ph4 pv5-ns">
        <div className="w-60-ns w-100 center">
          <div className="flex-ns items-baseline">
            <a href="/signup"><img src={pack1} alt="packages"/></a>
            <a href="/signup"><img src={pack2} alt="packages"/></a>
            <a href="/signup"><img src={pack3} alt="packages"/></a>
          </div>
        </div>
      </div>
      <div className="w-70-ns w100 center pt4-ns tc titleText">
        Trusted by over 1,000 customers world-wide
      </div>
      <div className="w-70-ns w100 center pb4-ns">
        <img src={customers} alt="customers"/>
      </div>
      <div className="pv4 tc" style={{ background: '#43466D' }}>
        <h1 className="f2-ns white">Join Today</h1>
        <div className="dt center w-34-ns w-80 mb3">
          <EmailVerificationForm />
        </div>
        <div className="dt center w-34-ns w-80 mb5 footerText">
          Contact us at rubaiyat@tigrow.co for Enterprise Solution
        </div>
        <small className="white footerText">
          © {(new Date().getFullYear())} TiGrow Inc. - House 208, Road 12, Mohakhali DOHS, Dhaka, 1205, Bangladesh
          </small>
      </div>
    </div>
  );
};