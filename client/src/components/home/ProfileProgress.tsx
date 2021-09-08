import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { tigrowApi } from 'config';

import { ChartDonutUtilization } from '@patternfly/react-charts';

import { tokenConfig } from 'stores/UtilsActions';

import '@patternfly/react-core/dist/styles/base.css';

const ProfileProgress = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const getprogress = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/daily-progress`,
          headers,
        );
        setProgress(response.data);
      }
    };
    getprogress();
  }, []);

  return (
    <div className="profile-progress">
      {isMobileOnly ? undefined : (
        <div className="flex justify-between w-100">
          <div>
            <h3>Progress</h3>
          </div>
        </div>
      )}
      <div className="profile-progress-chart flex items-center">
        <div style={{ height: '152px', width: '152px' }}>
          <ChartDonutUtilization
            ariaDesc="Daily user progress"
            ariaTitle="Daily progress"
            constrainToVisibleArea={true}
            data={{ x: 'Completed', y: progress }}
            labels={({ datum }) =>
              datum.x ? `${datum.x}: ${datum.y}%` : null
            }
            subTitle={progress === 100 ? 'completed' : 'in progress'}
            title={`${progress}%`}
            // style={title: {color: "#fff"}}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
