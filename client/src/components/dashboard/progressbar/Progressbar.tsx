import { useState, useEffect } from 'react';

import './Progressbar.scss';

const Progressbar = ({ width, percent }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValue(percent * width);
    }, 500);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div className="progress-div" style={{ width: '100%' }}>
        <div
          style={{ width: `${value}%`, background: '#3484F0' }}
          className="progress"
        />
      </div>
    </div>
  );
};

export default Progressbar;
