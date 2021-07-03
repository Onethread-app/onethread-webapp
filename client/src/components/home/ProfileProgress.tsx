import React from 'react';

import { ChartDonutUtilization } from '@patternfly/react-charts';

import '@patternfly/react-core/dist/styles/base.css';

import More from 'resources/svg/More.svg';
import Lines from 'resources/svg/Lines.svg';
// import Progress from 'resources/svg/Progress.svg';

const ProfileProgress = () => {
  // const styles = {data: {stroke: "black"}, label: {fontSize: 10}}}
  return (
    <div className="profile-progress">
      <div className="flex justify-between w-100">
        <div>
          <h3>Progress</h3>
        </div>
        <div>
          <img src={More} alt="more" className="pointer" />
        </div>
      </div>
      <div className="flex items-center">
        <div style={{ height: '152px', width: '152px' }}>
          <ChartDonutUtilization
            ariaDesc="User progress"
            ariaTitle="User progress"
            constrainToVisibleArea={true}
            data={{ x: 'Completed', y: 75 }}
            labels={({ datum }) =>
              datum.x ? `${datum.x}: ${datum.y}%` : null
            }
            subTitle="in progress"
            title="75%"
            // style={title: {color: "#fff"}}
          />
        </div>
      </div>
      <div className="divider w-100"></div>
      <div className="flex justify-between items-end w-100 previous-progress">
        <div>
          <h3>20%</h3>
          <p>Last Week</p>
        </div>
        <div>
          <img src={Lines} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
