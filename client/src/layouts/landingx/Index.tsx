import React from 'react';
import { useSpring, animated } from 'react-spring';
import './Index.styles.scss';

import Navbar from './Navbar';
import MainFooter from './MainFooter';
import UserInput from './UserInput';
// import { OTButton } from 'components/button/Button';

// import BgMain from 'resources/images/bg-main.png';
import Logo from 'resources/images/onethread-logo-main.png';
import TextLogo from 'resources/images/onethread-text.png';
import SecondaryLogo from 'resources/images/secondary-logo.png';
import CombinedLogo from 'resources/images/combined-logo.png';
import MarketExpress from 'resources/images/companies/market-express.png';
import Dysin from 'resources/images/companies/dysin.png';
import Plummy from 'resources/images/companies/plummy-fashions.png';
import BatteryLow from 'resources/images/companies/battery-low.png';
import MCCI from 'resources/images/companies/mcci.png';
import Peakward from 'resources/images/companies/peakward.png';

const NewLanding = () => {
  const changeBgSpring = useSpring({
    delay: 2000,
    background: '#303052',
    from: { background: '#fff' },
  });
  return (
    <div className="landing w-100">
      <Navbar />
      <section className="main-header w-100 relative">
        <img
          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/videoplayback(2).gif"
          alt="background"
        />
        <div className="contents flex flex-column items-center justify-center w-100 tc absolute">
          <div className="logo flex flex-column items-center justify-center">
            <img src={Logo} alt="Onethread" />
            <img src={TextLogo} alt="" />
          </div>
          <h2 className="heading">
            Get rid of infinite email <br /> chains & WhatsApp threads
          </h2>
          <p className="sub-heading">
            Onethread lets you efficiently organize all your projects
            and <br /> communicate with everyone involved in a single
            platform
          </p>
          <UserInput color={'#000'} />
          <p className="tertiary-heading">
            Onethread is in private beta. Sign up with your email to
            use Onethread for free.
          </p>
        </div>
      </section>
      <section className="collaborate flex items-center justify-center">
        <div className="secondary-logo">
          <img src={SecondaryLogo} alt="onethread logo" />
        </div>
        <div className="contents flex flex-column">
          <h1>
            Collaborate with people{' '}
            <span style={{ color: '#3484F0' }}>
              outside your <br /> organization
            </span>
          </h1>
          <p>
            A project management tool built from the ground up for
            multi-team <br /> collaboration among startups, agencies
            and NGOs.
          </p>
        </div>
      </section>
      <animated.section
        className="third-section flex flex-column w-100"
        style={changeBgSpring}
      >
        <div className="upper flex flex-row-reverse items-center justify-center">
          <div className="upper-content">
            <h3>No more deadly email loops.</h3>
            <p>
              Forward that very long email chain to your project’s
              private email address. We got the rest covered.
            </p>
          </div>
          <div className="upper-gif flex items-center tc">
            <p className="w-100">
              GIF showing steps to forward email to onethread project
            </p>
          </div>
        </div>
        <div className="lower flex items-center justify-center">
          <div className="lower-content">
            <h3>Real-time task overview</h3>
            <p>
              Our tasks panel is built to provide real-time charts and
              tables to make sure you are aligned with everything
            </p>
          </div>
          <div className="lower-gif flex items-center tc">
            <p className="w-100">GIF showing project dashboard</p>
          </div>
        </div>
      </animated.section>
      <section className="teams flex flex-column items-center w-100">
        <h1 className="tc w-100">
          Teams large & small are using Onethread to <br />
          <span style={{ color: '#3484F0' }}>
            3x their output in half the time
          </span>
        </h1>
        <div className="companies w-100 flex justify-around items-center">
          <img src={MarketExpress} alt="market express" />
          <img src={Dysin} alt="dysin" />
          <img src={Plummy} alt="plummy fashions" />
          <img src={BatteryLow} alt="battery low" />
          <img src={MCCI} alt="mcci" />
          <img src={Peakward} alt="peakward" />
        </div>
      </section>
      <section className="product-details flex flex-column items-center justify-center w-100">
        <div className="header flex flex-column items-center justify-center">
          <img src={CombinedLogo} alt="combination" />
          <h2>
            <span style={{ color: '#3484f0' }}>Everything</span> a
            project manager dreamed of, <br />
            in one single package
          </h2>
        </div>
        <div className="options flex flex-column items-center justify-center">
          <div className="option flex justify-center items-center">
            <div className="contents">
              <h3>Never lose track of a project again</h3>
              <p>
                Each project gets a separate space with chat threads,
                tasks and files, powered by an intelligent search
                engine
              </p>
            </div>
            <div className="option-gif"></div>
          </div>
          <div className="option flex justify-center items-center">
            <div className="contents">
              <h3>Communicate with anyone in your project</h3>
              <p>
                Direct messages and group messages, as well as
                audio-video calls. Oh, we have Zoom, Meet and Teams
                integrations too!
              </p>
            </div>
            <div className="option-gif"></div>
          </div>
          <div className="option flex justify-center items-center">
            <div className="contents">
              <h3>Manage all tasks from a single dashboard</h3>
              <p>
                Create and manage tasks in projects, assign team
                members, and view them however you like
              </p>
            </div>
            <div className="option-gif"></div>
          </div>
          <div className="option flex justify-center items-center">
            <div className="contents">
              <h3>Work with your favorite tools</h3>
              <p>
                With 500+ integrations, onethread plays nicely with
                all the tools that we love and use
              </p>
            </div>
            <div className="option-gif"></div>
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
          <UserInput color={'#3484f0'} />
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
