import React from 'react';

import { OTButton } from 'components/button/Button';
import tick from 'resources/images/tick.svg';
import './PricingCard.styles.scss';

interface IPricingCard {
  data: {
    name: string;
    type: string;
    options: string[];
  };
}

const PricingCard = (props: IPricingCard) => {
  const { data } = props;
  return (
    <div className="pricing-card flex flex-column items-center">
      <div className="pricing-card-package">
        <h3 className="pricing-card-package-name">{data.name}</h3>
        <p className="pricing-card-package-price">
          {data.type === 'startup' ? (
            <p
              className="flex items-center justify-center"
              style={{ height: '49px' }}
            >
              ${' '}
              <span style={{ fontSize: '42px', lineHeight: '49px' }}>
                1
              </span>
              /user/mon
            </p>
          ) : data.type === 'free' ? (
            <p
              className="flex items-center justify-center"
              style={{ height: '49px' }}
            >
              ${' '}
              <span style={{ fontSize: '42px', lineHeight: '49px' }}>
                0
              </span>
            </p>
          ) : (
            <p
              className="flex items-center justify-center"
              style={{ height: '49px' }}
            >
              Contact Us for Quotation
            </p>
          )}
        </p>
      </div>
      <div className="pricing-card-divider"></div>

      <OTButton to="/signup">Start For Free</OTButton>

      <div className="pricing-card-divider"></div>
      <div className="pricing-card-options flex flex-column items-start w-100 ml4">
        {data.options.map((op, i) => (
          <div className="flex items-center mv1" key={i}>
            <img
              src={tick}
              alt=""
              className="mr1"
              // style={{ width: '14px', height: '14px' }}
            />
            <p className="ma0">{op}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
