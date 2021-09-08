import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import tick from './../../resources/LandingImages/tick.svg';
import task from './../../resources/LandingImages/task-complete.svg';
import intClient from './../../resources/LandingImages/international-client.svg';
import business from './../../resources/LandingImages/business.svg';
import team from './../../resources/LandingImages/team.svg';
import support from './../../resources/LandingImages/support.svg';

import { TiButton } from '../button/Button';

interface ICardData {
  data: {
    id: number;
    mainHeader: string;
    subHeader: string;
    icon:
      | typeof task
      | typeof intClient
      | typeof business
      | typeof team
      | typeof support;
    featureType: string;
    features: {
      content: string;
    }[];
  };
}

export const ProductCard = ({ data }: ICardData) => {
  return (
    <div className=" bg-white br2 pa4 shadow-4">
      <article className="flex items-center">
        <img
          style={{ width: isMobileOnly ? '25px' : '35px' }}
          src={data.icon}
        />
        <div className="ml2">
          <p
            className="f3-l f4-m f5 fw7"
            style={{ color: '#1D3557' }}
          >
            {data.mainHeader}
          </p>
        </div>
      </article>
      <p
        className="bb b--light-silver pb4 f5-l f6-m f7 fw5 mt3 lh-2"
        style={{ color: '#43466D' }}
      >
        {data.subHeader}
      </p>
      <h1
        className="f5-l f6 fw7 mt4 ttc"
        style={{ color: '#1D3557' }}
      >
        {data.featureType} FEATURES
      </h1>
      {data.features.map((feature) => (
        <div className="flex">
          <img src={tick} />
          <h1 className="f5-l f6-m f7 fw7 ml2">{feature.content}</h1>
        </div>
      ))}
      <TiButton to="/signup" mid extraClasses="w-90 mh3 mv4">
        Get Started
      </TiButton>
    </div>
  );
};
