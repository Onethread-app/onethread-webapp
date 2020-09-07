import React from 'react';
import marketLogo from './../../resources/LandingImages/marketLogo.png';
import DYSINLogo from './../../resources/LandingImages/DYSINLogo1.png';
import plummyLogo from './../../resources/LandingImages/plummy.png';
import knitLogo from './../../resources/LandingImages/knitwearLogo.png';
import MCCILogo from './../../resources/LandingImages/mcci.png';
import batteryLogo from './../../resources/LandingImages/batteryLow.png';
import bkmeaLogo from './../../resources/LandingImages/BKMEA-Logo.png';
import peakwardLogo from './../../resources/LandingImages/peakwardLogo.png';

export const CLWithNumbers = () => {
  return (
    <div className="mw9-l companiesMaxWidth mw8-m center pa3 ph5-l ph4-m flex-ns items-center-ns tc mt5-ns mt2 mb4-ns">
      <div className="w-34-l w-40-m w-100 companiesWidth">
        <h1
          className="f1-l f2-m f3 companiesFont"
          style={{ color: '#0FB7A0' }}
        >
          6,370
        </h1>
        <h1
          style={{ color: '#0FB7A0' }}
          className="f3-l f4-m f5 fw5 ph4 ph0-ns"
        >
          Users in over <span className="fw7">28</span> countries
          collaborating with TiGrow
        </h1>
      </div>
      <div className="flex flex-column  pl6-l pl4-m companiesInnerPadding items-center mv4 mv0-ns">
        <div>
          <img src={marketLogo} className="marketLogo" />
          <img className="ml4-ns ml2 DYSINLogo" src={DYSINLogo} />
          <img className="ml2 plummyLogo" src={plummyLogo} />
          <img className="ml2 knitLogo" src={knitLogo} />
        </div>
        <div className="mv3">
          <img src={MCCILogo} className="marketLogo" />
          <img className="ml4-ns ml2 DYSINLogo" src={batteryLogo} />
          <img className="ml2 plummyLogo" src={bkmeaLogo} />
          <img className="ml2 knitLogo" src={peakwardLogo} />
        </div>
      </div>
    </div>
  );
};

export const MostUsedCL = () => {
  return (
    <div className="flex flex-row items-center justify-center ph5-l ph4 pv3 tc">
      <img src={marketLogo} className="marketLogo" />
      <img
        className="ml4-ns ml2 vendorLogoSpacing plummyLogo"
        src={plummyLogo}
      />
      <img
        className="ml4-ns ml2 vendorLogoSpacing plummyLogo"
        src={bkmeaLogo}
      />
      <img
        className="ml4-ns ml2 vendorLogoSpacing knitLogo"
        src={knitLogo}
      />
    </div>
  );
};
