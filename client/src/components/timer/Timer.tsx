import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import useHover from 'helpers/hooks/useHover';
import { msToTime } from 'helpers/utils';

import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import StopIcon from '@material-ui/icons/Stop';

import { StyledTimer, StyledWatch } from './Timer.styles';

import {
  addItemToTrack,
  addTrackedTime,
} from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import { ITask } from 'stores/task/Reducer';

import TrackedListDialog from 'components/time-tracker/TrackedListDialog';

interface ITimerProps {
  task: ITask;
  companyId: string;
  projectId: string;
  list?: boolean;
}
interface ITimerInternalProps extends ITimerProps {
  currentlyTracking: ICurrentTrack;
  addingTrack: boolean;
  errorOnAddingTrack: string;
  addItemToTrack: (item: ICurrentTrack) => void;
  addTrackedTime: (payload: ICurrentTrack) => void;
}

const Timer = (props: ITimerInternalProps) => {
  const {
    task,
    companyId,
    projectId,
    currentlyTracking,
    addingTrack,
    errorOnAddingTrack,
    addItemToTrack,
    addTrackedTime,
  } = props;
  const [totalTime, setTotalTime] = useState(task.timeSpent ?? 0);
  const [time, setTime] = useState(
    currentlyTracking.task === task._id
      ? currentlyTracking.duration
      : 0,
  );
  const [timerOn, setTimerOn] = useState(
    currentlyTracking.task === task._id,
  );
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const timerHover = useHover(timerRef);

  useEffect(() => {
    if (task.timeSpent) setTotalTime(task.timeSpent);
  }, [task.timeSpent]);

  useEffect(() => {
    if (currentlyTracking.task === task._id) {
      setTime(currentlyTracking.duration);
    }
  }, [currentlyTracking.duration, task._id, currentlyTracking.task]);

  useEffect(() => {
    currentlyTracking.name === task.name
      ? setTimerOn(true)
      : setTimerOn(false);
  }, [currentlyTracking.name, task.name]);

  useEffect(() => {
    if (
      loading === true &&
      addingTrack === false &&
      errorOnAddingTrack === ''
    ) {
      handleAdd();
      setLoading(false);
    }
  }, [loading, addingTrack, errorOnAddingTrack]);

  const handleAdd = () => {
    setTimerOn(true);
    const payload = {
      name: task.name,
      task: task._id,
      column: task.status._id, // need to change
      project: projectId,
      company: companyId,
      startTime: new Date(),
      duration: 0,
    };
    addItemToTrack(payload);
  };

  const handleStart = (e: any) => {
    if (!!props.list) {
      e.stopPropagation();
    }
    if (currentlyTracking.task) {
      addTrackedTime(currentlyTracking);
      setLoading(true);
    } else handleAdd();
  };

  const handleStop = (e: any) => {
    e.stopPropagation();
    setTimerOn(false);
    addTrackedTime(currentlyTracking);
  };

  return (
    <StyledTimer
      ref={timerRef}
      className={`${!!props.list ? '' : 'pl3'}`}
      list={props.list ? 1 : 0}
    >
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
      {!!props.list ? null : (
        <TrackedListDialog timerHover={timerHover} />
      )}
    </StyledTimer>
  );
};

const mapStateToProps = (state: any) => ({
  currentlyTracking: state.timeTrackerReducer.currentlyTracking,
  addingTrack: state.timeTrackerReducer.addingTrack,
  errorOnAddingTrack: state.timeTrackerReducer.errorOnAddingTrack,
});

export default connect(mapStateToProps, {
  addItemToTrack,
  addTrackedTime,
})(Timer);
