import React from 'react';
import './Switch.styles.scss';

const Switch = ({ isToggle, onToggle }) => {
  return (
    <div className="switch-container">
      <p>English</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={isToggle}
          onChange={onToggle}
        />
        <span className="slider" />
      </label>
      <p>বাংলা</p>
    </div>
  );
};

export default Switch;
