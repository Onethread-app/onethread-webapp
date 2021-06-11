import React from 'react';
import pricingData from 'resources/PricingData.json';

import MobileNavbar from './Navbar';
import PricingCard from 'components/PricingCard/PricingCard';
import MainFooter from './MainFooter';

const MobilePricingPage = () => {
  return (
    <div className="landing-m w-100">
      <MobileNavbar />
      <div
        className="pricing-m flex flex-column items-center justify-center"
        style={{ margin: '3rem 0' }}
      >
        {pricingData.map((data, i) => (
          <PricingCard data={data} key={i} />
        ))}
      </div>
      <MainFooter />
    </div>
  );
};

export default MobilePricingPage;
