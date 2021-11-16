import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addTrackedTime } from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { StopButton, StyledWatch } from './Timer.styles';
import PauseIcon from '@material-ui/icons/Pause';

const NewTimerWatch = () => {
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
    <div
      className="w-100 h-auto white flex justify-end items-center"
      style={{ backgroundColor: '#08A0F7' }}
    >
      <StyledWatch>
        <span className="mr2">Timer on:</span>
        <span>
          {time > 360000
            ? ('0' + Math.floor((time / 3600000) % 60)).slice(-2) +
              'h'
            : ''}{' '}
        </span>
        <span>
          {('0' + Math.floor((time / 60000) % 60)).slice(-2)}m{' '}
        </span>
        <span>
          {('0' + Math.floor((time / 1000) % 60)).slice(-2)}s
        </span>
      </StyledWatch>
      <StopButton onClick={handleStop}>
        <PauseIcon />
        Stop
      </StopButton>
    </div>
  );
};

export default NewTimerWatch;
