import React from 'react';

import MobileNavbar from './Navbar';

import './Index.styles.scss';

import { OTButton } from 'components/button/Button';

import CombinedLogo from 'resources/images/combined-logo.png';

import MarketExpress from 'resources/images/companies/market-express.png';
import Plummy from 'resources/images/companies/plummy-fashions.png';
import BatteryLow from 'resources/images/companies/battery-low.png';
import MCCI from 'resources/images/companies/mcci.png';

const MobileIndex = () => {
  return (
    <div className="landing-m w-100">
      <MobileNavbar />
      <section className="main-header w-100 relative">
        <img
          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/videoplayback(2).gif"
          alt="background"
        />
        <div className="contents flex flex-column items-center justify-center w-100 tc absolute">
          <h2 className="heading ttc">
            Get rid of infinite email chains & WhatsApp threads
          </h2>
          <p className="sub-heading tc">
            Onethread lets you efficiently organize all your projects
            and communicate with everyone involved in one single
            platform
          </p>
          <OTButton to="/signin">Create Your First Project</OTButton>
        </div>
      </section>
      <section className="management flex items-center justify-center">
        <h3 className="tc">
          A project management tool built from the ground up for
          multi-team collaboration among startups, agencies and NGOs.
        </h3>
      </section>
      <section className="third-section flex flex-column tc">
        <div className="gif flex items-center justify-center">
          <h3>
            GIF showing steps to forward email to onethread project
          </h3>
        </div>
        <div className="contents flex flex-column items-center justify-center">
          <h3>No more deadly email loops.</h3>
          <p>
            Forward that very long email chain to your project’s
            private email address. We got the rest covered.
          </p>
        </div>
        <div className="gif flex items-center justify-center">
          <h3>GIF showing project dashboard</h3>
        </div>
        <div className="contents flex flex-column items-center justify-center">
          <h3>Real-time task overview</h3>
          <p>
            Our tasks panel is built to provide real-time charts and
            tables to make sure you are aligned with everything
          </p>
        </div>
      </section>
      <section className="teams flex flex-column tc">
        <h2>
          Teams large & small are using Onethread to
          <br />{' '}
          <p className="mt3" style={{ color: '#3484F0' }}>
            3x their output in half the time
          </p>
        </h2>
        <div className="companies flex flex-column items-center justify-center">
          <div className="flex items-center justify-around w-100">
            <img src={MarketExpress} alt="market express" />
            <img src={Plummy} alt="plummy fashions" />
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={BatteryLow} alt="battery low" />
            <img src={MCCI} alt="mcci" />
          </div>
        </div>
        <OTButton to="/signin">Create Your First Project</OTButton>
      </section>
      <section className="product-details flex flex-column items-center justify-center w-100">
        <div className="header flex flex-column items-center justify-center">
          <img src={CombinedLogo} alt="Onethread" />
          <h2>
            <span style={{ color: '#3484F0' }}>Everything</span> a
            project manager dreamed of, in one single package
          </h2>
        </div>
        <div className="options flex flex-column items-center justify-center">
          <div className="option">
            <div className="option-gif"></div>
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
            <div className="option-gif"></div>
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
            <div className="option-gif"></div>
            <div className="option-content">
              <h3>Manage all tasks from a single dashboard</h3>
              <p>
                Create and manage tasks in projects, assign team
                members, and view them however you like.
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif"></div>
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
    </div>
  );
};

export default MobileIndex;
