import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import './ProjectManagementTool.scss';
import tick from './../../resources/LandingImages/tick.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import BKMEALogo from './../../resources/LandingImages/BKMEA-Logo.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import TMFirstBack from './../../resources/LandingImages/topManagementFirstBack.png';
import { Button, Dialog } from '@blueprintjs/core';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

import { ProjectManagementToolForPM } from './ProjectManagementToolForPM';
import { ProjectManagementToolForBusiness } from './ProjectManagementToolForBusiness';

export const ProjectManagementTool = () => {
  const [showForm3, setShowForm3] = useState(false);

  const tabItems = [
    'Top Managements',
    'Project Managers',
    'Business Owners',
  ];

  const [selectedTab, setSelectedTab] = useState(tabItems[0]);
  // const selectedTabs = tabItems[selectedTab];

  if (selectedTab === 'Project Managers') {
    return <ProjectManagementToolForPM />;
  } else if (selectedTab === 'Business Owners') {
    return <ProjectManagementToolForBusiness />;
  }
  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="flex flex-row-ns flex-column items-center ph5-l ph4 mt5">
        <div className="w-50-l w-90 mt5 self-start">
          <h1
            style={{ color: '#1D3557' }}
            className="f2-l dt f3-m f4 w-100"
          >
            The Project Management Tool with Something for Everyone.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f5-ns f7 lh-copy w-75 fw5 ttc"
          >
            Do you think Project Management Tool is just about some
            cards in a kanban board? Think again, TiGrow project
            management has tools for everyone on your team, here's how
            TiGrow PMT makes your job easier...
          </h1>
        </div>
        <div
          className="w-50-l w-90 nl3-l nr4 mr2-l mt0-ns nt4 self-end workHomeFirstBack"
          style={{ overflow: 'hidden' }}
        >
          <img
            className="w-100"
            src={
              'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/projectFirstBack.png'
            }
          />
        </div>
      </div>

      {/* tab feature will go here  */}
      <div
        className="flex-ns justify-center tab-custom-height"
        style={{
          backgroundColor: '#6E729E',
          height: '80px',
          marginTop: '-4px',
        }}
      >
        {/* <Button
          className="flex ml4 outline-0 f4-l f5-m f6 pm-btn pm-btn-active"
          style={{
            color: '#F5F5F5',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            width: '19rem',
          }}
        >
          Top Managements
        </Button>

        <Button
          className="flex ml4 outline-0 f4-l f5-m f6 pm-btn"
          style={{
            color: '#F5F5F5',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            width: '19rem',
          }}
        >
          Project Managers
        </Button>

        <Button
          className="flex ml4 outline-0 f4-l f5-m f6 pm-btn"
          style={{
            color: '#F5F5F5',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            width: '19rem',
          }}
        >
          Business Owners
        </Button> */}

        {tabItems.map((tabItem) => (
          <Button
            // className="flex ml4 outline-0 f4-l f5-m f6 pm-btn"
            style={{
              color: '#F5F5F5',
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
              width: '19rem',
            }}
            onClick={() => setSelectedTab(tabItem)}
            className={
              tabItem === selectedTab
                ? 'flex ml4 outline-0 f4-l f5-m f6 pm-btn pm-btn-active'
                : 'flex ml4 outline-0 f4-l f5-m f6 pm-btn'
            }
          >
            {tabItem}
          </Button>
        ))}
      </div>

      <div
        className="pv4 ph6-l ph4 tc"
        style={{ backgroundColor: '#fff' }}
      >
        <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f5 ">
          TiGrow Project Management Tool for Top Management
        </h1>
        <h1
          style={{ color: '#43466D' }}
          className="f3-l f5-m f7 fw4 lh-2"
        >
          With the easy-to-use TiGrow PMT, you'll never have to
          manually ask for employee performance updates or wonder how
          your team is working toward deadline. Because you have
          important things to do.
        </h1>
        <Button
          className="f4-l f5-m f6 fw6 bp3-minimal pa4-l pa3-m pa2 br3 outline-0 mt2"
          style={{
            color: 'WHITE',
            border: 'solid 2px WHITE',
            backgroundColor: '#4B6BC8',
            width: '19rem',
          }}
          onClick={() => {
            setShowForm3(true);
          }}
        >
          GET TiGrow FREE
        </Button>
      </div>

      <div className="flex flex-row-ns flex-column-reverse items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
        <div
          className="w-50-ns w-100 pr5-l pr4-m"
          style={{ maxWidth: '760px' }}
        >
          <h1 style={{ color: '#1D3557' }} className="f3-l f4">
            Get full visibility into your teams task activities in
            real time.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f4-l f5 fw4 lh-2"
          >
            <p>
              Get an up-to-the-minute view of your entire teams task
              activities on a clean, visual dashboard,
            </p>
            <p className="mt4">
              {' '}
              With detailed reports on teams task activities,
              productivity, and individual performance, you'll never
              be in dark about how your team is tracking toward their
              key performance indicators, and you'll have all the data
              to coach your team to success.
            </p>
          </h1>
        </div>
        <div className="w-50-ns w-100">
          <img
            className="w-100-l projectSecondWidth"
            src={TMFirstBack}
          />
        </div>
      </div>
      <div className="tc-ns dn-m">
        <h1
          style={{ color: '#1D3557' }}
          className="f3-ns f5 ml4 ml0-ns"
        >
          POPULAR FEATURES YOU'LL LOVE
        </h1>
        <div
          className="flex-ns justify-center"
          style={{ color: '#1D3557' }}
        >
          <div className="flex ml4 ml0-ns">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Kanban Boards</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Task, Sub-Task</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Video Conference</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Rooms</h1>
          </div>
        </div>
      </div>
      <div className="tc-ns db-m dn-l dn">
        <h1
          style={{ color: '#1D3557' }}
          className="f3-ns f5 ml4 ml0-ns"
        >
          POPULAR FEATURES YOU'LL LOVE
        </h1>
        <div
          className="flex flex-column items-center"
          style={{ color: '#1D3557' }}
        >
          <div className="flex">
            <div className="flex">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Kanban Boards</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Task, Sub-Task</h1>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Video Conference</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Rooms</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-ns items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
        <div className="w-50-ns w-100">
          <img
            className="w-100-l vendorSecondWidth"
            src={
              'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/Group%203734.svg'
            }
          />
        </div>
        <div
          className="w-50-ns w-100 pl5-l pl4-m vendorThirdPadding"
          style={{ maxWidth: '760px' }}
        >
          <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
            Arm your team with time-saving tools they'll actually use.
          </h1>

          <h1
            style={{ color: '#43466D' }}
            className="f4-l f5 fw4 lh-2"
          >
            <p>
              Give your team tools to collaborate with less work, and
              remove friction from their communication process.
            </p>
            <p className="mt4">
              {' '}
              Your team's day starts with clocking into their assigned
              tasks, they can communicate with real time messaging,
              even create a video conference from the same window at
              TiGrow, don't need to switch between multiple platforms
              for that. As the day progresses, sub tasks are getting
              done, and you're getting the overview of their works
              from Gantt chart like dashboard, after they clock-out,
              you can check the timesheet for getting a brief overview
              of their days work.
            </p>
          </h1>
        </div>
      </div>

      <div className="tc-ns dn-m">
        <h1
          style={{ color: '#1D3557', textTransform: 'uppercase' }}
          className="f3-ns f5 ml4 ml0-ns"
        >
          upcoming Features you'll love
        </h1>
        <div
          className="flex-ns justify-center"
          style={{ color: '#1D3557' }}
        >
          <div className="flex ml4 ml0-ns">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Clock In-Clock Out</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Timesheet</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Shared Browser</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Advanced Gantt Chart</h1>
          </div>
        </div>
      </div>
      <div className="tc-ns db-m dn-l dn">
        <h1
          style={{ color: '#1D3557', textTransform: 'uppercase' }}
          className="f3-ns f5 ml4 ml0-ns"
        >
          upcoming Features you'll love
        </h1>
        <div
          className="flex flex-column items-center"
          style={{ color: '#1D3557' }}
        >
          <div className="flex">
            <div className="flex">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Clock In-Clock Out</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Timesheet</h1>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Shared Browser</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Advanced Gantt Chart</h1>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="tc flex flex-column justify-center"> */}

      <div className="tc flex flex-column justify-center mt5">
        <div className="flex flex-column items-center">
          <h1
            className=" f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl lh-2"
            style={{ color: '#43466D' }}
          >
            <span
              style={{
                color: '#0FB7A0',
                fontFamily: 'Cambria',
                fontStyle: 'italic',
              }}
              className="f1 fw8"
            >
              "
            </span>
            I love how simple, yet very efficient TiGrow is. I've been
            using this software on a daily basis to communicate and
            collaborate with all my teammates. Kudos to the product
            owners for their impeccable product.
            <span
              style={{
                color: '#0FB7A0',
                fontFamily: 'Cambria',
                fontStyle: 'italic',
              }}
              className="f1 fw8"
            >
              "
            </span>
          </h1>
          <h1
            style={{ color: '#707070' }}
            className=" f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl"
          >
            FAZLUL HOQUE
          </h1>
          <h1
            style={{ color: '#707070' }}
            className=" f5-ns f7 fw4 w-60-l w-80 colorfulWidth tl ma0"
          >
            Managing Director | Plummy Fashions Ltd.
          </h1>
        </div>
      </div>
      <div className="mt4" style={{ backgroundColor: '#F8F8F9' }}>
        <div className="pv4 ph6-l ph4 tc vendorSecondPadding">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">
            The Project Management Tool Your <br /> Whole Business
            Will Use.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f3-l f4-m f5 fw4"
          >
            Start using TiGrow PMT for free - with something for
            everyone.
          </h1>
          <Button
            className="f4-ns fw6 bp3-minimal pa4-l pa3-m pa2 w5 br3 outline-0 mt2"
            style={{
              color: 'WHITE',
              border: 'solid 2px WHITE',
              backgroundColor: '#4B6BC8',
            }}
            onClick={() => {
              setShowForm3(true);
            }}
          >
            GET TiGrow FREE
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center pv4 tc">
          <img src={marketLogo} className="marketLogo" />
          <img
            className="ml4-ns ml2 vendorLogoSpacing plummyLogo"
            src={plummyLogo}
          />
          <img
            className="ml4-ns ml2 vendorLogoSpacing plummyLogo"
            src={BKMEALogo}
          />
          <img
            className="ml4-ns ml2 vendorLogoSpacing knitLogo"
            src={knitLogo}
          />
        </div>
      </div>
      <LandingFooter />
      {showForm3 && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowForm3(!showForm3)}
          isOpen
          style={{ background: '#fff' }}
        >
          <ContactUsForm
            setShowDialog={setShowForm3}
            title="Contact Us"
          />
        </Dialog>
      )}
    </div>
  );
};
