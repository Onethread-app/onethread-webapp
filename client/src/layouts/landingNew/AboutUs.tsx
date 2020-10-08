import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import { Button, Dialog } from '@blueprintjs/core';
import task from './../../resources/LandingImages/task-complete.svg';
import tick from './../../resources/LandingImages/tick.svg';
import meeting from './../../resources/LandingImages/meeting.svg';
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
import firstBack from './../../resources/LandingImages/aboutFirstBack.svg';
import secondBack from './../../resources/LandingImages/aboutUsSecondBack.png';
import { isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import './style.scss';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';
import { Dialog } from '@blueprintjs/core';
import firstBack from './../../resources/LandingImages/aboutFirstBack.svg';
import secondBack from './../../resources/LandingImages/aboutUsSecondBack.png';
import './style.scss';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';
import { ProductCard } from '../../components/productCard/ProductCard';
import { CGCSection } from '../../components/cgc-section/CGCSection';
import CardData from '../../resources/CardData';
import { CLWithNumbers } from '../../components/company-logos/CompanyLogos';
import { GWTSection } from 'components/gwt-section/GWTSection';

export const AboutPage = () => {
  const [showContactUs, setShowContactUs] = useState(false);
  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="AboutFirstBackground">
        <section className="center pa3 ph5-ns">
          <article className="dt w-100 AboutFirstInner">
            <div className="dtc v-mid tc white ph3 ph4-l">
              <h1 className="white f1-l f2-m f4 AboutFirstInnerFont">
                A vision to help millions grow better.
              </h1>
            </div>
          </article>
        </section>
      </div>
      <div className="ph6-l ph5-m ph4 flex flex-row-ns flex-column-reverse items-center tc-ns tl">
        <div className="w-50-ns">
          <h1 className="f2-l f3-m f4 mv4" style={{ color: '#1D3557' }}>Our Mission</h1>
          <h1 className="f4-ns f5 fw4 lh-2 tl" style={{ color: '#43466D' }}>
            Opportunities should be equal for everyone regardless of their
            capacity and size. Business processes must be fair, acknowledging
            performances, not individuals. We want to make this world a reality
            by connecting businesses and optimizing operations so that you get
            rewarded for your effort.
        </h1>
        </div>
        <div className="w-50-ns">
          <img src={firstBack} />
        </div>
      </div>
      <div className="tc ph6-l ph5-m ph4 pv5-ns">
        <h1 className="f2-l f3-m f4 mv4" style={{ color: '#1D3557' }}>Our Story</h1>
        <div className="flex-ns items-center">
          <div className="w-50-ns">
            <img src={secondBack} className="w-90-l w-100" />
          </div>
          <div className="w-50-ns tl ml4-ns">
            <h1 className="f4-ns f5 fw4 lh-2" style={{ color: '#43466D' }}>
              As fellow MBA students at IBA, in 2019, Rubaiyat and Erfanul
              noticed organization's need for an efficient procurement
              operation. Organizations were loosing money and foregoing
              opportunities to connect with new partners outside their
              inner circle of vendors.
              </h1>
            <h1 className="f4-ns f5 fw4 lh-2" style={{ color: '#43466D' }}>
              From this need, a company was born: TiGrow. It was founded
              to disrupt the least automated portion of the organizations
              by prioritizing connectivity and collaboration among all
              the relevant human resource in a company.
          </h1>
          </div>
        </div>
      </div>
      <div
        className="w-100 ph5-l ph4-m ph4 pt6-ns pt2 pv5 comprehensiveGrid"
      >
        <div>
          <h1 className="f2-l f3-m f4" style={{ color: '#1D3557' }}>
            Our Platform
          </h1>
          <p style={{ color: '#43466D' }} className="f4-l f5 f7 mt4-ns mt2 lh-2 mb4">
            TiGrow offers a full stack of software for task management, real
            time communication and video conferencing with a project
            management tool at its core. They’re powerful alone
            — but even better when used together.
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
          <div className="flex items-baseline">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">KANBAN BOARDS</h1>
          </div>
          <div className="flex items-baseline">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">TASK, SUB-TASK</h1>
          </div>
          <div className="flex items-baseline">
            <img src={tick} />
            <h1 className="f5-l f6-m f7 fw7 ml2">PROJECT MODERATORS</h1>
          </div>
          <div className="flex items-baseline">
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
        <div className="bg-white br2 shadow-4 mt4 mt0-ns pv2">
          <div className=" ml-auto mt3 pl3 white"
            style={{ borderRadius: '20px 0 0 20px', width: '90px', backgroundColor: '#0FB7A0' }}>
            <h1 className="f6-l f7 fw4" style={{ paddingTop: '.1rem', paddingBottom: '.1rem' }}>
              Upcoming
            </h1>
          </div>
          <div className="ph4">
            <article className="flex items-center">
              <img
                style={{ width: isMobileOnly ? '25px' : '35px' }}
                src={business}
              />
              <div className="ml2">
                <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Procurement Tool</p>
              </div>
            </article>
            <p className="bb b--light-silver pb4 f5-l f6-m f7 fw5 mt3 lh-2" style={{ color: '#43466D' }}>
              From Medium to Large enterprise everyone has to manage multiple vendors for their
              activities, managing all those vendors wasn't this much easier before.
          </p>
            <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>Popular Features</h1>
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
        <div className="bg-white br2 shadow-4 mt4 mt0-ns pa4">
          <div>
            <article className="flex items-center">
              <img
                style={{ width: isMobileOnly ? '25px' : '35px' }}
                src={meeting}
              />
              <div className="ml2">
                <p className="f3-l f4-m f5 fw7" style={{ color: '#1D3557' }}>Video Conferencing</p>
              </div>
            </article>
            <p className="bb b--light-silver pb4 f5 fw5-ns mt3 lh-2" style={{ color: '#43466D' }}>
              Meeting Remotely Just Got Easier. Integrated Video Conferencing, Screen Sharing,
              And Messaging For Teams Big And Small.
          </p>
            <h1 className="f5-l f6 fw7 mt4" style={{ color: '#1D3557' }}>Popular Features</h1>
            <div className="flex items-baseline">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">SCREEN SHARING</h1>
            </div>
            <div className="flex items-baseline">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">CUSTOM NUMBER OF PARTICIPANTS</h1>
            </div>
            <div className="flex items-baseline">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">UNLIMITED VIDEO MINUTES</h1>
            </div>
            <div className="flex items-baseline">
              <img src={tick} />
              <h1 className="f5-l f7 fw7 ml2">FREE FOR UP TO 12 PARTICIPANTS</h1>
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
            <h1 className="f6-ns f7 fw4" style={{ paddingTop: '.1rem', paddingBottom: '.1rem' }}>
              Upcoming
            </h1>
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
              Search And Find Partner Companies From Around The World And
              Invite Them To Collaborate With You In TiGrow.
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
            onClick={() => setShowContactUs(true)}
          >
            Request For A Demo
      </Button>
        </div>
      </div>
      <section className="mw9-l companiesMaxWidth mw8-m center pa3 ph5-l
       ph4-m flex-ns items-center-ns tc mt5-ns mt2 mb4-ns">
        <div className="w-34-l w-40-m w-100 companiesWidth">
          <h1 className="f1-l f2-m f3 companiesFont" style={{ color: '#0FB7A0' }}>6,370</h1>
          <h1 style={{ color: '#0FB7A0' }} className="f3-l f4-m f5 fw5 ph4 ph0-ns">
            Users in over <span className="fw7">28</span> countries collaborating with TiGrow
          </h1>
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
      </section>
      <section className="mw9-l companiesMaxWidth mw8-m center ph5-ns
       flex flex-column-reverse flex-row-ns items-center tc tl-ns mb4">
        <div className="w-50-l w-80">
          <h1 className="f2-l f3-m f5" style={{ color: '#0FB7A0' }}>
            Start Growing With TiGrow Today
          </h1>
          <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#0FB7A0' }}>
            with tools to plan and collaborate while having a seamless user
            experience that keeps everyone in the loop and focuses on the
            necessary with little to no learning curve, and a support
            team excited to help you, getting started with this
            comprehensive tool has become even easier.
            </h1>
          <NavLink to="/signup">
            <Button
              className="f4-ns fw6 bp3-minimal pa4-l pa2 br2 mv4-ns mv2"
              style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            >
              GET TiGrow FREE
          </Button>
          </NavLink>
          <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#707070' }}>
            Get started with FREE tools, and upgrade as you grow.
          </h1>
        </div>
        <div className="w-50-l ml6-l">
          <img className="w-80-l w-100-m w-60" src={smile} />
        </div>
      </section>
        {
          CardData.map((data) => (
            <ProductCard key={data.id} data={data} />
          ))
        }
      </div>
      <CGCSection setShowContactUs={setShowContactUs} />
      <CLWithNumbers />
      <GWTSection />
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