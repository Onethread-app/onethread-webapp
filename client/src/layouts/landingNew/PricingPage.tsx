import React, { useState } from 'react';
import './style.scss';
import tick from './../../resources/LandingImages/tick.svg';
import { Dialog } from '@blueprintjs/core';
import { NavbarLanding } from './NavbarLanding';
import {
  isMobileOnly
} from 'react-device-detect';
import { ContactSupportForm } from './ContactSupportForm';
import { ContactUsForm } from './ContactUsForm';
import { LandingFooter } from './LandingFooter';
import { SuccessMessage } from 'components/success-message/SuccessMessage';
import { connect } from 'react-redux';
import { TiButton } from 'components/button/Button';
import { GWTSection } from 'components/gwt-section/GWTSection';
import { ReviewSection } from 'components/review-section/ReviewSection';

interface IPricingPageProps {
  response: string;
}

const PricingPageComponent = (
  props: IPricingPageProps
) => {

  const [showForm1, setShowForm1] = useState(false);
  const [showForm3, setShowForm3] = useState(false);

  const customerReview = {
    customer: "Fazlul Hoque",
    position: "Managing Director",
    company: "Plummy Fashions Ltd.",
    review: "I love how simple, yet very efficient TiGrow is. I've been using this software on a daily basis to communicate and collaborate with all my teammates. Kudos to the product owners for their impeccable product."
  };

  return (
    <>
      <NavbarLanding />
      <div
        className="w-100 PricingFirstBackground tc flex flex-column justify-center pa4"
        style={{ height: '20rem' }}
      >
        <h1 className="white f1-l f2-m f3 fw7 ma0">Grow better with the right plan.</h1>
        <h1 className="white f3-ns f5 fw4 fw5-l fw4-m">Try TiGrow free for 30 days - No credit card required</h1>
      </div>
      <div className="flex-l ph5-ns ph4 w-100 pv5">
        <article className="br3 w-50-l w-100 pa4-ns pa3 mh4-l mh3-m basic">
          <div className="flex justify-between">
            <div>
              <h1 className="f2-ns f3 fw7 ma0 basicFont">Workspaces</h1>
              <h1 className="f3-ns f6 fw4 silver ma0">For teams and individuals.</h1>
            </div>
            <div>
              <h1 className="f1-ns f3 fw7 ma0  basicFont"><span className="fw4">$</span>7.99</h1>
              <h1 className="f4-ns f6 fw4 silver ma0">/user per month</h1>
            </div>
          </div>
          <div className="flex mt3">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90"><span className="fw7">Unlimited</span> Projects</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Unlimited</span> Kanban Boards</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90"><span className="fw7">Unlimited</span> Rooms</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">100,000</span> Message History</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">1000 Minute</span> Video Conferencing (Premium)</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Unlimited Minute</span> Video Conferencing (Basic)</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90"><span className="fw7">5 GB</span> Storage</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Unlimited</span> Admins And Project Moderators</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Up To 100</span> Project Team Mates</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Up To 100</span> Colleagues</h1>
          </div>
          <div className="flex mt2">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Up To 50</span> Associates</h1>
          </div>
          <div className="flex mt2 items-start">
            <img className="w-10" style={{ width: isMobileOnly ? '15px' : '23px' }} src={tick} />
            <h1 className="f4-ns f6 fw4 dark-gray ml2 mv0 w-90">
              <span className="fw7">Free Inclusion At The Time Of Release -</span> Major
                Features Like Gantt Chart,
                Clock In-Out, TIme Sheet and Shared Browser
            </h1>
          </div>
          <div className="tc">
            <TiButton to='/signup' mid extraClasses="outline-0 w5-ns mt4 tc">
              Try for free
              <br /><span className="f6 fw4">No credit card required</span>
            </TiButton>
          </div>
        </article>
        <article className="br3 w-50-l w-100 pa4 mh4-l mh3-m enterprise mt4 mt0-l">
          <div>
            <h1 className="f2-l f3 fw7 ma0 basicFont">Enterprise</h1>
            <h1 className="f3-l f5 fw4 silver ma0">For teams with custom needs.</h1>
          </div>
          <h1 className="f4-ns f6 fw5 dark-gray lh-2 w-90">
            We work closely with our enterprise customers to ensure TiGrow meets
            their unique needs.
          </h1>
          <h1 className="f4-ns f6 fw5 dark-gray lh-2 w-90 mt4">
            For more information about how we can make
            TiGrow work for your company, please contact
            us at &nbsp;
            <span className="fw7 blue underline">
              <a href="mailto:sales@tigrow.co">sales@tigrow.co</a>
            </span>
          </h1>
          <div className="tc">
            <TiButton extraClasses="outline-0 w5-ns mt4 tc pointer" mid onClick={() => { setShowForm3(true); }}>
              Contact Us
            </TiButton>
          </div>
        </article>
      </div>
      <ReviewSection bgBlue customerReview={customerReview}/>
      <GWTSection />
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
      { props.response == '201' ?  <SuccessMessage /> : null }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    response: state.landingReducer.contactForm.response
  };
};

export const PricingPage = connect(
  mapStateToProps
)(PricingPageComponent);
