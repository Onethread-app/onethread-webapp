import React from 'react';
import { NavLink } from 'react-router-dom';
import DarkLogo from 'resources/images/onethread-logo-dark.png';

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center">
      <NavLink to="/">
        <img src={DarkLogo} alt="Onethread" />
      </NavLink>
      <ul className="flex">
        <li>
          <a
            href="https://www.youtube.com/channel/UCuZZreI7e9VFYS1svTww6GA"
            target="_blank"
          >
            How to use
          </a>
        </li>
        <li>
          <NavLink to="/signin">Login</NavLink>
        </li>
        <li>
          <NavLink to="/signup" className="b">
            SignUp
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
