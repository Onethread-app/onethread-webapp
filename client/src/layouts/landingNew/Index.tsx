import React from 'react';
import { NavbarLanding } from './NavbarLanding';
import { Button } from '@blueprintjs/core';
import task from './../../resources/LandingImages/task-complete.svg';
import tick from './../../resources/LandingImages/tick.svg';
import intClient from './../../resources/LandingImages/international-client.svg';
import business from './../../resources/LandingImages/business.svg';
import team from './../../resources/LandingImages/team.svg';
import support from './../../resources/LandingImages/support.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import DYSINLogo from './../../resources/LandingImages/DYSINLogo1.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import MCCILogo from './../../resources/LandingImages/mcci.png';
import batteryLogo from './../../resources/LandingImages/batteryLow.png';
import bkmeaLogo from './../../resources/LandingImages/BKMEA-Logo.png';
import peakwardLogo from './../../resources/LandingImages/peakwardLogo.png';
import smile from './../../resources/LandingImages/Smile.png';
import fb from './../../resources/LandingImages/fbIcon.png';
import youtubeIcon from './../../resources/LandingImages/youtubeIcon.png';
import linkedInIcon from './../../resources/LandingImages/linkedInIcon.png';
import tigrowFooter from './../../resources/LandingImages/tigrowFooter.png';

