import React from 'react';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

const SoftwareBrandImage = require('./../../resources/images/homeLogo.png');
const BackgroundImage = require('./../../resources/images/homeSS.png');
const WorkplaceImage = require('./../../resources/images/homeSS3.png');
const LeadGenerationImage = require('./../../resources/images/homeSS3.png');
const ResellerImage = require('./../../resources/images/homeSS3.png');
const RecruitmentImage = require('./../../resources/images/homeSS3.png');

export const HomePage = () => {
  return (
    <div>
      <div className="relative homePageBackground cover">
        <div className="flex w-100 justify-end">
          <Link to="/signin">
            <Button
              className="mr4-l mt4-l mr5-m mt5-m mt2 mr2 outline-0"
              style={{ background: '#060517', color: 'white', fontSize: '1rem' }}
            >
              Login
            </Button>
          </Link>
        </div>
        <div className="cf flex-ns">
          <div className="w-100 w-50-ns dt vh-100-ns">
            <div className="v-mid dtc">
              <div className="w-70 center">
                <img className="w-34-ns w-30 mb4-l mb3-m" src={SoftwareBrandImage} />
                <h1 className="tj white mb5-l mb4-m f4-ns fw5 f7 mv3">
                  TiGrow is a professional network crafted for
                  Business Professionals, where they can
                  trade between each other, find nearest
                  suppliers, create workplaces in which they
                  can maintain not only intra company
                  communications but also external
                  communications with organizations where
                  they can create smart contracts between
                  them.
                </h1>
                <Link to="/signin">
                  <Button
                    className="grow pointer"
                    style={{ outline: "none", color: "white", background: '#0fa3a3', borderRadius: '26px', width: '132px', height: '41px' }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <p className="pointer white mt5-l mt4-m f4-ns mt1 mv3">Don't have an account?</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-100 w-50-ns dt vh-100-ns">
            <div className="v-mid dtc">
              <div className="center w-100-ns w-70 mv2">
                <img className="" src={BackgroundImage} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-ns justify-around ph5-ns pv7-l pv6-m">
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={WorkplaceImage} />
          <h1 className="f5">Workplace</h1>
          <p>
            A Hub for Organizations
  Internal & External
  Communication
          </p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={LeadGenerationImage} />
          <h1 className="f5">Lead Generation Place</h1>
          <p>
            B2B Trading made simpler, Generation was never this easier.
          </p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={ResellerImage} />
          <h1 className="f5">Reseller Dashboard</h1>
          <p>
            Resell products from hundreds
            of wholesalers to start your
            entrepreneurial journey.
          </p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={RecruitmentImage} />
          <h1 className="f5">Recruitment</h1>
          <p>
            Find partners for a start-up,
            even if they are not in its
            current network.
          </p>
        </div>
      </div>
      <div className="cf flex-ns " style={{ backgroundColor: '#060517' }}>
        <div className="fl w-100">
          <p className="mv3 tc b white f4">
            Powered by TiGrow Ltd.
          </p>
        </div>
        {/* <div className="w-100 w-50-ns dt">
          <div className="w-80 center-ns flex justify-around">
            <div>
              <h1 className="f5 silver mv3">Company</h1>
              <h1 className="f5 silver mv3">Team</h1>
              <h1 className="f5 silver mv3">Product</h1>
              <h1 className="f5 silver mv3">Contact</h1>
            </div>
            <div>
              <h1 className="f5 silver mv3">Privacy</h1>
              <h1 className="f5 silver mv3">Blog</h1>
              <h1 className="f5 silver mv3">Docs</h1>
              <h1 className="f5 silver mv3">Press</h1>
            </div>
          </div>
        </div>
        <div className="w-100 w-50-ns dt">
          <div className="w-80 center">
            <div >
              <h1 className="f5 white">Address</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
            <div>
              <h1 className="f5 white">Contact Information</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  )
}