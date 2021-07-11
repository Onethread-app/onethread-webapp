import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import { useSpring, animated } from 'react-spring';
import DarkLogo from 'resources/images/onethread-logo-dark.png';
import { ReactComponent as Hamburger } from 'resources/navigation-menu.svg';
import Switch from '../../../components/Switch/Switch';
import { useTranslation } from 'react-i18next';
import { getLocation } from 'helpers/utils';

const Menu = ({ setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
  });

  const { i18n } = useTranslation();
  const [isToggle, setIsToggle] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    getLocation().then((data) => {
      const country = data.data.country;

      localStorage.setItem('city', data.data.city);
      localStorage.setItem('country', country);

      if (country === 'Bangladesh') {
        changeLanguage('bn');
        setIsToggle(true);
      } else {
        changeLanguage('en');
        setIsToggle(false);
      }
    });
  }, []);

  const handleToggle = (value: boolean) => {
    if (value === true) {
      changeLanguage('bn');
    }
    if (value === false) {
      changeLanguage('en');
    }
    setIsToggle(!isToggle);
  };

  const { t } = useTranslation();

  return (
    <animated.div style={props} className="overlay-menu">
      <div className="flex flex-column">
        <span
          className="cross-menu justify-end"
          onClick={handleClose}
        >
          <CloseIcon />
        </span>
        <ul className="flex flex-column items-center justify-center w-100 h-100">
          <li>
            <Switch
              isToggle={isToggle}
              onToggle={() => handleToggle(!isToggle)}
            />
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UCuZZreI7e9VFYS1svTww6GA"
              target="_blank"
              rel="noreferrer"
            >
              {t('app.Navbar.How-It-Works')}
              {/* How It Works */}
            </a>
          </li>
          <li>
            <NavLink to="/pricing">{t('app.Navbar.Pricing')}</NavLink>
            {/* <NavLink to="/pricing">Pricing</NavLink> */}
          </li>
          <li>
            <a
              href="https://blog.onethread.app/"
              rel="noreferrer"
            >
              {t('app.Navbar.Blog')}
              {/* Blog */}
            </a>
          </li>
          <li>
            <NavLink to="/signin">{t('app.Navbar.Login')}</NavLink>
            {/* <NavLink to="/signin">Login</NavLink> */}
          </li>
          <li>
            <NavLink to="/signup" className="b">
              {t('app.Navbar.SignUp')}
              {/* SignUp */}
            </NavLink>
          </li>
        </ul>
      </div>
    </animated.div>
  );
};

const MobileNavbar = () => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  return (
    <div className="navbar flex items-center justify-between w-100">
      <NavLink to="/">
        <img src={DarkLogo} alt="Onethread" />
      </NavLink>
      <Hamburger
        className="hamburger-menu content-end"
        onClick={handleClick}
      />
      {open && <Menu setOpen={setOpen} />}
    </div>
  );
};

export default MobileNavbar;
