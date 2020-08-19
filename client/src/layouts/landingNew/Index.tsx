import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import { Button, Dialog } from '@blueprintjs/core';
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
import { isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import './style.scss';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

export const LandingPage = () => {
  const [showContactUs, setShowContactUs] = useState(false);
  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="LandingFirstBackground vh-100 w-100 mt5">
        <div className="w-50-l w-60-m w-90 ml5-l ml4-m ml3 pt4-l pt2">
          <h1 className="f3-l f4-m f6 fw5 blue mt2" style={{ color: '#3F61C5' }}>WORK FROM HOME</h1>
          <h1 className="f2-l f3-m f4 mt3" style={{ color: '#1D3557' }}>
            There is a better way to collaborate with your teammates.
          </h1>
          <p className="f4-l f5-m f7 w-70" style={{ color: '#43466D' }}>An innovative project management
           tool that allows you to seamlessly manage your teams’ tasks,
          communicate with team members in real-time, hold video conferences, and simplify collaboration
          with your vendors and partner organizations.
          </p>
          <NavLink to="/signup">
            <Button
              className="f4-l f5-m f7 fw6-ns bp3-minimal pa3 br2 mv3"
              style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            >
              GET TiGrow FREE
          </Button>
          </NavLink>
          <p className="f5-ns f7 w-40" style={{ color: '#707070' }}>
            Get started with FREE tools, and upgrade as you grow.</p>
        </div>
      </div>
      <div
        className="w-100 ph5-l ph4-m ph4 pt6-ns pt2 pv4 comprehensiveGrid"
      >
        <div>
          <h1 className="f2-l f3-m f4" style={{ color: '#1D3557' }}>
            Comprehensive collaboration tools, to run your entire organization at one place.
          </h1>
          <p style={{ color: '#43466D' }} className="f4-l f5 f7 mt4-ns mt2 lh-2 mb4">
            TiGrow offers a full stack of software for task management, real time communication and
            video conferencing with a project management tool at its core. They’re powerful alone —
            but even better when used together.
          </p>
        </div>
        <div className=" bg-white br2 pa4 shadow-4">
          <article className="flex items-center">
            <img
              style={{ width: isMobileOnly ? '25px' : '35px' }}
              src={task}
            />
            <div className="ml2">
              <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Project Management Tool</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5-l f6-m f7 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            Easily Plan, Collaborate,
            Organize And Deliver Projects Of All Sizes,
            On Time, Using One Project Planning Software
            With All The Right Tools Put At One Place.
          </p>
          <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>POPULAR FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">KANBAN BOARDS</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">TASK, SUB-TASK</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">PROJECT MODERATORS</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">ANNOUNCEMENT</h1>
          </div>
          <NavLink to="/signup">
            <Button
              className="f4-ns fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
              style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            >
              Get Started
          </Button>
          </NavLink>
        </div>
        <div className="bg-white br2 pa4 shadow-4 mt4 mt0-ns">
          <article className="flex items-center">
            <img
              style={{ width: isMobileOnly ? '25px' : '35px' }}
              src={intClient}
            />
            <div className="ml2">
              <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Work From Home Solution</p>
            </div>
          </article>
          <p className="bb b--light-silver pb4 f5-l f6-m f7 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
            From Assigning Tasks & Monitoring Your Team’s Performance To Collaborating
            With Them In A Shared Browser And Video Conference, TiGrow Is A Complete
            Remote Working Solution.
          </p>
          <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>UPCOMING FEATURES</h1>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">SHARED BROWSER</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">GANTT CHART FOR KPI MONITORING</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">CLOCK IN & OUT</h1>
          </div>
          <div className="flex">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">TIME SHEET</h1>
          </div>
          <NavLink to="/signup">
            <Button
              className="f4-ns fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
              style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            >
              Get Started
            </Button>
          </NavLink>
        </div>
        <div className="bg-white br2 shadow-4 pv2 mt4 mt0-ns">
          <div className=" ml-auto mt3 pl3 white" 
          style={{ borderRadius: '20px 0 0 20px', width: '90px', backgroundColor: '#0FB7A0' }}>
            <h1 className="f6-l f7 fw4" style={{ paddingTop: '.1rem', paddingBottom: '.1rem' }}>Upcoming</h1>
          </div>
          <div className="ph4">
            <article className="flex items-center">
              <img
                style={{ width: isMobileOnly ? '25px' : '35px' }}
                src={business}
              />
              <div className="ml2">
                <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Vendor Management Tool</p>
              </div>
            </article>
            <p className="bb b--light-silver pb4 f5 fw5-ns mt3 lh-2" style={{ color: '#43466D' }}>
              From Medium To Large Enterprise Everyone Has To Manage Multiple
              Vendors For Their Activities, Managing All Those Vendors Wasn't
              This Much Easier Before.
          </p>
            <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>NEW FEATURE INTEGRATION</h1>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">QUOTATION REVEALING</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">DOCUMENTS APPROVAL</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">SMART CONTRACT</h1>
            </div>
            <NavLink to="/signup">
              <Button
                className="f4-ns fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
                style={{ color: 'white', backgroundColor: '#4B6BC8' }}
              >
                Get Started
            </Button>
            </NavLink>
          </div>
        </div>
        <div className="bg-white br2 shadow-4 mt4 mt0-ns pv2">
          <div className=" ml-auto mt3 pl3 white" 
          style={{ borderRadius: '20px 0 0 20px', width: '90px', backgroundColor: '#0FB7A0' }}>
            <h1 className="f6-ns f7 fw4" style={{ paddingTop: '.1rem', paddingBottom: '.1rem' }}>Upcoming</h1>
          </div>
          <div className="ph4">
            <article className="flex items-center">
              <img
                style={{ width: isMobileOnly ? '30px' : '35px' }}
                src={team}
              />
              <div className="ml2">
                <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Finding Team Mates</p>
              </div>
            </article>
            <p className="bb b--light-silver pb4 f5-ns f7 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
              Find The Perfect Team Mate For Your Team Find
              & Hire Your Remote, Contractual, Full Time Or
              Part Time Teammate For Any Type Of Projects.
          </p>
            <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>NEW FEATURES</h1>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">REQUEST FOR NEW TEAM MATE</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">PROJECT BASED TIME SHEET FOR PAYMENT</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">POST YOUR PORTFOLIO SERVICES/SKILLS AND GET HIRED BY COMPANIES</h1>
            </div>
            <NavLink to="/signup">
              <Button
                className="f4-ns fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
                style={{ color: 'white', backgroundColor: '#4B6BC8' }}
              >
                Get Started
            </Button>
            </NavLink>
          </div>
        </div>
        <div className=" bg-white br2 shadow-4 mt4 mt0-ns pv2">
          <div className=" ml-auto mt3 pl3 white" 
          style={{ borderRadius: '20px 0 0 20px', width: '90px', backgroundColor: '#0FB7A0' }}>
            <h1 className="f6-ns f7 fw4" style={{ paddingTop: '.1rem', paddingBottom: '.1rem' }}>Upcoming</h1>
          </div>
          <div className="ph4">
            <article className="flex items-center">
              <img
                style={{ width: isMobileOnly ? '25px' : '35px' }}
                src={support}
              />
              <div className="ml2">
                <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Finding Partners</p>
              </div>
            </article>
            <p className="bb b--light-silver pb4 f5-ns f7 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
              Search And Find Partner Companies From Around
              The World And Invite Them To Collaborate With You In TiGrow.
          </p>
            <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>NEW FEATURES</h1>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">TECHNOLOGICAL VENDOR SECTION</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">CHANNEL PARTNER SECTION</h1>
            </div>
            <div className="flex">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">DIGITAL MARKETING SECTION</h1>
            </div>
            <NavLink to="/signup">
              <Button
                className="f4-ns fw6 bp3-minimal pa3 br2 mv4 w-90 mh3"
                style={{ color: 'white', backgroundColor: '#4B6BC8' }}
              >
                Get Started
            </Button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="LandingSecondBackground w-100">
        <div className="mh6-ns mh4 tc pt4-ns pt3">
          <h1 className="f2-l f3-m f5 fw7 white mt6-l mt4-m">
            Connect, Grow and Collaborate with Tigrow and find a thriving community behind you.
            </h1>
          <h1 className="f3-l f4-m f5 fw4 white">
            From Managing Multiple Teams To Effortless Communication Channels, We've Got You Covered.
            we're working relentlessly to provide you with best customer support so that you can get
            the most out of your tools.
          </h1>
          <Button
            className="f4-ns fw6 bp3-minimal pa3-ns br2 mb5 requestDemoBtn"
            style={{ color: 'WHITE', border: 'solid 2px WHITE', backgroundColor: '#0FB7A0' }}
            onClick={ () => setShowContactUs(true) }
          >
            Request For A Demo
      </Button>
        </div>
      </div>
      <div 
      className="mw9-l companiesMaxWidth mw8-m center pa3 ph5-l ph4-m flex-ns items-center-ns tc mt5-ns mt2 mb4-ns"
      >
        <div className="w-34-l w-40-m w-100 companiesWidth">
          <h1 className="f1-l f2-m f3 companiesFont" style={{ color: '#0FB7A0' }}>6,370</h1>
          <h1 style={{ color: '#0FB7A0' }} className="f3-l f4-m f5 fw5 ph4 ph0-ns">
            Users in over <span className="fw7">28</span> countries collaborating with TiGrow</h1>
        </div>
        <div className="flex flex-column  pl6-l pl4-m companiesInnerPadding items-center mv4 mv0-ns">
          <div>
            <img src={marketLogo} className="marketLogo" />
            <img className="ml4-ns ml2 DYSINLogo" src={DYSINLogo} />
            <img className="ml2 plummyLogo" src={plummyLogo} />
            <img className="ml2 knitLogo" src={knitLogo} />
          </div>
          <div className="mv3">
            <img src={MCCILogo} className="marketLogo" />
            <img className="ml4-ns ml2 DYSINLogo" src={batteryLogo} />
            <img className="ml2 plummyLogo" src={bkmeaLogo} />
            <img className="ml2 knitLogo" src={peakwardLogo} />
          </div>
        </div>
      </div>
      <div 
      className="mw9-l companiesMaxWidth mw8-m center
      ph5-ns flex flex-column-reverse flex-row-ns items-center tc tl-ns mb4"
      >
        <div className="w-50-l w-80">
          <h1 className="f2-l f3-m f5" style={{ color: '#0FB7A0' }}>Start Growing With TiGrow Today</h1>
          <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#0FB7A0' }}>with tools to plan
           and collaborate while having a seamless user
          experience that keeps everyone in the loop and focuses on the
          necessary with little to no learning curve, and a support
          team excited to help you, getting started with this
            comprehensive tool has become even easier.</h1>
          <NavLink to="/signup">
            <Button
              className="f4-ns fw6 bp3-minimal pa4-l pa2 br2 mv4-ns mv2"
              style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            >
              GET TiGrow FREE
          </Button>
          </NavLink>
          <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#707070' }}>
            Get started with FREE tools, and upgrade as you grow.</h1>
        </div>
        <div className="w-50-l ml6-l">
          <img className="w-80-l w-100-m w-60" src={smile} />
        </div>
      </div>
      <LandingFooter />
      {showContactUs && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowContactUs(!showContactUs)}
          isOpen
          style={{ background: '#fff' }}
        >
          <ContactUsForm setShowDialog={setShowContactUs} title="Contact Us" />
        </Dialog>
      )}
    </div>
  );
};