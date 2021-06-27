import React from 'react';

import LanguageSelector from 'components/LanguageSelector';

// import PcIcon from 'resources/images/icons/pc.png';
// import AndroidIcon from 'resources/images/icons/android.png';
// import MacIcon from 'resources/images/icons/mac.png';
import FBIcon from 'resources/images/icons/fb.png';
import LinkedInIcon from 'resources/images/icons/linkedin.png';
import YTIcon from 'resources/images/icons/youtube.png';
import { useTranslation } from 'react-i18next';

const MainFooter = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="main-footer flex flex-column items-center w-100">
        {/* <div className="main-footer-links flex items-center justify-between flex-nowrap">
        <div>
          <ul>
            <li>Features</li>
            <li>Integration</li>
            <li>Pricing</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>For Startups</li>
            <li>For Agencies</li>
            <li>For NGOs</li>
            <li>See More Uses Cases</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>OneThread vs WhatsApp</li>
            <li>OneThread vs Email</li>
            <li>OneThread vs Teams</li>
            <li>See More Comparisons</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Data Security</li>
          </ul>
        </div>
      </div>
      <div className="main-footer-border"></div> */}
        <div
          className="main-footer-icons flex justify-between items-center"
          style={{ marginBottom: '3rem' }}
        >
          {/* <div className="group-1">
          <img src={PcIcon} alt="windows" />
          <img src={AndroidIcon} alt="android" />
          <img src={MacIcon} alt="mac" />
        </div> */}
          <div className="group-1">
            <a
              href="https://www.facebook.com/onethread.app.2021"
              target="_blank"
              rel="noreferrer"
            >
              {' '}
              <img src={FBIcon} alt="facebook" />
            </a>
            <a
              href="https://www.linkedin.com/company/72622667 "
              target="_blank"
              rel="noreferrer"
            >
              {' '}
              <img src={LinkedInIcon} alt="linkedin" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCuZZreI7e9VFYS1svTww6GA"
              target="_blank"
              rel="noreferrer"
            >
              <img src={YTIcon} alt="youtube" />
            </a>
            <LanguageSelector />
          </div>
        </div>
      </div>
      <div className="footer-copyright flex items-center w-100">
        {/* <h1 className="tc w-100">
          Copyright 2021 Onethread. All rights reserved. Proudly made
          in Bangladesh.
        </h1> */}
        <h1 className="tc w-100">
         {t('landing.homepage.footer.copyright')}
        </h1>
      </div>
    </>
  );
};

export default MainFooter;
