import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import pricingData from 'resources/PricingData.json';

import Navbar from './Navbar';
import PricingCard from 'components/PricingCard/PricingCard';
import MainFooter from './MainFooter';
import MobilePricingPage from './mobile/Pricing';

const PricingPage = () => {
  return isMobileOnly ? (
    <MobilePricingPage />
  ) : (
    <div className="landing w-100">
      <Navbar />
      <div className="pricing flex items-center justify-center">
        {pricingData.map((data, i) => (
          <PricingCard data={data} key={i} />
        ))}
      </div>
      <MainFooter />
    </div>
  );
};

export default PricingPage;
