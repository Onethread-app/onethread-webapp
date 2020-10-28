import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import './style.scss';
import tick from './../../resources/LandingImages/tick.svg';
import camera from './../../resources/LandingImages/360-degree-camera.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import BKMEALogo from './../../resources/LandingImages/BKMEA-Logo.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import smile from './../../resources/LandingImages/Smile.png';
import { Button, Dialog } from '@blueprintjs/core';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

export const FindingTeammatesPage = () => {

  const [showForm3, setShowForm3] = useState(false);

  return (
    <div className="w-100">
        <NavbarLanding />
        <div className="flex flex-column-reverse flex-row-ns items-center ph5-l ph4-m ph3 mt5 pt3 mb4-ns tc tl-ns">
            <div className="w-50-ns w-100 pr5-l pr3-m">
                <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f6 ">
                    From Remote Working to contractual hiring, we got you covered
                </h1>
                <h1 style={{ color: '#43466D' }} className="f3-l f5-m f7 fw4 lh-2 vendorLineHeight">
                    Request for a teammate, hire, and add to your organization or to a specific project,
                    monitor performance, review timesheet, employee onboarding was never this easier!
                </h1>
                <Button
                    className="f4-l f5-m f7 fw6 bp3-minimal pa4-l pa3-m pa2 br3 mb4 outline-0 vendorRqstBtn"
                    style={{ color: 'WHITE', border: 'solid 2px WHITE', backgroundColor: '#4B6BC8' }}
                    onClick={() => {
                    setShowForm3(true);
                    }}
                >
                    Request A Demo
                </Button>
            </div>
            <div className="w-50-ns w-100">
                <img
                    className="w-85-l w-100"
                    src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/woman-wearing-blue-top-beside-table-1181712.png" 
                />
            </div>
        </div>

        <div className="pv4 ph6-l ph4 tc" style={{ backgroundColor: '#F8F8F5' }}>
            <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f5">
                Find & Hire Your Remote, Contractual, 
                Full Time Or Part Time Teammate For Any Type Of Projects.
            </h1>
            <h1 style={{ color: '#43466D' }} className="f3-l f5-m f7 fw4 lh-2">
                Find The Perfect Team Mate For Your Team today! 
                Let's start onboarding!
            </h1>
            <Button
                className="f4-l f5-m f6 fw6 bp3-minimal pa4-l pa3-m pa2 br3 outline-0 mt2"
                style={{ color: 'WHITE', border: 'solid 2px WHITE', backgroundColor: '#4B6BC8', width: '19rem' }}
                onClick={() => {
                    setShowForm3(true);
                }}
            >
                Request A Demo
            </Button>
        </div>

        <div className="flex flex-row-ns flex-column-reverse items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
            <div className="w-50-ns w-100 pr5-l pr4-m">
                <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
                    Not finding suitable candidate? No need to worry! 
                    Post a request for one.
                </h1>
                <h1 style={{ color: '#43466D' }} className="f4-l f5 fw4 lh-2">
                    <p>
                        Finding Teammate tool comes with an inclusive Request for Teammate
                        feature through which you can find the right candidate who can be 
                        a freelancer, a full time hiring or even a contractual hiring. 
                        This tool completes a 360 degree solution for human resource 
                        finding and management at any size of company. You can not 
                        only pinpoint the type of applicant you want, but also through 
                        a simple dashboard you can review your applicants and move into 
                        interviewing stage all inside TiGrow. Why not give it a try today?
                    </p>
                </h1>
            </div>
            <div className="w-50-ns w-100">
                <img 
                    className="w-90-l w-80-m vendorSecondWidth" 
                    src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/advice-advise-advisor-business-7075.png" 
                />
            </div>
        </div>

        <div className="tc-ns ">
            <h1 style={{ color: '#1D3557' }} className="f3-ns f5 ml4 ml0-ns">
                UPCOMING FEATURES YOU'LL LOVE
            </h1>
            <div 
                className="flex-ns justify-center" 
                style={{ color: '#1D3557', textTransform: 'capitalize' }}
            >
                <div className="flex ml4 ml0-ns">
                    <img src={tick} />
                    <h1 className="f4-ns f6 ml3 ttc">
                        Request for new team mate
                    </h1>
                </div>
                <div className="flex ml4">
                    <img src={tick} />
                    <h1 className="f4-ns f6 ml3">
                        Post your Portfolio Services/ Skills and Get hired by Companies
                    </h1>
                </div>
                <div className="flex ml4">
                    <img src={tick} />
                    <h1 className="f4-ns f6 ml3">
                        project based time sheet for payment
                    </h1>
                </div>
            </div>
        </div>
      
        <div className="flex-ns items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
            <div className="w-50-ns w-100">
                <img 
                    className="w-90-l w-80-m vendorSecondWidth" 
                    src={'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/' +
                    'focused-diverse-colleagues-writing-on-papers-with-pen-in-3869372.png' }
                />
            </div>
            <div className="w-50-ns w-100 vendorThirdPadding">
                <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
                        Who are the teammates?
                </h1>
                <h1 style={{ color: '#43466D' }} className="f4-l f5 fw4 lh-2">
                    <p>
                        Teammates in TiGrow ranges from individuals who are seeking 
                        full time, part time, contractual hiring to individuals who 
                        are freelancers and want to work with you in specific project 
                        based work or to be fully involved with your organization. 
                        We aren't specific to any type of professionals, teammates 
                        ranges all categories of professions. 
                    </p>
                    <p>
                        We are providing you with timesheet in TiGrow's PMT, 
                        where you can track time and pay your contractual 
                        or freelancer hiring's accordingly.
                    </p>
                </h1>
            </div>
        </div>

        <div className="flex flex-column items-center">
            <div 
                className="w-60-l w-80 colorfulWidth tc pa4-ns pa2" 
                style={{ backgroundColor: '#F8FDFC' }}
            >
                <img src={camera} />
                <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4">
                    A hassle free experience in a single platform.
                </h1>
                <h1 style={{ color: '#43466D' }} className="f4-ns f6 fw4 lh-2">
                    Hiring means going through one platform to posting hiring posts,
                    to check out the mails to find the right candidates, 
                    interviewing them through another platform, 
                    then onboarding them to another human resource tool, 
                    TiGrow replace these all, and provides you with a 
                    360 degree solution for hiring.
                </h1>
            </div>
        </div>

        <div 
            className="mw9-l companiesMaxWidth mw8-m center
            ph5-ns flex flex-column-reverse flex-row-ns items-center tc tl-ns mb4"
        >
            <div className="w-50-l w-80 pl6-l">
                <h1 className="f2-l f3-m f5" style={{ color: '#0FB7A0' }}>
                    Enroll as Teammate Today and Offer your services in TiGrow
                </h1>
                <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#0FB7A0' }}>
                    Ready to accelerate growth for your career? So are we. 
                    We can’t wait to launch and share this teammate tool with you.
                </h1>
                <Button
                    className="f4-ns fw6 bp3-minimal pa4-l pa2 br2 mv4-ns mv2"
                    style={{ color: 'white', backgroundColor: '#4B6BC8', textTransform: 'uppercase' }}
                    onClick={() => {
                            setShowForm3(true);
                        }}
                    >
                    Sign up today
                </Button>
                <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#707070' }}>
                    & wait a bit for our teammate update
                </h1>
            </div>
            <div className="w-50-l ml6-l">
                <img className="w-70-l w-100-m w-60" src={smile} />
            </div>
        </div>

        <div className="mt4" style={{ backgroundColor: '#F8F8F9' }}>
            <div className="pv4 ph6-l ph4 tc vendorSecondPadding">
                <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">
                    Built for an Immersive Human Resource Solution
                </h1>
                <h1 style={{ color: '#43466D' }} className="f3-l f4-m f5 fw4">
                    Book a call Today - for a demo and get started with TiGrow Team Management tool
                </h1>
                <Button
                    className="f4-ns fw6 bp3-minimal pa4-l pa3-m pa2 w5 br3 outline-0 mt2"
                    style={{ color: 'WHITE', border: 'solid 2px WHITE', backgroundColor: '#4B6BC8' }}
                    onClick={() => {
                    setShowForm3(true);
                    }}
                >
                    Book A Call
                </Button>
            </div>
            <div className="flex flex-row items-center justify-center pv4 tc">
            <img src={marketLogo} className="marketLogo" />
            <img className="ml4-ns ml2 vendorLogoSpacing plummyLogo" src={plummyLogo} />
            <img className="ml4-ns ml2 vendorLogoSpacing plummyLogo" src={BKMEALogo} />
            <img className="ml4-ns ml2 vendorLogoSpacing knitLogo" src={knitLogo} />
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
          <ContactUsForm setShowDialog={setShowForm3} title="Contact Us" />
        </Dialog>
      )}
    </div>
  );
};