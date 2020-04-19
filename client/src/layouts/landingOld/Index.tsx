import React from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';
import { EmailVerificationForm } from './EmailVerificationForm';

import growNetworkIcon from './../../resources/images/GrowYourNetwork.svg';
import landingPic1 from './../../resources/images/landingIllustration1.png';
import landingPic2 from './../../resources/images/landingIllustration2.png';
import boardIcon from './../../resources/images/sideBarBoard.svg';
import roomIcon from './../../resources/images/sidebarRoom.svg';
import portfolioIcon from './../../resources/images/PortfoliosIcon.svg';
import projectIcon from './../../resources/images/ProjectsIcon.svg';
import growTribeIcon from './../../resources/images/GrowYourTribes.svg';
import connectTribeIcon from './../../resources/images/ConnectWithTribes.svg';
import attractiveCompanyIcon from './../../resources/images/AttractiveCompanyProfile.svg';
import verificationIcon from './../../resources/images/GetVerified.svg';
import tigrowLogo from './../../resources/images/TiGrowLogoFinal.png';

export const HomePage = () => {
  return (
    <div>
      <div>
        <Navbar className="ph5-ns shadow-0 fixed pv3 flex justify-between h-auto">
          <Navbar.Group align={Alignment.LEFT}>
            <img
              src={tigrowLogo}
              className=""
              alt="Site Logo"
              style={{ width: '8rem' }}
            />
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <a
              href="#features"
              className="link black f4-l f5-m f5 fw7 mh4-l mh2-m mr1"
              style={{ outline: '0px' }}
            >
              Features
            </a>
            <a
              href="/signin"
              className="link black ba bw1 f4-l f5-m f5 fw7 mh4-l mh2-m"
              style={{
                outline: '0px',
                borderRadius: '24px',
                padding: '8px 34px',
              }}
            >
              Login
            </a>
          </Navbar.Group>
        </Navbar>
      </div>
      <div className="ph5-l ph4 pt6 pb4">
        <div className="flex-ns items-center ph5-ns">
          <div className="w-60-ns w-100">
            <h1 className="f2-ns black">
              An Enterprise Connectivity Platform
            </h1>
            <p className="f4 lh-2">
              We have launched our Team Collaboration Tool with
              <br />
              enterprise-grade durability, performance, and superior
              <br />
              security at a fraction of the cost of already existing
              <br />
              solutions in the market.
            </p>
            <div className="mt1">
              <h1 className="f4 lh-2" style={{ color: '#474DBB' }}>
                Join thousands of small, medium enterprises <br />
                already using the network.
              </h1>
            </div>
            <div className="mt5 mb3">
              <a
                href="#"
                className="link black ba bw1 f5-ns fw7"
                style={{
                  outline: '0px',
                  borderRadius: '24px',
                  borderColor: '#474DBB',
                  padding: '10px 35px',
                }}
              >
                See The Demo
              </a>
            </div>
          </div>
          <div className="w-40-ns w-100">
            <img src={landingPic1} />
          </div>
        </div>
      </div>
      <div
        className="flex-ns items-center pv6-ns pv4 ph2"
        style={{
          backgroundColor: '#474DBB',
        }}
      >
        <div className="w-50-ns w-100 tc mb4 mb0-ns">
          <h1 className="white f2-ns mt0">Workplace</h1>
          <p
            className="white-90 f4 mb4"
            style={{ lineHeight: '2.5rem' }}
          >
            A Team Collaboration Tool
            <br />
            The easiest way to manage team
            <br />
            projects and tasks
          </p>
          <a
            href="/signup"
            className="grow ph4 pointer f5 fw7 pv3"
            style={{
              background: 'white',
              outline: 'none',
              color: '#474DBB',
              borderRadius: '25px',
              border: 'none',
              height: '50px',
            }}
            type="submit"
          >
            Try for free
          </a>
        </div>
        <div className="w-50-ns w-100 tc">
          <h1 className="white f2-ns mt0">Tribe</h1>
          <p
            className="white-90 f4 mb4"
            style={{ lineHeight: '2.5rem' }}
          >
            Business Lead Generation was never this simple
            <br />
            Showcase your product/service in the largest
            <br />
            enterprise network in the world
          </p>
          <a
            href="/signup"
            className="grow ph4 pointer f5 fw7 pv3"
            style={{
              background: 'white',
              outline: 'none',
              color: '#474DBB',
              borderRadius: '25px',
              border: 'none',
              height: '50px',
            }}
            type="submit"
          >
            Create your company profile for free
          </a>
        </div>
      </div>
      <div id="features" className="tc mv5 ph4">
        <h1 className="black f2-ns">
          The Easiest Way To Manage Team Projects and Tasks
        </h1>
        <div className="flex-ns mt6-ns mt2">
          <div className="w-25-ns w-100 ph2">
            <img style={{ width: '60px' }} src={boardIcon} />
            <h1>Board</h1>
            <p className="f5 fw6">
              Communicate with your Team in
              <br /> the most effective manner.
            </p>
            <p className="f5 fw6 mt3">
              We revisioned chat features for
              <br /> the best user experience.
            </p>
            <p className="f5 fw6 mt3">
              You can now select featured chats
              <br />
              and see them separately as <br />
              discussion topics.
            </p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img style={{ width: '60px' }} src={roomIcon} />
            <h1 className="">Room</h1>
            <p className="f5 fw6">
              See where everything stands
              <br />
              Visualize your work.
            </p>
            <p className="f5 fw6 mt3">
              Move work, through multiple stages
              <br />
              quickly, easily, and beautifully.
            </p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img style={{ width: '60px' }} src={portfolioIcon} />
            <h1>Portfolios</h1>
            <p className="f5 fw6">
              Monitor the status of key
              <br />
              initiatives in real time.
            </p>
            <p className="f5 fw6 mt3">
              See how all your projects are
              <br />
              progressing in real time with Portfolios.
            </p>
            <p className="f5 fw6 mt3">
              So you can proactively
              <br />
              address risks and report updates to
              <br />
              stakeholders.
            </p>
          </div>
          <div className="w-25-ns w-100 ph2">
            <img style={{ width: '60px' }} src={projectIcon} />
            <h1>Projects</h1>
            <p className="f5 fw6">
              Hit your goals, without the
              <br />
              scramble Make every
              <br />
              project a success.
            </p>
            <p className="f5 fw6 mt3">
              Map out each step and
              <br />
              organize all the details of your
              <br />
              work in one place.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-ns items-center ph6-ns ph4 pv5-ns">
        <div className="w-40-ns w-100 pl4">
          <h1 className="black f2-ns">Introducing Tribe</h1>
          <h1 className="black f3-ns">So, What is Tribe?</h1>
          <p className="f4 fw6 lh-2">
            Any Enterprise With All It's
            <br />
            Business Associates is a Tribe.
          </p>
          <p className="f4 fw6 mt3 lh-2">
            The World is Filled with Lots
            <br />
            of Disconnected Tribes.
          </p>
          <p className="f4 fw6 mt3 lh-2">
            We want to create connectivity
            <br />
            among them.
          </p>
          <p className="f4 fw6 mt3 lh-2">
            Grow your Network with
            <br />
            TiGrow.
          </p>
          <h1 className="f4" style={{ color: '#474DBB' }}>
            Coming Soon
          </h1>
        </div>
        <div className="w-50-ns w-100">
          <img src={landingPic2} />
        </div>
      </div>
      <div className="flex-ns items-center tc mv5">
        <div
          className="w-50-ns w-100 pv6-ns pv2"
          style={{ backgroundColor: '#EAF6F0' }}
        >
          <img style={{ width: '60px' }} src={growTribeIcon} />
          <h1 className="f2-ns">Grow Your Tribe</h1>
          <p className="f5 fw6 lh-2">
            Connect all of your Business Associates
            <br />
            in your Tribe.
          </p>
          <p className="f5 fw6 lh-2 mt3">
            Create small groups and
            <br />
            maintain communications in one place.
          </p>
        </div>
        <div
          className="w-50-ns w-100 pv6-ns pv2"
          style={{ backgroundColor: '#F4F5FB' }}
        >
          <img style={{ width: '60px' }} src={connectTribeIcon} />
          <h1 className="f2-ns">Connect with Tribes</h1>
          <p className="f5 fw6 lh-2">
            Connect with millions of Tribes all around
            <br />
            the world.
          </p>
          <p className="f5 fw6 lh-2 mt3">
            Showcase your product/service in the largest
            <br />
            enterprise network of the world.
          </p>
        </div>
      </div>
      <div className="tc pv5-ns pv3 ph2">
        <h1 className="f2-ns black">
          Three Easy Steps to Get Connected With Millions
          <br />
          of Enterprises All Around The World
        </h1>
        <div className="flex-ns justify-center pv5">
          <div className="w-30-ns w-100">
            <img
              style={{ width: '60px' }}
              src={attractiveCompanyIcon}
            />
            <h1 className="f3-ns f4 black lh-2">
              Create an Attractive
              <br /> Company Profile
            </h1>
          </div>
          <div className="w-30-ns w-100">
            <img style={{ width: '60px' }} src={verificationIcon} />
            <h1 className="f3-ns f4 black lh-2">Get Verified</h1>
          </div>
          <div className="w-30-ns w-100">
            <img style={{ width: '60px' }} src={growNetworkIcon} />
            <h1 className="f3-ns f4 black lh-2">
              Start approaching Tribes
              <br />
              to grow your network
              <br />
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
            height: '50px',
          }}
          type="submit"
        >
          Create your company profile for free
        </a>
      </div>
      <div className="pv4 tc" style={{ background: '#474DBB' }}>
        <h1 className="f2-ns white">Don't Miss Any Updates</h1>
        <div className="dt center w-34-ns w-80 mb5">
          <EmailVerificationForm />
        </div>
        <small className="white">
          © 2019 TiGrow Inc. - House 208, Road 12, Mohakhali DOHS,
          Dhaka, 1205, Bangladesh
        </small>
      </div>
    </div>
  );
};
