import React from 'react';
import { NavLink } from 'react-router-dom';
import DarkLogo from 'resources/images/onethread-logo-dark.png';

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center">
      <img src={DarkLogo} alt="Onethread" />
      <ul className="flex">
        <li>
          <NavLink to="/">Pricing</NavLink>
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
