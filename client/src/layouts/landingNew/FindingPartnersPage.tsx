import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import './style.scss';
import tick from './../../resources/LandingImages/tick.svg';
import campaign from './../../resources/LandingImages/campaign.svg';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import BKMEALogo from './../../resources/LandingImages/BKMEA-Logo.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import smile from './../../resources/LandingImages/Smile.png';
import { Button, Dialog } from '@blueprintjs/core';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';

export const FindingPartnersPage = () => {

  const [showForm3, setShowForm3] = useState(false);

  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="flex flex-column-reverse flex-row-ns items-center ph5-l ph4-m ph3 mt5 pt3 mb4-ns tc tl-ns">
        <div className="w-50-ns w-100 pr5-l pr3-m">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f6 ">
            What can an agency or service provider do for you ?
          </h1>
          <h1 style={{ color: '#43466D' }} className="f3-l f5-m f7 fw4 lh-2 vendorLineHeight">
          Generate more leads, increase revenue, and delight your customers with one
           of our vetted and proven agencies or service providers. Get help with marketing,
            CRM implementation, sales enablement, website development and so much more.
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
          <img className="w-85-l w-100" 
          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/man-and-woman-having-a-meeting-in-the-office-2977581.png" />
        </div>
      </div>

      <div className="pv4 ph6-l ph4 tc" style={{ backgroundColor: '#F8F8F5' }}>
        <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f5">
            Find a partner in our global community of service providers who can help you grow.
        </h1>
        <h1 style={{ color: '#43466D' }} className="f3-l f5-m f7 fw4 lh-2">
            Search And Find Partner Companies From Around The World And Invite Them To Collaborate With You In TiGrow.
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
            Grow broader. Grow bigger. Grow better.
          </h1>
          <h1 style={{ color: '#43466D' }} className="f4-l f5 fw4 lh-2">
            <p>
                TiGrow Finding Partners Tool is an ecosystem of businesses that offer marketing, 
                sales, web design, and CRM implementation services, among others.
            </p>
            <p className="mt4">
                Whether you want to expand your services, win new clients, or improve customer retention, 
                TiGrow Finding Partners Tool will provide partners with continuous 
                support on your growth strategy and our software platform to ensure 
                that you grow with your teammates. Because we all know growth isn’t just 
                about your business, it's about your team and their inclusive experience too.
            </p>
          </h1>
        </div>
        <div className="w-50-ns w-100">
          <img className="w-90-l w-80-m vendorSecondWidth" 
          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/two-women-looking-and-pointing-at-macbook-laptop-1569076.png" />
        </div>
      </div>

      <div className="tc-ns ">
        <h1 style={{ color: '#1D3557' }} className="f3-ns f5 ml4 ml0-ns">UPCOMING FEATURES YOU'LL LOVE</h1>
        <div className="flex-ns justify-center" style={{ color: '#1D3557' }}>
          <div className="flex ml4 ml0-ns">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Technological Vendor Section</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Digital Marketing Section</h1>
          </div>
          <div className="flex ml4">
            <img src={tick} />
            <h1 className="f4-ns f6 ml3">Channel Partner Section</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-ns items-center ph6-l ph4 mv5-l mv4 vendorSecondPadding">
        <div className="w-50-ns w-100">
          <img className="w-90-l w-80-m vendorSecondWidth" 
          src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/photo-of-woman-wearing-eyeglasses-3184405.png" />
        </div>
        <div className="w-50-ns w-100 vendorThirdPadding">
           <h1 style={{ color: '#1D3557' }} className="f3-l f4 ">
            Who are the Partners?
           </h1>
           <h1 style={{ color: '#43466D' }} className="f4-l f5 fw4 lh-2">
                <p>
                    TiGrow Finding Partners Tool is designed for customer-centric agencies, 
                    service providers, and other sellers that want to learn, grow their business, 
                    and use the best technology. It’s a good fit if your business:
                </p>
                <p>
                    - Provides consulting on business, technology, sales, marketing, or customer service strategy.<br/> 
                    - Provides tech implementation that handles CRM, systems integrations, or IT services. <br/> 
                    - Provides hands-on services in marketing, sales, or customer service.
                </p>
            </h1>
        </div>
      </div>

      <div className="flex flex-column items-center">
        <div className="w-60-l w-80 colorfulWidth tc pa4-ns pa2" style={{ backgroundColor: '#F8FDFC' }}>
          <img src={campaign} />
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4">
            Right Partnership comes with immense potential
          </h1>
          <h1 style={{ color: '#43466D' }} className="f4-ns f6 fw4 lh-2">
            With global customers, world-class training, a software platform with advanced vendor management tools, 
            and a supportive partner community, the Finding Partner Tool is the place to launch your business 
            into its next phase of growth. Add new revenue streams, win more business, 
            and delight your clients when you partner with TiGrow Partners.
          </h1>
        </div>
      </div>

      <div 
      className="mw9-l companiesMaxWidth mw8-m center
      ph5-ns flex flex-column-reverse flex-row-ns items-center tc tl-ns mb4"
      >
        <div className="w-50-l w-80 pl6-l">
          <h1 className="f2-l f3-m f5" style={{ color: '#0FB7A0' }}>
            Enroll as Partner Today and Start Growing with TiGrow
          </h1> 
          <h1 className="f4-ns f6 fw4 lh-2-ns" style={{ color: '#0FB7A0' }}>
            Ready to accelerate growth for your business and your clients? 
            So are we. We can’t wait to launch and share this partner tool with you. 
          </h1> 
            <Button
              className="f4-ns fw6 bp3-minimal pa4-l pa2 br2 mv4-ns mv2"
              style={{ color: 'white', backgroundColor: '#4B6BC8', textTransform:'uppercase' }} 
              onClick={() => {
                    setShowForm3(true);
                }}
            >
              Contact us to enroll as a partner
          </Button> 
        </div>
        <div className="w-50-l ml6-l">
          <img className="w-70-l w-100-m w-60" src={smile} />
        </div>
      </div>

      <div className="mt4" style={{ backgroundColor: '#F8F8F9' }}>
        <div className="pv4 ph6-l ph4 tc vendorSecondPadding">
          <h1 style={{ color: '#1D3557' }} className="f2-l f3-m f4 ">Built for managing any number of vendors.</h1>
          <h1 style={{ color: '#43466D' }} className="f3-l f4-m f5 fw4">
            Book A Call Today - For A Demo And Get Started With TiGrow Vendor Management tool
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