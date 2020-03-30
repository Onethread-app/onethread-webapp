import React from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';
import { EmailVerificationForm } from './EmailVerificationForm';
import './styles.css';

import growNetworkIcon from './../../resources/images/GrowYourNetwork.svg';
import landingPic2 from './../../resources/images/landingIllustration2.png';
import boardIcon from './../../resources/images/sideBarBoard.svg';
import roomIcon from './../../resources/images/sidebarRoom.svg';
import portfolioIcon from './../../resources/images/PortfoliosIcon.svg';
import projectIcon from './../../resources/images/ProjectsIcon.svg';
import growTribeIcon from './../../resources/images/GrowYourTribes.svg';
import connectTribeIcon from './../../resources/images/ConnectWithTribes.svg';
import attractiveCompanyIcon from './../../resources/images/AttractiveCompanyProfile.svg';
import verificationIcon from './../../resources/images/GetVerified.svg';
import tigrowLogo from './../../resources/homepageImages/tigrowLogo.svg';
import heroSection from "./../../resources/homepageImages/heroSection.png";

export const HomePage = () => {

  return (
    <div>
      <div>
        <Navbar className="ph5-ns shadow-0 fixed pv3 flex justify-between h-auto" >
          <Navbar.Group align={Alignment.LEFT}>
            <img
              src={tigrowLogo}
              className="companyLogo"
              alt="Site Logo"
            />
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT} >
            <a href="/signin"
              className="tryLink"
            >
              Try for free
              </a>
          </Navbar.Group>
        </Navbar>
      </div>
      <div className="pl5-l pl4 pt6 pb4">
        <div className="flex-ns items-center pl5-ns">
          <div className="w-40-ns w-100">
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
              <a href="#"
                className="tryLink"
              >
                See The Demo
              </a>
            </div>
            <ul className='homeUl'>
              <li className="featureTitle">
                Full access to all features 
                </li>
              <li className="featureTitle">
                Zero obligation, no credit card needed 
                </li>
              <li className="featureTitle">
                Add unlimited users Access to sales and technical support 
                </li>
              <li className="featureTitle">
                Test drive with 15-day free trial
              </li>
            </ul>
            <div className='demoLink'>
              <a href="/signin"
                className="tryLink"
              >
                Try for free
              </a>
            </div>
          </div>
          <div className="w-60-ns h-100-ns w-100 h-100" style={{backgroundImage: heroSection}}>
            <img
              src={heroSection}
              style={{}}
            />
          </div>
        </div>
      </div>
      <div
        className="flex-ns items-center pv6-ns pv4 ph2"
        style={{
          backgroundColor: '#474DBB'
        }}
      >
        <div className="w-50-ns w-100 tc mb4 mb0-ns">
          <h1 className="white f2-ns mt0"
          >Workplace</h1>
          <p className="white-90 f4 mb4"
            style={{ lineHeight: '2.5rem' }}
          >A Team Collaboration Tool
            <br />The easiest way to manage team
            <br />projects and tasks</p>
          <a
            href="/signup"
            className="grow ph4 pointer f5 fw7 pv3"
            style={{
              background: 'white',
              outline: 'none',
              color: '#474DBB',
              borderRadius: '25px',
              border: 'none',
              height: '50px'
            }}
            type="submit"
          >Try for free</a>
        </div>
        <div className="w-50-ns w-100 tc">
          <h1 className="white f2-ns mt0"
          >Tribe</h1>
          <p className="white-90 f4 mb4"
            style={{ lineHeight: '2.5rem' }}
          >Business Lead Generation was never this simple
            <br />Showcase your product/service in the largest
            <br />enterprise network in the world</p>
          <a
            href="/signup"
            className="grow ph4 pointer f5 fw7 pv3"
            style={{
              background: 'white',
              outline: 'none',
              color: '#474DBB',
              borderRadius: '25px',
              border: 'none',
              height: '50px'
            }}
            type="submit"
          >Create your company profile for free</a>
        </div>
      </div>
      <div id="features" className="tc mv5 ph4">
        <h1 className="black f2-ns">The Easiest Way To Manage Team Projects and Tasks</h1>
        <div className="flex-ns mt6-ns mt2">
          <div className="w-25-ns w-100 ph2">
            <img
              style={{ width: '60px' }}
              src={boardIcon} />
            <h1>Board</h1>
            <p className="f5 fw6">Communicate with your Team in<br /> the most effective manner.</p>
            <p className="f5 fw6 mt3">We revisioned chat features for<br /> the best user experience.</p>
            <p className="f5 fw6 mt3">You can now select featured chats<br />
              and see them separately as <br />
              discussion topics.</p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img
              style={{ width: '60px' }}
              src={roomIcon} />
            <h1 className="">Room</h1>
            <p className="f5 fw6">See where everything stands<br />Visualize your work.</p>
            <p className="f5 fw6 mt3">Move work, through multiple stages<br />quickly, easily, and beautifully.</p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img
              style={{ width: '60px' }}
              src={portfolioIcon} />
            <h1>Portfolios</h1>
            <p className="f5 fw6">Monitor the status of key<br />initiatives in real time.</p>
            <p className="f5 fw6 mt3">See how all your projects are<br />progressing in real time with Portfolios.</p>
            <p className="f5 fw6 mt3">So you can proactively
            <br />address risks and report updates to
            <br />stakeholders.</p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img
              style={{ width: '60px' }}
              src={projectIcon} />
            <h1>Projects</h1>
            <p className="f5 fw6">Hit your goals, without the
            <br />scramble Make every<br />
              project a success.</p>
            <p className="f5 fw6 mt3">Map out each step and
            <br />organize all the details of your<br />
              work in one place.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-ns items-center ph6-ns ph4 pv5-ns">
        <div className="w-40-ns w-100 pl4">
          <h1 className="black f2-ns">Introducing Tribe</h1>
          <h1 className="black f3-ns">So, What is Tribe?</h1>
          <p className="f4 fw6 lh-2">Any Enterprise With All It's<br />
            Business Associates is a Tribe.</p>
          <p className="f4 fw6 mt3 lh-2">The World is Filled with Lots<br />
            of Disconnected Tribes.</p>
          <p className="f4 fw6 mt3 lh-2">We want to create connectivity<br />
            among them.</p>
          <p className="f4 fw6 mt3 lh-2">Grow your Network with<br />
            TiGrow.
          </p>
          <h1 className="f4"
            style={{ color: '#474DBB' }}
          >Coming Soon</h1>
        </div>
        <div className="w-50-ns w-100">
          <img
            src={landingPic2} />

        </div>
      </div>
      <div className="flex-ns items-center tc mv5">
        <div className="w-50-ns w-100 pv6-ns pv2"
          style={{ backgroundColor: '#EAF6F0' }}
        >
          <img
            style={{ width: '60px' }}
            src={growTribeIcon} />
          <h1 className="f2-ns">Grow Your Tribe</h1>
          <p className="f5 fw6 lh-2">Connect all of your Business Associates
            <br />in your Tribe.</p>
          <p className="f5 fw6 lh-2 mt3">Create small groups and<br />
            maintain communications in one place.
            </p>
        </div>
        <div
          className="w-50-ns w-100 pv6-ns pv2"
          style={{ backgroundColor: '#F4F5FB' }}
        >
          <img
            style={{ width: '60px' }}
            src={connectTribeIcon} />
          <h1 className="f2-ns">Connect with Tribes</h1>
          <p className="f5 fw6 lh-2">Connect with millions of Tribes all around
            <br />the world.</p>
          <p className="f5 fw6 lh-2 mt3">Showcase your product/service in the largest<br />
            enterprise network of the world.
            </p>
        </div>
      </div>
      <div className="tc pv5-ns pv3 ph2">
        <h1 className="f2-ns black">Three Easy Steps to Get Connected With Millions<br />
          of Enterprises All Around The World</h1>
        <div className="flex-ns justify-center pv5">
          <div className="w-30-ns w-100">
            <img
              style={{ width: '60px' }}
              src={attractiveCompanyIcon} />
            <h1 className="f3-ns f4 black lh-2">Create an Attractive<br /> Company Profile</h1>
          </div>
          <div className="w-30-ns w-100">
            <img
              style={{ width: '60px' }}
              src={verificationIcon} />
            <h1 className="f3-ns f4 black lh-2">Get Verified</h1>
          </div>
          <div className="w-30-ns w-100">
            <img
              style={{ width: '60px' }}
              src={growNetworkIcon} />
            <h1 className="f3-ns f4 black lh-2">Start approaching Tribes<br />
              to grow your network<br />
              immediately.
          </h1>
          </div>
        </div>
        <a
          href="/signup"
          className="grow ph4 pointer f5 fw6 pv3"
          style={{
            background: '#474DBB',
            outline: 'none',
            color: 'white',
            borderRadius: '25px',
            border: 'none',
            height: '50px'
          }}
          type="submit"
        >Create your company profile for free</a>
      </div>
      <div
        className="pv4 tc"
        style={{ background: '#43466D' }}
      >
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