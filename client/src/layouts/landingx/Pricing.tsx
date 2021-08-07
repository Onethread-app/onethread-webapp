import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import pricingData from 'resources/PricingData.json';

import Navbar from './Navbar';
import PricingCard from 'components/PricingCard/PricingCard';
import MainFooter from './MainFooter';
import MobilePricingPage from './mobile/Pricing';
import { useTranslation } from 'react-i18next';
import WhyOnethread from 'components/WhyOnethread/WhyOnethread';

const PricingPage = () => {
  const { t } = useTranslation();

  return isMobileOnly ? (
    <MobilePricingPage />
  ) : (
    <div className="landing w-100">
      <Navbar />
      <h1 className="tc f2">
        <span style={{ color: '#3484F0' }}>
          {t('app.company.Pricing.save-up-text.first-part')}
        </span>{' '}
        {t('app.company.Pricing.save-up-text.second-part')}
      </h1>
      <div className="pricing flex items-center justify-center">
        {pricingData.map((data, i) => (
          <PricingCard data={data} key={i} />
        ))}
      </div>
      <div className="flex justify-center mb4">
        <WhyOnethread />
      </div>
      <MainFooter />
    </div>
  );
};

export default PricingPage;
