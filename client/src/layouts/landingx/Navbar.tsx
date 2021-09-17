import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DarkLogo from 'resources/images/onethread-logo-dark.png';

import { getLocation } from 'helpers/utils';
import Switch from 'components/Switch/Switch';

const Navbar = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [isToggle, setIsToggle] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleToggle = (value: boolean) => {
    if (value === true) {
      changeLanguage('bn');
    }
    if (value === false) {
      changeLanguage('en');
    }
    setIsToggle(!isToggle);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="navbar flex justify-between items-center">
      <ul className="flex">
        <NavLink to="/">
          <img src={DarkLogo} alt="Onethread" />
        </NavLink>
        <ul className="flex navbar-ml">
          <li>
            <a
              href="https://www.youtube.com/channel/UCuZZreI7e9VFYS1svTww6GA"
              target="_blank"
              rel="noreferrer"
            >
              {t('app.Navbar.How-It-Works')}
            </a>
          </li>
          <li>
            <NavLink to="/pricing">{t('app.Navbar.Pricing')}</NavLink>
          </li>
          <li>
            <a href="https://blog.onethread.app/" rel="noreferrer">
              {t('app.Navbar.Blog')}
            </a>
          </li>
        </ul>
      </ul>
      <ul className="flex">
        <li>
          <Switch
            isToggle={isToggle}
            onToggle={() => handleToggle(!isToggle)}
          />
        </li>
        <li>
          <NavLink to="/signin">{t('app.Navbar.Login')}</NavLink>
        </li>
        <li>
          <NavLink to="/signup" className="b">
            {t('app.Navbar.SignUp')}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
