import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
import { LandingFooter } from './LandingFooter';
import customerCare from './../../resources/LandingImages/customer.svg';
import callCenter from './../../resources/LandingImages/call-center.svg';
import strategy from './../../resources/LandingImages/strategy.svg';
import { Button, Dialog } from '@blueprintjs/core';
import { ContactSupportForm } from './ContactSupportForm';
import { ContactUsForm } from './ContactUsForm';
import GoogleMapReact from 'google-map-react';
import { MarkerComponent } from './Marker';

export const ContactUsPage = (
) => {
  const [showForm1, setShowForm1] = useState(false);
  const [showForm3, setShowForm3] = useState(false);
  return (
    <div className="w-100">
      <NavbarLanding />
      <div className="ContactFirstBackground">
        <article className="vh-50 dt w-100 contactUsFirstBackText">
          <div className="dtc v-mid tc white ph4">
            <h1 className="f1-l f2 mb3">Get in touch</h1>
            <h1 className="f3-l f5 fw4 ma0">Want to get in touch? We'd love to hear from you.</h1>
            <h1 className="f3-l f5 fw4 ma0">Here's how you can reach us...</h1>
          </div>
        </article>
      </div>
      <div className="flex-l ph5-ns mt4-ns">
        <div className="shadow-4 pa4 ma1 tc w-50-l mb4 mh3">
          <img src={callCenter} />
          <h1 className="f3-ns f4" style={{ color: '#1D3557' }}>
            Talk to Sales
          </h1>
          <h1 className="f4-ns f6 fw5" style={{ color: '#43466D' }}>
            Interested in TiGrow's software?
            Just pick up the phone to chat with a member of our sales team.
          </h1>
          <h1 className="f4-ns f6" style={{ color: '#00A18B' }}>
            +880 175 1325670
          </h1>
          <h1 className="f4-ns f6 fw5" style={{ color: '#43466D' }}>
            Or, We can contact you at your suitable time
          </h1>
          <Button
            className="f4-l f5-m f7 fw6-ns bp3-minimal pv3 ph5 ph4-ns br2 mv3 w-90 w-auto-ns"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            onClick={() => {
              setShowForm3(true);
            }}
          >
            Book A Call
          </Button>
        </div>
        <div className="shadow-4 pa4 ma1 tc w-50-l mb4 mh3">
          <img src={customerCare} />
          <h1 className="f3-ns f4" style={{ color: '#1D3557' }}>
            Contact Customer Support
          </h1>
          <h1 className="f4-ns f6 fw5" style={{ color: '#43466D' }}>
            Sometimes you need a little help from your friends.
            Or a TiGrow support rep. Don’t worry… we’re here for you.
          </h1>
          <Button
            className="f4-l f5-m f7 fw6-ns bp3-minimal pa3 br2 mt5-ns w-90 w-auto-ns"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            onClick={() => {
              setShowForm1(true);
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>
      <section className="mw7-ns center ph5-ns ph2 ml3-m ml1">
        <div className="shadow-4 pa4 ma4-l tc center">
          <img src={strategy} />
          <h1 className="f3-ns f4" style={{ color: '#1D3557' }}>
            See a Demo
          </h1>
          <h1 className="f4-ns f6 fw5" style={{ color: '#43466D' }}>
            Want to have a guided tour of TiGrow's software? Our sales team are here for you!
          </h1>
          <Button
            className="f4-l f5-m f7 fw6-ns bp3-minimal pa3 br2 mv4 w-90 w-auto-ns"
            style={{ color: 'white', backgroundColor: '#4B6BC8' }}
            onClick={() => {
              setShowForm3(true);
            }}
          >
            Request A Demo
          </Button>
        </div>
      </section>

      <div className="tc mv6-ns mv5 mh4-ns">
        <h1 className="f2-ns f4" style={{ color: '#1D3557' }}>Our Office</h1>
        <section className="mw8-ns mw6 center shadow-4-ns">
          <div className="flex-ns">
            <div style={{ height: '40vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAy_gOvrQWdLR6QA2-pfmOybwv5V4NI7MU' }}
                defaultCenter={{
                  lat: 23.747186,
                  lng: 90.394782
                }}
                defaultZoom={16}
                yesIWantToUseGoogleMapApiInternals
              >
                <MarkerComponent
                  lat={23.747186}
                  lng={90.394782}
                  text={'Concord Tower'}
                />
              </GoogleMapReact>
            </div>
            <div className="mh4 mt4-ns tl w-25-ns">
              <h1 className="f3-ns f5" style={{ color: '#707070' }}>Location</h1>
              <h1 className="f5-ns fw4 f5" style={{ color: '#707070' }}>
                Concord Tower<br /> 113 Kazi Nazrul Islam Ave<br /> Dhaka 1205
              </h1>
              <h1 className="f3-ns f5" style={{ color: '#707070' }}>Phone</h1>
              <h1 className="f5-ns fw4 f5" style={{ color: '#707070' }}>
                +880 1677 224636
              </h1>
            </div>
          </div>
        </section>
      </div>
      <LandingFooter />
      {showForm1 && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowForm1(!showForm1)}
          isOpen
          style={{ background: '#fff' }}
        >
          <ContactSupportForm setShowDialog={setShowForm1} title="Contact Tigrow Support" />
        </Dialog>
      )}
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