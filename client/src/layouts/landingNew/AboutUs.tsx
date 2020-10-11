import React, { useState } from 'react';
import { NavbarLanding } from './NavbarLanding';
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