import React from 'react';
import { Navbar, Alignment } from '@blueprintjs/core';
import { EmailVerificationForm } from './EmailVerificationForm';

const SoftwareBrandImage = require('./../../resources/images/TiGrowText.png');
const BackgroundImage = require('./../../resources/images/homeSS.png');
const WorkplaceImage = require('./../../resources/images/workplace.png');
const LeadGenerationImage = require('./../../resources/images/Marketplace.png');
const ResellerImage = require('./../../resources/images/Reseller.png');
const RecruitmentImage = require('./../../resources/images/Recruitment.png');
const TigrowLogo = require('./../../resources/images/tigrowLogo.png');
const homepic1 = require('./../../resources/images/Home-pic1.png');
const homepic2 = require('./../../resources/images/Home-pic2.png');
const BgImage = require('./../../resources/images/Bg-png.png');
const BgHalfCircle = require('./../../resources/images/Bg-halfCircle.png');
const BgHalfTriangle1 = require('./../../resources/images/Bg-halfTriangle1.png');
const BgHalfTriangle2 = require('./../../resources/images/Bg-halfTriangle2.png');

export const HomePage = () => {

  return (
    <div>
      <div className="relative cover-ns w-100 vh-100"
        style={{ backgroundColor: '#060517', backgroundImage: `url(${BgImage})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left bottom' }}
      >
        <div className="flex" style={{ height: '10vh' }}>
          <Navbar className="mt4" style={{ background: 'none' }}>
            <Navbar.Group align={Alignment.LEFT}>
              <img
                src={TigrowLogo}
                className="mh3-ns mh2"
                alt="Site Logo"
                style={{ width: '2.5rem' }}
              />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT} >
              <a href="/signin"
                className="link white hover-blue mh4-ns mh2 f5-ns f6"
                style={{ outline: '0px' }}
              >
                Features
              </a>
              <a href="/signin"
                className="link white hover-blue mh4-ns mh2 f5-ns f6"
                style={{ outline: '0px' }}
              >
                Expo
              </a>
              <a href="/signin"
                className="link white hover-blue mh4-ns mh2 ba br4 w4-ns w3 h2 pt1 tc f5-ns f6"
                style={{ outline: '0px' }}
              >
                Login
              </a>
            </Navbar.Group>
          </Navbar>
        </div>
        <div className="cf flex-ns" style={{ height: '80vh' }}>
          <div className="w-100 w-60-ns dt" style={{ height: '100%' }}>
            <div className="v-mid dtc">
              <div className="w-70-l w-90 center">
                <img className="w-40-ns w-30" src={SoftwareBrandImage} />
                <h1 className="tj silver mb4-ns f3-ns f7 mv3" style={{ fontWeight: 600 }}>
                  We Recrafted Linkedin to grow <br /> Professionals.
                </h1>
                <EmailVerificationForm />
              </div>
            </div>
          </div>
          <div className="w-100 w-40-ns dt" style={{ height: '100%' }}>
            <div className="v-mid dtc">
              <div className="center w-100 mv2">
                <img className="w-100" src={BackgroundImage} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ph5-ns  relative w-100 cover"
        style={{ backgroundImage: `url(${BgHalfCircle})`, backgroundRepeat: 'no-repeat' }}
      >
        <div className="absolute bg-white shadow-4 br3 pv4 ph5 w-70-l w-90" style={{ left: '50%', transform: 'translateX(-50%)', top: '-9%' }} >
          <h1 className="f2-ns f3 lh-title tc mt0 mt2-ns mb4">Introducing TiGrow</h1>
          <p className="tj tc-ns ">TiGrow is a professional network crafted for Business Professionals, where they</p>
          <p className="tj tc-ns "> can trade between each other, find nearest suppliers, create workplaces in which</p>
          <p className="tj tc-ns "> they can maintain not only intra company communications but also external</p>
          <p className="tj tc-ns "> communications with organizations where they can create</p>
          <p className="tj tc-ns "> smart contracts between them.</p>
        </div>
        <div className="pt7"
        >
          <h1 className="f1-l f2-m f3 lh-title tc pb5-ns pt6-l pt5">Features</h1>
          <div className="flex-ns justify-around">
            <div className="tc cf mh1-l w-25-ns w-100 ph3">
              <img src={WorkplaceImage} />
              <h1 className="f5">Workplace</h1>
              <p className="mv0">A Hub for Organizations Internal</p>
              <p> & External Communication</p>
            </div>
            <div className="tc cf mh1-l w-25-ns w-100 ph3">
              <img src={LeadGenerationImage} />
              <h1 className="f5">Lead Generation Place</h1>
              <p className="mv0">B2B Trading made simpler,</p>
              <p>Lead Generation was never this easier.</p>
            </div>
            <div className="tc cf mh1-l w-25-ns w-100 ph3">
              <img src={ResellerImage} />
              <h1 className="f5">Reseller Dashboard</h1>
              <p className="mv0">Resell products from hundreds of </p>
              <p className="mv0">wholesalers to start your entrepreneurial</p>
              <p> journey.</p>
            </div>
            <div className="tc cf mh1-l w-25-ns w-100 ph3">
              <img src={RecruitmentImage} />
              <h1 className="f5">Recruitment</h1>
              <p className="mv0">Find partners for a start-up, even if they</p>
              <p >are not in itscurrent network.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pv5-ns">
        <h1 className="f1-l f2-m f3 lh-title tc mb6-ns">Why TiGrow?</h1>
        <div className="ph5-l ph4-m relative w-100 cover"
          style={{ fontFamily: 'Josefin Sans, sans-serif', backgroundImage: `url(${BgHalfTriangle1})`, backgroundRepeat: 'no-repeat' }}
        >
          <div className="ph4-l ph4 flex-ns items-center">
            <img className="w-70-l w-50-m w-100" src={homepic1} ></img>
            <p className="pl5-l pl4-m mv4 mv0-ns lh-copy tj w-100 w-50-m f3-ns f4" style={{ fontStyle: 'italic', lineHeight: '45px' }}>For aspiring professionals, TiGrow gives the opportunity toexpress their willingness if they want to be a part of the booming startup community all over the world, It will help to find partners for a startup, even if they are not in its current network.</p>
          </div>
        </div>
      </div>

      <div className="ph5-l ph4-m relative w-100 pb6-ns cover"
        style={{ fontFamily: 'Josefin Sans, sans-serif', backgroundImage: `url(${BgHalfTriangle2})`, backgroundRepeat: 'no-repeat' }}
      >
        <div className="flex-ns flex-row-reverse-ns items-center ph4-l ph4">
          <img className="w-70-l w-50-m w-100" src={homepic2} ></img>
          <p className="pr5-l pr4-m mv4 mv0-ns lh-copy tj w-100 w-50-m f3-ns f4" style={{ fontStyle: 'italic', lineHeight: '45px' }}>For aspiring professionals, TiGrow gives the opportunity toexpress their willingness if they want to be a part of the booming startup community all over the world, It will help to find partners for a startup, even if they are not in its current network.</p>
        </div>
      </div>

      <div className="cf flex-ns pv6-l pv5-m pv5" style={{ backgroundColor: '#060517' }}>
        <div className="w-100 w-50-ns dt">
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
          <div className="w-75-ns">
            <div className="ph4">
              <h1 className="f5 white">Address</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
            <div className="ph4">
              <h1 className="f5 white">Contact Information</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fl w-100 pv2-ns" style={{ backgroundColor: '#060517' }}>
        <p className="mv3 tc b white f4">
          Powered by TiGrow Ltd.
        </p>
      </div>
    </div>
  )
}