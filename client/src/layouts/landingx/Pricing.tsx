import React from 'react';
import pricingData from 'resources/PricingData.json';

import Navbar from './Navbar';
import PricingCard from 'components/PricingCard/PricingCard';
import MainFooter from './MainFooter';

const PricingPage = () => {
  return (
    <div className="landing w-100">
      <Navbar />
      <div
        className="flex items-center justify-center"
        style={{ height: 'calc(100vh - 70px)' }}
      >
        {pricingData.map((data, i) => (
          <PricingCard data={data} key={i} />
        ))}
      </div>
      <MainFooter />
    </div>
  );
};

export default PricingPage;
