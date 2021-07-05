import axios from 'axios';
import Switch from 'components/Switch/Switch';
import React, { useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import DarkLogo from 'resources/images/onethread-logo-dark.png';

const Navbar = () => {
  const { i18n } = useTranslation();
  const [isToggle,  setIsToggle] = useState(false);
 
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const getCountry = async ()=>{
    const data = await axios.get("https://extreme-ip-lookup.com/json/")
    return data;
  };
  getCountry().then(data=>{
    const country = data.data.country;
    if(country === 'Bangladesh'){
      changeLanguage('bn');
      setIsToggle(true)
    }
    else{
      changeLanguage('en');
      setIsToggle(false)
    }
  })
  },[]);

  const handleToggle = (value:boolean)=>{
    if(value === true){
      changeLanguage('bn');
    }
    if(value === false){
      changeLanguage('en');
    }
    setIsToggle(!isToggle)
  };
  

return (
    <div className="navbar flex justify-between items-center">
      <ul className="flex">
        <NavLink to="/">
          <img src={DarkLogo} alt="Onethread" />
        </NavLink>
        <li>
          <a
            href="https://www.youtube.com/channel/UCuZZreI7e9VFYS1svTww6GA"
            target="_blank"
          >
            How It Works
          </a>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
      </ul>
      <ul className="flex">
        <li>
          <Switch isToggle={isToggle} onToggle={()=>handleToggle(!isToggle)}/>
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
