import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import useHover from 'helpers/hooks/useHover';
import { msToTime } from 'helpers/utils';

import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import StopIcon from '@material-ui/icons/Stop';

import { StyledTimer, StyledWatch } from './Timer.styles';

import {
  addItemToTrack,
  addTrackedTime,
  updateDurationPersecond,
} from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { ITask } from 'stores/board/Reducer';

import TrackedListDialog from 'components/time-tracker/TrackedListDialog';

interface ITimerProps {
  task?: ITask;
}
interface ITimerInternalProps extends ITimerProps {
  currentCompanyId: string;
  currentProjectId: string;
  currentlyTracking: ICurrentTrack;
  addingTrack: boolean;
  errorOnAddingTrack: string;
  addItemToTrack: (item: ICurrentTrack) => void;
  addTrackedTime: (payload: ICurrentTrack) => void;
  updateDurationPersecond: () => void;
}

const Timer = (props: ITimerInternalProps) => {
  const {
    task,
    currentCompanyId,
    currentProjectId,
    currentlyTracking,
    addingTrack,
    errorOnAddingTrack,
    addItemToTrack,
    addTrackedTime,
    updateDurationPersecond,
  } = props;
  const [totalTime, setTotalTime] = useState(task?.timeSpent ?? 0);
  const [time, setTime] = useState(
    currentlyTracking.task === task?._id
      ? currentlyTracking.duration
      : 0,
  );
  const [timerOn, setTimerOn] = useState(
    task?._id ? currentlyTracking.task === task?._id : false,
  );
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const timerHover = useHover(timerRef);

  useEffect(() => {
    if (task?.timeSpent) setTotalTime(task?.timeSpent);
  }, [task?.timeSpent]);

  useEffect(() => {
    let interval;

    if (timerOn) {
      interval = setInterval(() => {
        updateDurationPersecond();
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    currentlyTracking.task === task?._id &&
      setTime(currentlyTracking.duration);
  }, [currentlyTracking.duration, task?._id, currentlyTracking.task]);

  useEffect(() => {
    if (
      loading === true &&
      addingTrack === false &&
      errorOnAddingTrack === ''
    ) {
      handleAdd();
    }
  }, [loading, addingTrack, errorOnAddingTrack]);

  const handleAdd = () => {
    setTimerOn(true);
    const payload = {
      name: task!.name,
      task: task!._id,
      column: task!.columnId,
      project: currentProjectId,
      company: currentCompanyId,
      start_time: new Date(),
      duration: 0,
    };
    addItemToTrack(payload);
  };

  const handleStart = () => {
    if (!!currentlyTracking.task) {
      addTrackedTime(currentlyTracking);
      setLoading(true);
    } else handleAdd();
  };

  const handleStop = () => {
    setTimerOn(false);
    addTrackedTime(currentlyTracking);
  };

  return (
    <StyledTimer ref={timerRef} className="pl3">
      {timerOn === false ? (
        <PlayCircleFilledWhiteIcon
          className="pointer"
          htmlColor="#2EB67D"
          fontSize="small"
          onClick={handleStart}
        />
      ) : (
        <StopIcon
          className="pointer"
          color="error"
          fontSize="small"
          onClick={handleStop}
        />
      )}
      <StyledWatch>
        {timerOn ? <>{msToTime(time)}</> : <>{msToTime(totalTime)}</>}
      </StyledWatch>
      <TrackedListDialog timerHover={timerHover} />
    </StyledTimer>
  );
};

const mapStateToProps = (state: any) => ({
  currentProjectId: state.projectReducer.projectDetails._id,
  currentCompanyId: state.companyReducer.currentCompany._id,
  currentlyTracking: state.timeTrackerReducer.currentlyTracking,
  addingTrack: state.timeTrackerReducer.addingTrack,
  errorOnAddingTrack: state.timeTrackerReducer.errorOnAddingTrack,
});

export default connect(mapStateToProps, {
  addItemToTrack,
  addTrackedTime,
  updateDurationPersecond,
})(Timer);
