import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavbarLanding } from './NavbarLanding';
import { TiButton } from 'components/button/Button';
import { Dialog } from '@blueprintjs/core';
import './style.scss';
import { LandingFooter } from './LandingFooter';
import { ContactUsForm } from './ContactUsForm';
import { SuccessMessage } from 'components/success-message/SuccessMessage';
import { ProductCard } from '../../components/productCard/ProductCard';
import { CGCSection } from '..../../components/cgc-section/CGCSection';
import CardData from '../../resources/CardData';
import { CLWithNumbers } from 'components/company-logos/CompanyLogos';
import { GWTSection } from 'components/gwt-section/GWTSection';

interface ILandingPageProps {
  response: string;
}
const LandingPageComponent = (props: ILandingPageProps) => {
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
          <TiButton to='/signup' mid>GET TiGrow FREE</TiButton>
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
        {
          CardData.map((data) => (
            <ProductCard key={data.id} data={data} />
          ))
        }
      </div>
      <CGCSection setShowContactUs={setShowContactUs}/>
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
      { props.response == '201' ?  <SuccessMessage /> : null }
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    response: state.landingReducer.contactForm.response
  };
};

export const LandingPage = connect(
  mapStateToProps
)(LandingPageComponent);