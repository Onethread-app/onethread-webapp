import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import './Index.styles.scss';

import MobileIndex from './mobile/Index';
import Navbar from './Navbar';
import MainFooter from './MainFooter';

import { OTButton } from 'components/button/Button';

import Logo from 'resources/images/onethread-logo-main.png';
import MainLanding from 'resources/images/main-landing.png';
import CombinedLogo from 'resources/images/combined-logo.png';
import MarketExpress from 'resources/images/companies/market-express.png';
import Plummy from 'resources/images/companies/plummy-fashions.png';
import BatteryLow from 'resources/images/companies/battery-low.png';
import Checkmate from 'resources/images/companies/checkmate.png';
import Goodybro from 'resources/images/companies/goodybro.png';

import DashboardIcon from 'resources/images/dashboard-icon.png';
import MessagesIcon from 'resources/images/messages-icon.png';
import ReportIcon from 'resources/images/report-icon.png';

import MailGif from 'resources/images/mail.gif';
import ReportGif from 'resources/images/report.gif';

import ProjectPng from 'resources/images/project.png';
import MeetingPng from 'resources/images/meeting.png';
import TasksPng from 'resources/images/tasks.png';
import IntegrationsPng from 'resources/images/integrations.png';

const NewLanding = () => {
  return isMobileOnly ? (
    <MobileIndex />
  ) : (
    <div className="landing w-100">
      <Navbar />
      <section className="main-header w-100 relative flex flex-column items-center">
        <h2 className="heading tc">
          Collaborate with people on projects <br />
          <span style={{ color: '#3484F0' }}>
            with the click of a button
          </span>
        </h2>
        <img src={MainLanding} alt="" />
        <h3 className="sub-heading tc">
          <span className="b">Onethread</span> is a project management
          tool built from the ground up for multi-team collaboration
          among startups, agencies and NGOs.
        </h3>
        <OTButton to="/signup">Create Your First Project</OTButton>
      </section>
      <section className="second-section w-100 flex relative">
        <div className="unified-tool flex items-center justify-around w-100">
          <div className="unified-tool-text">
            We spend 23% more time in external projects for{' '}
            <span className="b">lack of a unified tool</span>
          </div>
          <div className="unified-tool-content flex flex-column justify-start">
            <h3 className="unified-tool-content-header">
              <span className="b">Onethread</span> lets you
              efficiently organize all your projects and communicate
              with everyone involved in a single platform
            </h3>
            <div className="unified-tool-content-body">
              <div className="flex items-center">
                <img src={DashboardIcon} alt="" />
                <p>
                  <span className="b">Messages:</span>
                  Keep your work and personal inboxes separate
                </p>
              </div>
              <div className="flex items-center">
                <img src={MessagesIcon} alt="" />
                <p>
                  <span className="b">Project dashboard: </span> Task
                  assignment, one-click approvals and project folders
                </p>
              </div>
              <div className="flex items-center">
                <img src={ReportIcon} alt="" />
                <p>
                  <span className="b">Reports: </span> No more asking
                  “what’s done”. You already know it!
                </p>
              </div>
            </div>
            <h3 className="unified-tool-content-footer">
              Read: Get rid of infinite email chains and WhatsApp
              threads
            </h3>
          </div>
        </div>
      </section>
      <section className="third-section flex flex-column w-100">
        <div className="upper flex items-center justify-around">
          <div className="upper-gif flex items-center tc">
            <img src={MailGif} alt="MailGif" />
          </div>
          <div className="upper-content">
            <h3>No more deadly email loops.</h3>
            <p>
              Forward that very long email chain to your project’s
              private email address. We got the rest covered.
            </p>
          </div>
        </div>
        <div className="lower flex items-center justify-around">
          <div className="lower-content">
            <h3>Real-time task overview</h3>
            <p>
              Our tasks panel is built to provide real-time charts and
              tables to make sure you are aligned with everything
            </p>
          </div>
          <div className="lower-gif flex items-center tc">
            <img src={ReportGif} alt="reportgif" />
          </div>
        </div>
      </section>
      <section className="teams flex flex-column items-center w-100">
        <h1 className="tc w-100">
          Teams large & small are using Onethread to <br />
          3x their output in half the time
        </h1>
        <div className="companies w-100 flex justify-around items-center">
          <img src={Goodybro} alt="goodybro" />
          <img src={Plummy} alt="plummy fashions" />
          <img src={BatteryLow} alt="battery low" />
          <img src={Checkmate} alt="checkmate" />
          <img src={MarketExpress} alt="market express" />
        </div>
      </section>
      <section className="product-details flex flex-column  w-100">
        <div className="header flex flex-column items-center justify-center">
          <img src={CombinedLogo} alt="combination" />
          <h2>
            <span style={{ color: '#3484f0' }}>Everything</span> a
            project manager dreamed of, <br />
            in one single package
          </h2>
        </div>
        <div className="options flex flex-column ">
          <div className="option flex items-center ">
            <div className="contents">
              <h3>Never lose track of a project again</h3>
              <p>
                Each project gets a separate space with chat threads,
                tasks and files, powered by an intelligent search
                engine
              </p>
            </div>
            <div className="option-gif">
              <img
                src={ProjectPng}
                alt=""
                style={{ maxWidth: '405px' }}
              />
            </div>
          </div>
          <div className="option flex items-center ">
            <div className="contents">
              <h3>Communicate with anyone in your project</h3>
              <p>
                Direct messages and group messages, as well as
                audio-video calls. Oh, we have Zoom, Meet and Teams
                integrations too!
              </p>
            </div>
            <div className="option-gif">
              <img
                src={MeetingPng}
                alt=""
                style={{ maxWidth: '508px' }}
              />
            </div>
          </div>
          <div className="option flex items-center ">
            <div className="contents">
              <h3>Manage all tasks from a single dashboard</h3>
              <p>
                Create and manage tasks in projects, assign team
                members, and view them however you like
              </p>
            </div>
            <div className="option-gif">
              <img
                src={TasksPng}
                alt=""
                style={{ maxWidth: '558px' }}
              />
            </div>
          </div>
          <div className="option flex items-center ">
            <div className="contents">
              <h3>Work with your favorite tools</h3>
              <p>
                With 500+ integrations, onethread plays nicely with
                all the tools that we love and use
              </p>
            </div>
            <div className="option-gif">
              <img
                src={IntegrationsPng}
                alt=""
                style={{ maxWidth: '413px' }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="footer flex flex-column justify-center items-center w-100">
        <div className="start-today flex flex-column items-center tc">
          <img src={Logo} alt="onethread" />
          <h3>
            Change how you manage external stakeholders.{' '}
            <span style={{ color: '#252546' }}>Start today.</span>
          </h3>
          <p>
            Sign up with your email below to use Onethread for free
            while in beta. The private beta is just the beginning, but
            we want you to be a part of it!
          </p>
          <OTButton to="/signup" white bold>
            Create Your First Project
          </OTButton>
        </div>
        <MainFooter />
        <div className="footer-copyright flex items-center w-100">
          <h1 className="tc w-100">
            Copyright 2021 Onethread. All rights reserved. Proudly
            made in Bangladesh.
          </h1>
        </div>
      </section>
    </div>
  );
};

export default NewLanding;
