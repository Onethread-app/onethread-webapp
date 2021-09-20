import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import StopIcon from '@material-ui/icons/Stop';

import { addTrackedTime } from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { StyledTimer, StyledWatch } from './Timer.styles';

const TimerWatch = () => {
  const currentlyTracking: ICurrentTrack = useSelector(
    (state: any) => state.timeTrackerReducer.currentlyTracking,
  );
  const [time, setTime] = useState(currentlyTracking.duration);
  const dispatch = useDispatch();

  useEffect(() => {
    setTime(currentlyTracking.duration);
  }, [currentlyTracking.duration]);

  const handleStop = () => {
    dispatch(addTrackedTime(currentlyTracking));
  };

  return (
    <StyledTimer>
      <StopIcon
        className="pointer"
        color="error"
        fontSize="small"
        onClick={handleStop}
      />
      <StyledWatch>
        <span>
          {('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:
        </span>
        <span>
          {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span>
          {('0' + Math.floor((time / 1000) % 60)).slice(-2)}
        </span>
      </StyledWatch>
    </StyledTimer>
  );
};

export default TimerWatch;
