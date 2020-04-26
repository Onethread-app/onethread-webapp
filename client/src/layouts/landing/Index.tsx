import React, { useState } from 'react';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { Navbar, Alignment } from '@blueprintjs/core';
import { EmailVerificationForm } from './EmailVerificationForm';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './styles.css';

import tigrowLogo from './../../resources/homepageImages/tigrowLogo.png';
import heroSection from './../../resources/homepageImages/heroSection.png';
import projects from './../../resources/homepageImages/projects.png';
import projectsMobile from './../../resources/homepageImages/projectsMobile.png';
import project from './../../resources/homepageImages/project.svg';
import chat from './../../resources/homepageImages/chat.svg';
import chatMobile from './../../resources/homepageImages/chatMobile.png';
import discussions from './../../resources/homepageImages/highlightedDiscussion.png';
import board from './../../resources/homepageImages/board.png';
import boards1 from './../../resources/homepageImages/boards1.png';
import boards2 from './../../resources/homepageImages/boards2.png';
import boards3 from './../../resources/homepageImages/boards3.png';
import customers from './../../resources/homepageImages/customers.png';
import customersMobile from './../../resources/homepageImages/customersMobile.png';
import pack1 from './../../resources/homepageImages/pack1.png';
import pack2 from './../../resources/homepageImages/pack2.png';
import pack3 from './../../resources/homepageImages/pack3.png';
import service from './../../resources/homepageImages/service.png';
import request from './../../resources/homepageImages/requestsMobile.png';
import meet from './../../resources/homepageImages/meet.png';
import offer1 from './../../resources/homepageImages/offertshirt.png';
import offer2 from './../../resources/homepageImages/offerbags.svg';
import offer3 from './../../resources/homepageImages/offerjackets.svg';
import offer4 from './../../resources/homepageImages/offerlining.svg';
import offer5 from './../../resources/homepageImages/offerdyes.svg';
import CustomChatbot from './autoChatWindow/customChat';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import { store } from 'Store';
import { saveContactForm } from '../../stores/landing/Actions';

// import contactImage from '../../resources/homepageImages/contact.png';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    // right: 'auto',
    bottom: 'auto',
    // marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    // backgroundColor: '#ececec',
  },
};