export const LandingPage = () => {
  return (
    <div>
      <NavbarLanding />
      <div className="LandingFirstBackground vh-100 w-100">
        <div className="w-40 ml5 pt4">
          <h1 className="f3 fw5 blue" style={{ color: '#3F61C5' }}>Work From Home</h1>
          <h1 className="f2" style={{ color: '#1D3557' }}>
            There is a better way to collaborate with your teammates.
          </h1>
          <p className="f4 w-70" style={{ color: '#43466D' }}>An innovative project management tool that allows you to seamlessly manage your teams’ tasks,
          communicate with team members in real-time, hold video conferences, and simplify collaboration
          with your vendors and partner organizations.
          </p>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            GET TIGROW FREE
          </Button>
          <p className="f5 w-40" style={{ color: '#707070' }}>Get started with FREE tools, and upgrade as you grow.</p>
        </div>
      </div>
      <div className="w-100 flex ph5 pt6" style={{ backgroundColor: '#F0FBFF' }}>
        <div className="w-30">
          <h1 className="f2" style={{ color: '#1D3557' }}>
            Comprehensive collaboration tools, to run your entire organization at one place.
          </h1>
          <p style={{ color: '#43466D' }} className="f4 mt4 lh-2">
            TiGrow offers a full stack of software for task management, real time communication and
            video conferencing with a project management tool at its core. They’re powerful alone —
            but even better when used together.
          </p>
        </div>
        <div className="w-30 bg-white br2 pa4 shadow-4 ml5">
          <article className="flex items-center">
            <img
              style={{ width: '35px' }}
              src={task}
            />
            <div className="ml2">
              <p className="f3 fw7" style={{ color: '#1D3557' }}>Project Management Tool</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            Easily plan, collaborate,
            organize and deliver projects of all sizes,
            on time, using one project planning software
            with all the right tools put at one place.
          </p>
          <h1 className='f5 fw7 mt4' style={{ color: '#1D3557' }}>POPULAR FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>KANBAN BOARDS</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>TASK, SUB-TASK</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>PROJECT MODERATORS</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>ANNOUNCEMENT</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Started
          </Button>
        </div>
        <div className="w-30 bg-white br2 pa4 shadow-4 ml5">
          <article className="flex items-center">
            <img
              style={{ width: '35px' }}
              src={intClient}
            />
            <div className="ml2">
              <p className="f3 fw7" style={{ color: '#1D3557' }}>Work From Home Solution</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            From assigning tasks & monitoring your team’s performance to collaborating
            with them in a shared browser and video conference, TiGrow is a complete
            remote working solution.
          </p>
          <h1 className='f5 fw7 mt4' style={{ color: '#1D3557' }}>UPCOMING FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>SHARED BROWSER</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>GANTT CHART FOR KPI MONITORING</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>CLOCK IN & OUT</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>TIME SHEET</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div className="w-100 flex ph5 pv5" style={{ backgroundColor: '#F0FBFF' }}>
        <div className="w-30 bg-white br2 pa4 shadow-4">
          <article className="flex items-center">
            <img
              style={{ width: '35px' }}
              src={business}
            />
            <div className="ml2">
              <p className="f3 fw7" style={{ color: '#1D3557' }}>Vendor Management Tool</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            From Medium To Large Enterprise everyone has to manage multiple
            vendors for their activities, managing all those vendors wasn't
            this much easier before.
          </p>
          <h1 className='f5 fw7 mt4' style={{ color: '#1D3557' }}>NEW FEATURE INTEGRATION</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>QUOTATION REVEALING</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>DOCUMENTS APPROVAL</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>SMART CONTRACT</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Started
          </Button>
        </div>
        <div className="w-30 bg-white br2 pa4 shadow-4 ml5">
          <article className="flex items-center">
            <img
              src={team}
            />
            <div className="ml2">
              <p className="f3 fw7" style={{ color: '#1D3557' }}>Finding Team Mates</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            Find the perfect Team Mate for your Team Find
            & Hire Your Remote, Contractual, Full Time or
            Part Time Teammate For Any Type Of Projects.
          </p>
          <h1 className='f5 fw7 mt4' style={{ color: '#1D3557' }}>NEW FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>REQUEST FOR NEW TEAM MATE</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>PROJECT BASED TIME SHEET FOR PAYMENT</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>POST YOUR PORTFOLIO SERVICES/SKILLS AND GET HIRED BY COMPANIES</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Started
          </Button>
        </div>
        <div className="w-30 bg-white br2 pa4 shadow-4 ml5">
          <article className="flex items-center">
            <img
              style={{ width: '35px' }}
              src={support}
            />
            <div className="ml2">
              <p className="f3 fw7" style={{ color: '#1D3557' }}>Finding Partners</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            Search and Find Partner Companies from around the world and Invite them to collaborate with you in TiGrow.
          </p>
          <h1 className='f5 fw7 mt4' style={{ color: '#1D3557' }}>NEW FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>TECHNOLOGICAL VENDOR SECTION</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>CHANNEL PARTNER SECTION</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className='f5 fw7 ml2'>DIGITAL MARKETING SECTION</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div className="LandingSecondBackground w-100">
        <div className="mh6 tc pt4">
          <h1 className="f2 fw7 white mt6">
            Connect, Grow and Collaborate with Tigrow and find a thriving community behind you.
            </h1>
          <h1 className="f3 fw4 white">
            From Managing Multiple Teams To Effortless Communication Channels, We've Got You Covered.
            we're working relentlessly to provide you with best customer support so that you can get
            the most out of your tools.
          </h1>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mb5"
            style={{ color: 'WHITE', border: 'solid 2px WHITE', backgroundColor: '#0FB7A0', marginTop: '50rem' }}
          >
            Request For A Demo
      </Button>
        </div>
      </div>
      <div className="flex ph7-l items-center">
        <div className="w-34">
          <h1 className="f1" style={{ color: '#0FB7A0' }}>6,370</h1>
          <h1 style={{ color: '#0FB7A0' }} className="f3 fw5">Users in over <span className="fw7">28</span> countries collaborating with Tigrow</h1>
        </div>
        <div className="flex flex-column pl6 mv5 items-center">
          <div>
            <img src={marketLogo} style={{ width: '115px' }} />
            <img className="ml4" src={DYSINLogo} style={{ width: '95px' }} />
            <img className="ml4" src={plummyLogo} style={{ width: '160px' }} />
            <img className="ml4" src={knitLogo} style={{ width: '280px' }} />
          </div>
          <div className="mv3">
            <img src={MCCILogo} style={{ width: '115px' }} />
            <img className="ml4" src={batteryLogo} style={{ width: '95px' }} />
            <img className="ml4" src={bkmeaLogo} style={{ width: '160px' }} />
            <img className="ml4" src={peakwardLogo} style={{ width: '280px' }} />
          </div>
        </div>
      </div>
      <div className="flex ph7 pv5">
        <div className="w-50">
          <h1 className="f1" style={{ color: '#0FB7A0' }}>Start Growing With TiGrow Today</h1>
          <h1 className="f4 fw4 lh-2" style={{ color: '#0FB7A0' }}>With tools to Plan and collaborate while having a seamless user
          experience that keeps everyone in the loop and focuses on the
          necessary with little to no learning curve, and a support
          team excited to help you, getting started with this
            comprehensive tool has become even easier.</h1>
          <Button
            className="f4 fw6 bp3-minimal pa4 br2 mv4 mh3"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            Get Tigrow Free
          </Button>
          <h1 className="f4 fw4 lh-2" style={{ color: '#707070' }}>Get started with FREE tools, and upgrade as you grow.</h1>
        </div>
        <div className="w-50 ml5">
          <img src={smile} />
        </div>
      </div>
      <div className="ph5 pv4" style={{ background: '#43466D' }}>
        <div className="flex w-100">
          <div className="w-25">
            <h1 className="f4 white">Manage your projects</h1>
            <h1 className="f5 fw3 white">Project Management Tool</h1>
            <h1 className="f5 fw3 white">Video Conferencing Tool</h1>
            <h1 className="f5 fw3 white">Kanban Board</h1>
            <h1 className="f5 fw3 white">Agile Way</h1>
          </div>
          <div className="w-25">
            <h1 className="f4 white">Manage your Vendors</h1>
            <h1 className="f5 fw3 white">Vendor Management Tool</h1>
            <h1 className="f5 fw3 white">Quotation Revealing</h1>
            <h1 className="f5 fw3 white">Smart Contract</h1>
          </div>
          <div className="w-25">
            <h1 className="f4 white">Find new partners</h1>
            <h1 className="f5 fw3 white">Find new partners</h1>
            <h1 className="f5 fw3 white">Digital Marketing</h1>
            <h1 className="f5 fw3 white">Channel Partners</h1>
          </div>
          <div className="w-25">
            <h1 className="f4 white">Find new Teammates</h1>
            <h1 className="f5 fw3 white">Remote Team Hiring</h1>
            <h1 className="f5 fw3 white">How to be a teammate?</h1>
            <h1 className="f5 fw3 white">Post your portfolio/services</h1>
          </div>
        </div>
        <div className="w-100">
          <h1 className="f4 white">Support and Tools</h1>
          <h1 className="f5 fw3 white">TiGrow Partners</h1>
          <h1 className="f5 fw3 white">Join a local user group</h1>
        </div>
        <Button
          className="f4 fw6 bp3-minimal pa3 br2 mv4"
          style={{ color: '#43466D', backgroundColor: 'white' }}
        >
          Contact Tigrow Support
          </Button>
        <div className="flex">
          <img src={fb} />
          <img className="mh4" src={youtubeIcon} />
          <img src={linkedInIcon} />
        </div>
        <div className="tc bb b--white mt5">
          <p className="white fw6 f5">English</p>
        </div>
        <div className="flex justify-between mv4">
          <div>
            <img src={tigrowFooter} />
            <p className="white">Copyright&copy; 2020 TiGrow Technologies llc.</p>
          </div>
          <div className="flex">
            <p className="white fw6">Legal Stuff</p>
            <p className="white ml4 fw6">Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};