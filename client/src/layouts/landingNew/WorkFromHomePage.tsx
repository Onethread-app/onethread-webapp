import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import './style.scss';
import './WorkFromHomePage.scss';
import { Button, Dialog } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import tick from './../../resources/LandingImages/tick.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import BKMEALogo from './../../resources/LandingImages/BKMEA-Logo.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

export const WorkFromHomePage = () => {
  const [showForm3, setShowForm3] = useState(false);
  return (
    <div className="w-100">
      <NavbarLanding />
      {/* Header */}
      <section className="flex flex-row-ns flex-column items-center ph5-l ph4 mt5 mb5-l mb2-m mb1">
        <div className="w-40-l w-90 mt2 self-start">
          <h1
            style={{ color: '#1D3557' }}
            className="f2-l dt f3-m f4 w-100"
          >
            Working From Home was never this easier!
          </h1>

          <p
            className="f5-ns f7 lh-copy w-75 fw5 ttc"
            style={{ color: '#43466D' }}
          >
            Effective WFH is much more than having video meetings.
            TiGrow Work From Home tool has tools for everyone on your
            team, here's how TiGrow WFH solution makes your job
            easier...
          </p>
        </div>
        <div
          className="w-60-l w-90 nl3-l nr4 mr2-l mt0-ns nt4 self-end workHomeFirstBack"
          style={{ overflow: 'hidden' }}
        >
          <img
            className="w-100"
            src={
              'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/workHomeFirstBack.png'
            }
            alt="Work From Home"
          />
        </div>
      </section>
      {/* Ad */}
      <section className="pv4-l pv2 ph6-l ph4 tc mb1-ns mb3">
        <h2
          className="f2-l f4-m f4 fw6-ns fw5 mb2"
          style={{ color: '#1D3557' }}
        >
          TiGrow WFH Tool is the most complete product out there
        </h2>
        <p
          className="f4-l f5-m f7 lh-copy tc"
          style={{ color: '#43466D' }}
        >
          From Simple tools that organize communication and keep your
          whole team focused on their Key Performance Indicators, To
          advanced features like shared browsers and modified gantt
          chart, All included in the TiGrow WFH Tool.
        </p>
        <NavLink to="/signup">
          <Button
            className="f4-ns fw6 bp3-minimal pa4-l pa3 ph5 br2 mv4-ns mv2"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            GET TiGrow FREE
          </Button>
        </NavLink>
      </section>
      {/* Monitoring Teammates */}
      <section className="flex flex-row-ns flex-column-reverse ph5-l ph4 mv2">
        <div className="w-50-ns mh3-ns">
          <h3
            className="f3-l f4-m f5 fw7 mb2 mt0-ns"
            style={{ color: '#1D3557' }}
          >
            Monitor All your Teammates Performance and Projects Health
            from One Dashboard.
          </h3>
          <p
            className="f4-l f5-m f7 w-85-l lh-2-l lh-copy tl-l tj"
            style={{ color: '#43466D' }}
          >
            <span className="db mb3">
              TiGrow WFH Tool gives you a dashboard where you can
              track your entire team's KPI performance. The Dashboard
              gives you per task per project based view where you can
              easily monitor if the project is progressing or not.
            </span>
            <span className="db">
              Moreover, this gives your team complete control to track
              a single teammates past performance record for a
              specific timeframe. Performance appraisal was never
              easier.
            </span>
          </p>
        </div>
        <div className="w-50-ns mh3-ns">
          <img
            className="w-100"
            src={
              'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/workHomeSecondBack.png'
            }
            alt="Working From Home"
          />
        </div>
      </section>
      {/* Popular Features */}
      <section className="tc-ns ph5-l ph4 mv5-l mv4">
        <h1 style={{ color: '#1D3557' }} className="f3-ns f5 ttu">
          POPULAR FEATURES YOU'LL LOVE
        </h1>
        <div
          className="w-60-m center flex flex-row-ns flex-column flex-wrap justify-center-l justify-between-m justify-start tc-l"
          style={{ color: '#1D3557' }}
        >
          <div className="flex ml3-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Kanban Boards</h1>
          </div>
          <div className="flex ml3-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Task, Sub-Task</h1>
          </div>
          <span className="db w-100-m w0"></span>
          <div className="flex ml3-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Video Conference</h1>
          </div>
          <div className="flex ml3-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Rooms</h1>
          </div>
        </div>
      </section>
      {/* Remote Teams */}
      <section className="flex flex-row-ns flex-column ph5-l ph4 mv5-l mv4">
        <div className="w-50-ns ml3-l mr5-l mh3-m">
          <img
            className="w-100"
            src={
              'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/workHomeThirdBack.png'
            }
            alt="Remote Teams"
          />
        </div>
        <div className="w-50-ns mh3-ns ">
          <h3
            className="f3-l f4-m f5 fw7 mb3 mt0-ns"
            style={{ color: '#1D3557' }}
          >
            Have Remote Teams? Multiple vendors to collaborate? Have
            to manage all of them with your internal team? TiGrow WFH
            Tool gives you the easiest solution.
          </h3>
          <p
            className="f4-l f5-m f7 lh-copy lh2-l"
            style={{ color: '#43466D' }}
          >
            <span className="db mb3">
              With TiGrow WFH Tool's clock in-clock out feature
              monitor your teammates time table per task within a
              project. If a teammate is working on multiple tasks at a
              time, don't worry after clocking in, TiGrow WFH Tool
              will monitor his/her's timing from each task
              individually.
            </span>
            <span className="db">
              And ultimately with the timesheet you can have a brief
              overview of your teammates HH:MM based timing on each
              task and on each project, if you are maintaining hour
              based teammates on your pay-roll then it will be super
              easy now to pay him/her based on this timesheet.
            </span>
          </p>
        </div>
      </section>
      {/* Upcoming Features */}
      <section className="tc-ns ph5-l ph4 mv5-l mv4">
        <h1 style={{ color: '#1D3557' }} className="f3-ns f5 ttu">
          upcoming Features you'll love
        </h1>
        <div
          className="w-60-m center-m flex-ns flex-wrap justify-center-l justify-between-m justify-start"
          style={{ color: '#1D3557' }}
        >
          <div className="flex items-baseline-m mh4-l ml0-ns w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Clock In-Clock Out</h1>
          </div>
          <div className="flex justify-center-m items-baseline-m mh4-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Timesheet</h1>
          </div>
          <span className="db w-100-m w0"></span>
          <div className="flex items-baseline-m mh4-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">Shared Browser</h1>
          </div>
          <div className="flex items-baseline-m mh4-l w-50-m">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3 ml2-m">
              Advanced Gantt Chart
            </h1>
          </div>
        </div>
      </section>
      {/* Comments */}
      <section className="tc flex flex-column justify-center ph5-l ph4 mv5-l mv4">
        <div className="flex flex-column items-center">
          <h1
            className="f3-ns f6 fw4 w-60-l w-80 colorfulWidth quote tl lh-2"
            style={{ color: '#43466D' }}
          >
            TiGrow WFH Tool is simple and easy to use, I've been using
            this software almost on a daily basis to communicate with
            team members throughout this pandemic and their service is
            impeccable.
          </h1>
          <h1
            style={{ color: '#707070' }}
            className="f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl"
          >
            Syed Naimul Abedin
          </h1>
          <h1
            style={{ color: '#707070' }}
            className="f5-ns f7 fw4 w-60-l w-80 colorfulWidth tl ma0"
          >
            CEO | Peakward Enterprise
          </h1>
        </div>
      </section>
      {/* Vendors */}
      <section
        className="tc pv4 ph5-l ph4"
        style={{ backgroundColor: '#F8F8F9' }}
      >
        <div className="pb2 ph6-l ph4-m">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">
            The WFH Tool that gives you a truly{' '}
            <span className="db-l">360 degree solution.</span>
          </h1>
          <h1 style={{ color: '#43466D' }} className="f5-ns f7 fw4">
            Start using TiGrow WFH Tool for free - with something for
            everyone.
          </h1>
        </div>
        <NavLink to="/signup">
          <Button
            className="f4-ns fw6 bp3-minimal pa4-l pa3 ph5 br2 mv4-ns mv2"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
          >
            GET TiGrow FREE
          </Button>
        </NavLink>

        <div className="flex flex-row items-center justify-center ph5-l ph4 pv3 tc">
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
      </section>
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
