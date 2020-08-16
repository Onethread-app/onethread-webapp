import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import './style.css';
import vendorFirst from './../../resources/LandingImages/vendorFirstBack.png';
import vendorSecond from './../../resources/LandingImages/vendorSecondBack.png';
import vendorThird from './../../resources/LandingImages/vendorThirdBack.png';
import tick from './../../resources/LandingImages/tick.svg';
import growth from './../../resources/LandingImages/growth.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import BKMEALogo from './../../resources/LandingImages/BKMEA-Logo.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import { Button, Dialog } from '@blueprintjs/core';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

export const ProjectManagementTool = () => {
  const [showForm3, setShowForm3] = useState(false);

  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="flex items-center ph5-l ph4-m ph3 mt6 mb4">
        <div className="w-50 pr5-l pr3-m">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f6 ">
            The Project Management Tool with Something for Everyone.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f3-l f5-m f7 fw4 lh-2 vendorLineHeight"
          >
            Do you think Project Management Tool is just about some cards in a kanban board? Think again, TiGrow project management has tools for everyone on your team, here's how Tigrow PMT makes your job easier...
          </h1>
        </div>
        <div className="w-50">
          <img className="w-85-l w-100" src={vendorFirst} />
        </div>
      </div>

      {/* tab feature will go here  */}

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
          With the easy-to-use TiGrow PMT, you'll never have to manually ask for employee performance updates or wonder how your team is working toward deadline. Because you have important things to do.
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

      {/* feature will go here  */}
      <div className="flex flex-row-ns flex-column-reverse items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
        <div className="w-50-ns w-100 pr5-l pr4-m">
          <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
            A Solution targeting the specific need of vendor
            management
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f4-l f5 fw4 lh-2"
          >
            <p>
              From Medium to Large, even small enterprises have to
              deal with vendors or partner companies for their
              activities, How to manage all these vendors?
            </p>
            <p className="mt4">
              {' '}
              ERP? ERP is a complex software and both economically and
              at efficiency perspective this is not the best solution
              to go with.
            </p>
            <p className="mt4">
              TiGrow Vendor Management Solution gives an end to end
              solution through vendor collaboration, communication and
              management features.
            </p>
          </h1>
        </div>
        <div className="w-50-ns w-100">
          <img
            className="w-80-l vendorSecondWidth"
            src={vendorSecond}
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
            <h1 className="f4-ns f6 ml3">Quotations</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Smart Contract</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">PM Tools</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">
              Scalable Up To Unlimited Vendors
            </h1>
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
              <h1 className="f4-ns f6 ml3">Quotations</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">Smart Contract</h1>
            </div>
          </div>
          <div className="flex">
            <div className="flex">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">PM Tools</h1>
            </div>
            <div className="flex ml4">
              <img src={tick} />
              <h1 className="f4-ns f6 ml3">
                Scalable up to unlimited vendors
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-ns items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
        <div className="w-50-ns w-100">
          <img
            className="w-80-l vendorSecondWidth"
            src={vendorThird}
          />
        </div>
        <div className="w-50-ns w-100 vendorThirdPadding">
          <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
            An Unique 360 Degree Solution to an age old problem
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f4-l f5 fw4 lh-2"
          >
            Built on TiGrow's Advanced PMT, this Vendor Management
            Solution can be further extended by adding Finding
            Partners Tool, which will give a 360 degree solution of
            vendor management, from finding a right vendor, to adding
            it to Vendor Management Tool and then collaborating and
            communicating with it completes the whole cycle.
          </h1>
        </div>
      </div>
      {/* <div className="tc flex flex-column justify-center"> */}
      <div className="flex flex-column items-center">
        <div
          className="w-60-l w-80 colorfulWidth tc pa4-ns pa2"
          style={{ backgroundColor: '#F8FDFC' }}
        >
          <img src={growth} />
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">
            Built to be the most robust and economic solution out
            there.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f4-ns f6 fw4 lh-2"
          >
            There isn't any single solution to this vendor management
            problem of an enterprise, why rely on solutions like
            WhatsApp and Viber to manage your vendors, or even
            spending loads on ERP solutions when you can have a much
            more lighter, robust, efficient and economically feasible
            solution for your company.
          </h1>
        </div>
        {/* </div> */}
      </div>
      <div className="tc flex flex-column justify-center mt5">
        <div className="flex flex-column items-center">
          <h1
            className=" f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl lh-2"
            style={{ color: '#43466D' }}
          >
            <span style={{ color: '#0FB7A0' }} className="f1 fw8">
              "
            </span>
            It's like a life saver for the executives of my company
            who are currently dealing with 368 vendors simultaneously,
            and TiGrow is improving day by day, hearing our pain point
            and adding new features accordingly - I'm loving their
            solutions.
            <span style={{ color: '#0FB7A0' }} className="f1 fw8">
              "
            </span>
          </h1>
          <h1
            style={{ color: '#707070' }}
            className=" f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl"
          >
            Syed Naimul Abedin
          </h1>
          <h1
            style={{ color: '#707070' }}
            className=" f5-ns f7 fw4 w-60-l w-80 colorfulWidth tl ma0"
          >
            CEO | Peakward Enterprise
          </h1>
        </div>
      </div>
      <div className="mt4" style={{ backgroundColor: '#F8F8F9' }}>
        <div className="pv4 ph6-l ph4 tc vendorSecondPadding">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">
            Built for managing any number of vendors.
          </h1>
          <h1
            style={{ color: '#43466D' }}
            className="f3-l f4-m f5 fw4"
          >
            Book A Call Today - For A Demo And Get Started With TiGrow
            Vendor Management tool
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
            Book A Call
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
