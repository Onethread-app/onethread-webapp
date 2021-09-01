import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import StopIcon from '@material-ui/icons/Stop';

import {
  updateDurationPersecond,
  addTrackedTime,
} from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { StyledTimer, StyledWatch } from './Timer.styles';

const TimerWatch = () => {
  const currentlyTracking: ICurrentTrack = useSelector(
    (state: any) => state.timeTrackerReducer.currentlyTracking,
  );
  const [timerOn, setTimerOn] = useState(!!currentlyTracking.name);
  const [time, setTime] = useState(currentlyTracking.duration);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval;

    if (timerOn) {
      interval = setInterval(() => {
        dispatch(updateDurationPersecond());
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    setTime(currentlyTracking.duration);
  }, [currentlyTracking.duration]);

  const handleStop = () => {
    setTimerOn(false);
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
