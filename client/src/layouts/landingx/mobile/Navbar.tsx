import React from 'react';
import { NavLink } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import { useSpring, animated } from 'react-spring';

import Logo from 'resources/images/onethread-logo-main.png';
import TextLogo from 'resources/images/onethread-text.png';
import { ReactComponent as Hamburger } from 'resources/navigation-menu.svg';

const Menu = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
  });

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
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">SignUp</NavLink>
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
      <div className="logos flex items-center">
        <img src={Logo} alt="Onethread" className="main-logo mr1" />
        <img src={TextLogo} alt="Onethread" className="text-logo" />
      </div>
      <Hamburger
        className="hamburger-menu content-end"
        onClick={handleClick}
      />
      {open && <Menu open={open} setOpen={setOpen} />}
    </div>
  );
};

export default MobileNavbar;
