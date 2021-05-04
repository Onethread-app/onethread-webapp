import React from 'react';

import MobileNavbar from './Navbar';
import MainFooter from './MainFooter';

import './Index.styles.scss';

import { OTButton } from 'components/button/Button';

import MainLanding from 'resources/images/main-landing.png';
import CombinedLogo from 'resources/images/combined-logo.png';

import DashboardIcon from 'resources/images/dashboard-icon.png';
import MessagesIcon from 'resources/images/messages-icon.png';
import ReportIcon from 'resources/images/report-icon.png';

import MailGif from 'resources/images/mail.gif';
import ReportGif from 'resources/images/report.gif';

import MarketExpress from 'resources/images/companies/market-express.png';
import Plummy from 'resources/images/companies/plummy-fashions.png';
import BatteryLow from 'resources/images/companies/battery-low.png';
import MCCI from 'resources/images/companies/mcci.png';


import ProjectPng from 'resources/images/project.png';
import MeetingPng from 'resources/images/meeting.png';
import TasksPng from 'resources/images/tasks.png';
import IntegrationsPng from 'resources/images/integrations.png';

// // import ProjectPng from 'resources/images/project.png';
// import MeetingPng from 'resources/images/meeting.png';
// import TasksPng from 'resources/images/tasks.png';
// import IntegrationsPng from 'resources/images/integrations.png';

const MobileIndex = () => {
  return (
    <div className="landing-m w-100">
      <MobileNavbar />
      <section className="main-header w-100 relative flex flex-column items-center justify-center mb5">
        <h2 className="heading tc">
          Collaborate with people on projects <br />
          <span style={{ color: '#3484F0' }}>
            with the click of a button
          </span>
        </h2>
        <img src={MainLanding} alt="" />
        <h3 className="sub-heading tc mt3">
          <span className="b">Onethread</span> is project management
          tool built from the ground up for multi-team collaboration
          among startups, agencies and NGOs.
        </h3>
        <OTButton to="/signup">Create Your First Project</OTButton>
      </section>
      <section className="second-section w-100 flex relative mb5">
        <div className="unified-tool flex flex-column items-center justify-around w-100 pb3">
          <div className="unified-tool-text tc">
            We spend 23% more time in external projects for{' '}
            <span className="b">lack of a unified tool</span>
          </div>
          <div className="unified-tool-content flex flex-column justify-start br2">
            <h3 className="unified-tool-content-header tj">
              <span className="b">Onethread</span> lets you
              efficiently organize all your projects and communicate
              with everyone involved in a single platform
            </h3>
            <div className="unified-tool-content-body">
              <div className="flex items-center">
                <img src={DashboardIcon} alt="" />
                <p>
                  <span className="b mr1">Messages:</span>
                  Keep your work and personal inboxes separate
                </p>
              </div>
              <div className="flex items-center">
                <img src={MessagesIcon} alt="" />
                <p>
                  <span className="b mr1">Project dashboard: </span>{' '}
                  Task assignment, one-click approvals and project
                  folders
                </p>
              </div>
              <div className="flex items-center">
                <img src={ReportIcon} alt="" />
                <p>
                  <span className="b mr1">Reports: </span> No more
                  asking “what’s done”. You already know it!
                </p>
              </div>
            </div>
            <h3 className="unified-tool-content-footer tc">
              Read: Get rid of infinite email chains and WhatsApp
              threads
            </h3>
          </div>
        </div>
      </section>
      <section className="third-section flex flex-column mb5 tc">
        <div className="gif flex items-center justify-center">
          <img src={MailGif} alt="MailGif" />
        </div>
        <div className="contents flex flex-column items-center justify-center mb4">
          <h3>No more deadly email loops.</h3>
          <p>
            Forward that very long email chain to your project’s
            private email address. We got the rest covered.
          </p>
        </div>
        <div className="gif flex items-center justify-center">
          <img src={ReportGif} alt="reportgif" />
        </div>
        <div className="contents flex flex-column items-center justify-center">
          <h3>Real-time task overview</h3>
          <p>
            Our tasks panel is built to provide real-time charts and
            tables to make sure you are aligned with everything
          </p>
        </div>
      </section>
      <section className="teams flex flex-column mb5 tc">
        <h2>
          Teams large & small are using Onethread to
          <br />{' '}
          <p style={{ color: '#3484F0' }}>
            3x their output in half the time
          </p>
        </h2>
        <div className="companies flex flex-column items-center justify-center">
          <div className="flex items-center justify-around w-100">
            <img src={MarketExpress} alt="market express" />
            
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={Plummy} alt="plummy fashions" />
            <img src={BatteryLow} alt="battery low" />
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={MCCI} alt="mcci" />
          </div>
        </div>
        <OTButton to="/signup">Create Your First Project</OTButton>
      </section>
      <section className="product-details flex flex-column items-center justify-center mb5 w-100">
        <div className="header flex flex-column items-center justify-center mb5">
          <img src={CombinedLogo} alt="Onethread" />
          <h2>
            <span style={{ color: '#3484F0' }}>Everything</span> a
            project manager dreamed of, in one single package
          </h2>
        </div>
        <div className="options flex flex-column items-center justify-center">
          <div className="option">
            <div className="option-gif">
              <img
                src={ProjectPng}
                alt=""
                // style={{ maxWidth: '405px' }}
              />
            </div>
            <div className="option-content">
              <h3>Never lose track of a project again</h3>
              <p>
                Each project gets a separate space with chat threads,
                tasks and files, powered by an intelligent search
                engine
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={MeetingPng}
                alt=""
                // style={{ maxWidth: '508px' }}
              />
            </div>
            <div className="option-content">
              <h3>Communicate with anyone in your project</h3>
              <p>
                Direct messages and group messages, as well as
                audio-video calls. Oh, we have Zoom, Meet and Teams
                integrations too!
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={TasksPng}
                alt=""
                // style={{ maxWidth: '558px' }}
              />
            </div>
            <div className="option-content">
              <h3>Manage all tasks from a single dashboard</h3>
              <p>
                Create and manage tasks in projects, assign team
                members, and view them however you like.
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={IntegrationsPng}
                alt=""
                // style={{ maxWidth: '413px' }}
              />
            </div>
            <div className="option-content">
              <h3>Work with your favorite tools</h3>
              <p>
                With 500+ integrations, onethread plays nicely with
                all the tools that we love and use
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="footer flex flex-column items-center justify-center w-100 tc">
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

export default MobileIndex;
