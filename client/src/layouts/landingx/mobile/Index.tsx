import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_ID, PAGE_ID, WHATSAPP_URL } from 'config';

import MainLanding from 'resources/images/main-landing.png';
import CombinedLogo from 'resources/images/combined-logo.png';

import DashboardIcon from 'resources/images/dashboard-icon.png';
import MessagesIcon from 'resources/images/messages-icon.png';
import ReportIcon from 'resources/images/report-icon.png';

import MailGif from 'resources/images/mail.gif';
import ReportGif from 'resources/images/report.gif';

import MarketExpress from 'resources/images/companies/market-express.png';
import Plummy from 'resources/images/companies/plummy-fashions.png';
import BatteryLow from 'resources/images/companies/battery-low.png';
import Checkmate from 'resources/images/companies/checkmate.png';
import Goodybro from 'resources/images/companies/goodybro.png';

import ProjectPng from 'resources/images/project.png';
import MeetingPng from 'resources/images/meeting.png';
import TasksPng from 'resources/images/tasks.png';
import IntegrationsPng from 'resources/images/integrations.png';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import whatsapp from '../../../resources/images/icons/whatsapp.png';
import chatIcon from '../../../resources/images/icons/chat.png';

import { OTButton } from 'components/button/Button';
import MobileNavbar from './Navbar';
import MainFooter from './MainFooter';

import './Index.styles.scss';

