import React, { useState } from 'react';

import './InputTooltip.scss';

const InputTooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      style={{
        position: 'absolute',
        width: '30px',
        left: '-20px',
        top: '0px',
      }}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || 'top'}`}>
          {/* Content */}
          <div style={{ fontSize: '15px', paddingBottom: '10px' }}>
            {props.content}
          </div>
          {props.validations.rules.map((validation, key) => (
            <li key={key}>{validation}</li>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputTooltip;
