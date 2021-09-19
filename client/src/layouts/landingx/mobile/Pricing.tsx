import { useTranslation } from 'react-i18next';

import pricingData from 'resources/PricingData.json';
import MobileNavbar from './Navbar';
import PricingCard from 'components/PricingCard/PricingCard';
import MainFooter from './MainFooter';
import WhyOnethread from 'components/WhyOnethread/WhyOnethread';

const MobilePricingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="landing-m w-100">
      <MobileNavbar />
      <h1 className="tc f3">
        <span style={{ color: '#3484F0' }}>
          {t('app.company.Pricing.save-up-text.first-part')}
        </span>{' '}
        {t('app.company.Pricing.save-up-text.second-part')}
      </h1>
      <div
        className="pricing-m flex flex-column items-center justify-center"
        style={{ margin: '3rem 0' }}
      >
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

export default MobilePricingPage;