const MobileIndex = () => {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="landing-m w-100">
      <MobileNavbar />
      <section className="main-header w-100 relative flex flex-column items-center justify-center mb5">
        <h2 className="heading tc">
          {t('landing.homepage.main-header.heading.first-part')}
          <br />
          <span style={{ color: '#3484F0' }}>
            {t('landing.homepage.main-header.heading.second-part')}{' '}
          </span>
        </h2>
        <img src={MainLanding} alt="" />
        <h3 className="sub-heading tc mt3">
          <span className="b">
            {' '}
            {t('landing.homepage.main-header.sub-heading.first-part')}
          </span>{' '}
          {t('landing.homepage.main-header.sub-heading.second-part')}
        </h3>
        <OTButton to="/signup">
          {t('landing.homepage.main-header.Sign-Up button')}
        </OTButton>
      </section>
      <section className="second-section w-100 flex relative mb5">
        <div className="unified-tool flex flex-column items-center justify-around w-100 pb3">
          <div className="unified-tool-text tc">
            {t(
              'landing.homepage.second-section.unified-text.first-part',
            )}{' '}
            <span className="b">
              {t(
                'landing.homepage.second-section.unified-text.second-part',
              )}
            </span>
          </div>
          <div className="unified-tool-content flex flex-column justify-start br2">
            <h3 className="unified-tool-content-header tj">
              <span className="b">
                {t(
                  'landing.homepage.second-section.unified-heading.first-part',
                )}{' '}
              </span>
              {t(
                'landing.homepage.second-section.unified-heading.second-part',
              )}
            </h3>
            <div className="unified-tool-content-body">
              <div className="flex items-center">
                <img src={DashboardIcon} alt="" />
                <p>
                  <span className="b mr1">Messages: </span>
                  {t('landing.homepage.second-section.messages')}
                </p>
              </div>
              <div className="flex items-center">
                <img src={MessagesIcon} alt="" />
                <p>
                  <span className="b mr1">Project dashboard: </span>{' '}
                  {t(
                    'landing.homepage.second-section.project-dashboard',
                  )}
                </p>
              </div>
              <div className="flex items-center">
                <img src={ReportIcon} alt="" />
                <p>
                  <span className="b mr1">Reports: </span>
                  {t('landing.homepage.second-section.reports')}
                </p>
              </div>
            </div>
            <h3 className="unified-tool-content-footer tc">
              {t('landing.homepage.second-section.unified-footer')}
            </h3>
          </div>
        </div>
      </section>
      <section className="third-section flex flex-column mb5 tc">
        <div className="gif flex items-center justify-center">
          <img src={MailGif} alt="MailGif" />
        </div>
        <div className="contents flex flex-column items-center justify-center mb4">
          <h3>{t('landing.homepage.third-section.upper-content')}</h3>
          <p>
            {t('landing.homepage.third-section.main-upper-content')}
          </p>
        </div>
        <div className="gif flex items-center justify-center">
          <img src={ReportGif} alt="reportgif" />
        </div>
        <div className="contents flex flex-column items-center justify-center">
          <h3>{t('landing.homepage.third-section.lower-content')}</h3>
          <p>
            {t('landing.homepage.third-section.main-lower-content')}
          </p>
        </div>
      </section>
      <section className="teams flex flex-column mb5 tc">
        <h2>
          {t('landing.homepage.teams.listoftheusers.first-part')}
          <br />{' '}
          <p style={{ color: '#3484F0' }}>
            {t('landing.homepage.teams.listoftheusers.second-part')}
          </p>
        </h2>

        <div className="companies flex flex-column items-center justify-center">
          <div className="flex items-center justify-around w-100">
            <img src={Goodybro} alt="goodybro" />
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={Plummy} alt="plummy fashions" />
            <img src={BatteryLow} alt="battery low" />
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={Checkmate} alt="checkmate" />
          </div>
          <div className="flex items-center justify-around w-100">
            <img src={MarketExpress} alt="market express" />
          </div>
        </div>
        <OTButton to="/signup">
          {t('landing.homepage.main-header.Sign-Up button')}
        </OTButton>
      </section>
      <section className="product-details flex flex-column items-center justify-center mb5 w-100">
        <div className="header flex flex-column items-center justify-center mb5">
          <img src={CombinedLogo} alt="Onethread" />
          <h2>
            <span style={{ color: '#3484F0' }}>
              {t(
                'landing.homepage.product-details.header1.first-part',
              )}
            </span>
            {t(
              'landing.homepage.product-details.header1.second-part',
            )}
            {t('landing.homepage.product-details.header1.third-part')}
          </h2>
        </div>
        <div className="options flex flex-column items-center justify-center">
          <div className="option">
            <div className="option-gif">
              <img
                src={ProjectPng}
                alt=""
                // style={{ maxWidth: '405px' }}
              />
            </div>
            <div className="option-content">
              <h3>{t('landing.homepage.product-details.header2')}</h3>
              <p>
                {t('landing.homepage.product-details.subheader2')}
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={MeetingPng}
                alt=""
                // style={{ maxWidth: '508px' }}
              />
            </div>
            <div className="option-content">
              <h3>{t('landing.homepage.product-details.header3')}</h3>
              <p>
                {t('landing.homepage.product-details.subheader3')}
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={TasksPng}
                alt=""
                // style={{ maxWidth: '558px' }}
              />
            </div>
            <div className="option-content">
              <h3>{t('landing.homepage.product-details.header4')}</h3>
              <p>
                {t('landing.homepage.product-details.subheader4')}
              </p>
            </div>
          </div>
          <div className="option">
            <div className="option-gif">
              <img
                src={IntegrationsPng}
                alt=""
                // style={{ maxWidth: '413px' }}
              />
            </div>
            <div className="option-content">
              <h3>{t('landing.homepage.product-details.header5')}</h3>
              <p>
                {t('landing.homepage.product-details.subheader5')}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="footer flex flex-column items-center justify-center w-100 tc">
        <MainFooter />
      </section>
      {showChat && (
        <>
          <div className="whatsapp-web">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <img src={whatsapp} alt="whatsapp" />
            </a>
          </div>
          <MessengerCustomerChat pageId={PAGE_ID} appId={APP_ID} />
        </>
      )}
      <div
        className="toggole-icon-mobile"
        onClick={() => setShowChat(!showChat)}
      >
        <img src={chatIcon} alt="icon" />
      </div>
    </div>
  );
};

export default MobileIndex;