export const HomePage = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = () => {
    // console.log(name, email, message);
    if (name === '' || email === '' || message === '') {
      setError('Please fill all the information');
    } else {
      const reqBody = {
        name,
        email,
        message,
      };
      store.dispatch(saveContactForm(reqBody));
      setIsOpen(false);
    }
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getChatUserInfo = (name: String, email: String) => {
    if (name !== '' && email !== '') {
      const reqBody = {
        name,
        email,
        message: 'N/A',
      };
      store.dispatch(saveContactForm(reqBody));
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
      partialVisibilityGutter: 20,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  return (
    <div>
      <div>
        <Navbar className="ph5-ns shadow-0 fixed pv2 flex justify-between h-auto">
          <Navbar.Group align={Alignment.LEFT}>
            <img
              src={tigrowLogo}
              className="companyLogo"
              alt="Site Logo"
            />
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT} className="mt3-ns">
            <a href="/signin" className="tryLink">
              Try for free
            </a>
          </Navbar.Group>
        </Navbar>
      </div>
      <CustomChatbot getChatUserInfo={getChatUserInfo} />
      <div className="pl5-l pt6-ns pt5 pb4">
        <CustomView condition={!isMobileOnly}>
          <div className="flex-ns items-center pl5-ns">
            <div className="w-40-ns w-100 pl0-ns pl4 ">
              <div className="black primeText">
                An Enterprise Connectivity Platform
              </div>
              <div className="black secondaryText">where you can</div>
              <ul className="homeUl">
                <li className="featureTitle">
                  Manage Teams &amp; Projects on One Platform
                </li>
                <li className="featureTitle">
                  Create Alliances with Thousands of Small &amp;
                  Medium Enterprises
                </li>
              </ul>
              <div className="demoLink">
                <a href="#" className="tryLink">
                  See The Demo
                </a>
              </div>
              <ul className="homeUl light">
                <li className="featureTitle">
                  Full access to all features
                </li>
                <li className="featureTitle">
                  Zero obligation, no credit card needed
                </li>
                <li className="featureTitle">Add unlimited users</li>
                <li className="featureTitle">
                  Access to sales and technical support
                </li>
                <li className="featureTitle">
                  Test drive with 15-day free trial
                </li>
              </ul>
              <div className="demoLink" style={{ marginTop: '25px' }}>
                <a href="/signin" className="tryLink">
                  Try for free
                </a>
              </div>
            </div>
            <div className="w-60-ns w-100 tr">
              <img src={heroSection} alt="hero Section" />
            </div>
          </div>
        </CustomView>
        <MobileOnlyView>
          <div className="flex items-center pl5-ns ph2">
            <div className="w-40-ns w-100 ph1">
              <div className="black primeText">
                An Enterprise Connectivity Platform
              </div>
            </div>
            <div className="w-60-ns w-100 tr">
              <img src={heroSection} alt="hero Section" />
            </div>
          </div>
          <div className="flex items-center center">
            <div className="w-100">
              <div className="black secondaryText tc">
                where you can
              </div>
              <ul className="homeUl flex ph4 items-center">
                <li className="featureTitle">
                  Manage Teams &amp; Projects on One Platform
                </li>
                <li className="featureTitle">
                  Create Alliances with Thousands of Small &amp;
                  Medium Enterprises
                </li>
              </ul>
              <div className="demoLink flex items-center">
                <a href="#" className="tryLink">
                  See The Demo
                </a>
              </div>
              <ul className="homeUl light">
                <li className="featureTitle">
                  Full access to all features
                </li>
                <li className="featureTitle">
                  Zero obligation, no credit card needed
                </li>
                <li className="featureTitle">Add unlimited users</li>
                <li className="featureTitle">
                  Access to sales and technical support
                </li>
                <li className="featureTitle">
                  Test drive with 15-day free trial
                </li>
              </ul>
              <div
                className="demoLink flex items-cemter"
                style={{ marginTop: '25px' }}
              >
                <a href="/signin" className="tryLink">
                  Try for free
                </a>
              </div>
            </div>
          </div>
        </MobileOnlyView>
      </div>
      <div className="w-70-ns w-80 center pv5-ns tc titleText">
        Use TiGrow Workplace For Remote Working With Teams, For Vendor
        Management &amp; <br /> To Collaborate With All Of Your
        Stakeholders At One Place.
      </div>
      <div className="flex-ns items-center pl4-ns pl4 ph2 pv4-ns">
        <div className="pl5-ns w-60-ns h-100-ns w-100 h-100">
          <img src={isMobileOnly ? projectsMobile : projects} />
        </div>
        <div className="pr5-ns w-40-ns h-100-ns w-70 h-100 mt3 mt0-ns center">
          <div className="titleText tc" style={{ fontWeight: 200 }}>
            <span>
              <span style={{ color: '#588F8F', fontWeight: 'bold' }}>
                Introducing Projects
                <br />
              </span>
              Create Projects With{' '}
              <span className="silver" style={{ fontWeight: 'bold' }}>
                Single
                <br />
              </span>
              <span className="silver" style={{ fontWeight: 'bold' }}>
                Department, Multiple Departments
              </span>{' '}
              or
              <br />
              With{' '}
              <span className="silver" style={{ fontWeight: 'bold' }}>
                External Stakeholders of the <br />
                Company
              </span>
            </span>
          </div>
        </div>
      </div>
      <div
        className="flex-ns items-center pl4-l ph4-ns pv4-ns"
        style={{ justifyContent: 'space-around' }}
      >
        <div className="pl5-ns w-20-ns h-100-ns w-100 h-100 tc">
          <img src={project} alt="" />
        </div>
        <div className="pr5-ns pl4-ns w-80-ns h-100-ns w-100 h-100">
          <CustomView condition={!isMobileOnly}>
            <img src={chat} alt="" />
            <div className="titleText tc pv4">
              <span className="black-50">
                <span style={{ color: '#588F8F' }}>
                  Chat from anywhere through Rooms
                </span>
                <br />
                Share your opinion, and your personality. Highlight
                Important <br />
                Discussion in a group chat or in one-to-one messages.
              </span>
            </div>
            <img src={board} alt="" />
          </CustomView>
          <MobileOnlyView>
            <div className="flex mt3">
              <div className="titleText tc w-50 ph2 pv2 mh3 chatIntro">
                <span className="silver">
                  <span style={{ color: '#588F8F' }}>
                    Chat from anywhere
                    <br /> through Rooms
                  </span>
                  <br />
                  Share Your Opinion,
                  <br />
                  And Your Personality.
                  <br />
                  Highlight Important <br /> Discussion In A Group
                  <br /> Chat Or In One-To-
                  <br />
                  One Messages.
                </span>
              </div>
              <div className="w-50">
                <img className="ph1" src={discussions} alt="" />
              </div>
            </div>
            <img src={chatMobile} alt="" />
            <div className="w-80 center ph2 tc titleText">
              <span className="silver">
                <span style={{ color: '#588F8F' }}>
                  Collaborate &amp; Manage Your Team from anywhere
                  through Boards{' '}
                </span>
                Monitor your team performance, employee kpi's in real
                time. Assign tasks, subtasks, deadlines; get updated
                if the tasks are done or not.
              </span>
            </div>
            <img src={boards1} className="mb3 ph3" alt="board" />
            <img src={boards2} className="mb3 ph3" alt="board" />
            <img src={boards3} className="mb3 ph3" alt="board" />
          </MobileOnlyView>
        </div>
      </div>
      <CustomView condition={!isMobileOnly}>
        <div className="w-70-ns w-100 center pv5-ns tc titleText">
          <span className="black-50">
            <span style={{ color: '#588F8F' }}>
              Collaborate &amp; Manage Your Team from anywhere through
              Boards
            </span>
            Monitor your team performance, employee kpi's in real
            time. Assign tasks, subtasks, deadlines; get updated if
            the tasks are done or not.
          </span>
        </div>
      </CustomView>
      <div
        className="flex-ns items-center pl4-l pl4 pv0-ns pv2 ph2"
        style={{ justifyContent: 'space-around' }}
      >
        <div className="pl5-ns w-50-ns h-100-ns w-100 h-100">
          <div className="titleText tc">
            <span className="silver">
              <span style={{ color: '#588F8F' }}>
                Meet from anywhere
              </span>
              <br />
              Use video conference with features <br /> like screen
              sharing. Teams of 10 or <br />
              10,000 can meet in one place, no <br /> matter how many
              places they’re in.
            </span>
          </div>
        </div>
        <div className="pr5-ns w-50-ns h-100-ns w-100 h-100">
          <img src={meet} className="pr4-ns pv5-ns" />
        </div>
      </div>
      <MobileOnlyView>
        <div className="w-90 center pv2 ph3 tc titleText">
          <span className="silver">
            <span style={{ color: '#588F8F', fontWeight: 'bold' }}>
              Tribe Feature To Create Alliances <br />
              with Thousands of Small &amp; Medium
              <br /> Enterprises.
              <br />
            </span>
            Then Start Working In Projects
            <br /> With Them in TiGrow Workplace.
            <br />
            Why Waste Time Switching
            <br />
            Between Multiple Platforms!!
          </span>
        </div>
      </MobileOnlyView>
      <div className="flex-ns items-center ph6-ns ph4 pv3-ns pv3">
        <div className="w-80-ns w-100 center">
          <img
            src={isMobileOnly ? request : service}
            alt="funtionality tabs"
          />
        </div>
      </div>
      <div className="pv3-ns pv3">
        <div className="w-80-ns w-100 center">
          <h1>Top Offers</h1>
          <div className="carousel">
            <Carousel
              arrows={true}
              responsive={responsive}
              centerMode={true}
              sliderClass="items-baseline"
              className="pb4"
              renderDotsOutside
              swipeable
              draggable
              infinite
            >
              <img className="w-100" src={offer1} alt="packages" />
              <img className="w-100" src={offer2} alt="packages" />
              <img className="w-100" src={offer3} alt="packages" />
              <img className="w-100" src={offer4} alt="packages" />
              <img className="w-100" src={offer5} alt="packages" />
            </Carousel>
          </div>
        </div>
      </div>
      <CustomView condition={!isMobileOnly}>
        <div className="w-80-ns w-100 center pv5 ph3-ns tc titleText">
          <span className="black-50">
            <span style={{ color: '#588F8F', fontWeight: 'bold' }}>
              Tribe Feature To Create Alliances with Thousands of
              Small &amp; Medium Enterprises.
            </span>
            <br />
            Then Start Working In Projects With Them in TiGrow
            Workplace. Why Waste Time Switching Between Multiple
            Platforms!!
          </span>
        </div>
      </CustomView>
      <div
        className="flex items-center pv5-ns pv4 ph2"
        style={{
          backgroundColor: 'rgba(215, 197, 255, 0.4)',
          flexDirection: 'column',
        }}
      >
        <div
          className="w-80-ns w-100 tc center mb4-ns mb0-ns secondaryText"
          style={{ fontWeight: 'bold', color: '#3E5578' }}
        >
          It's Completely Free for 15 Days, Let's Onboard
        </div>
        <a href="/signin" className="tryLink light mt2">
          Try for free
        </a>
      </div>
      <div className="flex-ns items-center ph6-ns pt5-ns pb0-ns pv3">
        <div className="w-80-ns w-100 center">
          <CustomView condition={!isMobileOnly}>
            <div className="flex-ns items-baseline w-100">
              <a href="/signup" className="w-30-ns center">
                <img className="w-100" src={pack1} alt="packages" />
              </a>
              <a href="/signup" className="w-30-ns center">
                <img className="w-100" src={pack2} alt="packages" />
              </a>
              <div
                onClick={openModal}
                id="contactForm"
                className="w-30-ns center"
              >
                <img className="w-100" src={pack3} alt="packages" />
              </div>
            </div>
          </CustomView>
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="TigrowModal"
            className="Modal"
            overlayClassName="Overlay"
          >
            <div className="flex ma5 mt3 mb4 justify-center flex-column">
              <label className="b blue center mt4 mb3 f3 lh-title">
                Contact Us
              </label>
              <div className="flex  justify-center flex-column">
                <div className="mb3">
                  <TextField
                    onChange={(e) => setName(e.target.value)}
                    fullWidth={true}
                    id="standard-basic"
                    label="Name"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className="mb4">
                  <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth={true}
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <label className="mb2">Message</label>
                <TextareaAutosize
                  onChange={(e) => setMessage(e.target.value)}
                  rowsMin={4}
                  aria-label="maximum height"
                  placeholder="Share your valuable thoughts"
                />
                {error && (
                  <label className="red ma2 f5-l">{error}</label>
                )}
                <div className="mt3 center">
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
          <MobileOnlyView>
            <div className="carousel">
              <Carousel
                additionalTransfrom={-window.innerWidth / 2}
                arrows={false}
                responsive={responsive}
                centerMode={true}
                showDots={true}
                sliderClass="items-baseline"
                className="pb4"
                renderDotsOutside
                swipeable
                draggable
                infinite
              >
                <a href="/signup" className="center">
                  <img className="w-100" src={pack1} alt="packages" />
                </a>
                <a href="/signup" className="center">
                  <img className="w-100" src={pack2} alt="packages" />
                </a>
                <a href="#footer" className="center">
                  <img className="w-100" src={pack3} alt="packages" />
                </a>
              </Carousel>
            </div>
          </MobileOnlyView>
        </div>
      </div>
      <div
        className="w-70 center pt4-ns tc titleText silver"
        style={{ color: 'gray', fontWeight: 900 }}
      >
        Trusted by over 1,000 customers world-wide
      </div>
      <div className="w-70 center pb4-ns">
        <img
          src={isMobileOnly ? customersMobile : customers}
          alt="customers"
        />
      </div>
      <div
        id="footer"
        className="pv4-ns pv2 tc"
        style={{ background: '#43466D' }}
      >
        <h1 className="primaryText white">Join Today</h1>
        <div className="dt center w-34-ns w-80 mb3">
          <EmailVerificationForm />
        </div>
        <div className="dt center w-34-ns w-80 mb5-ns mb3 footerText">
          Contact us at rubaiyat@tigrow.co for Enterprise Solution
        </div>
        <small className="white footerText">
          © {new Date().getFullYear()} TiGrow Inc. - House 208, Road
          12, Mohakhali DOHS, Dhaka, 1205, Bangladesh
        </small>
      </div>
    </div>
  );
};
