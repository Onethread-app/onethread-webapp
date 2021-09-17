import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Popover from '@material-ui/core/Popover/Popover';

import { ITrack } from 'stores/time-tracker/Reducer';
import { getTaskTrackers } from 'stores/time-tracker/Action';
import useWindowSize from 'helpers/hooks/useWindowSize';
import { msToTime } from 'helpers/utils';

import TrackItem from './TrackItem';

import {
  TrackedListDialogContainer,
  TrackItemListContainer,
} from './TrackedListDialog.styles';

interface ITrackedListDialog {
  timerHover: boolean;
  trackList: ITrack[];
  taskTimeSpent: number;
  gettingList: boolean;
  getTaskTrackers: () => void;
}

const TrackedListDialog = (props: ITrackedListDialog) => {
  const windowSize = useWindowSize();
  const {
    timerHover,
    trackList,
    taskTimeSpent,
    getTaskTrackers,
    gettingList,
  } = props;
  const [loading, setLoading] = useState(false);
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'tracked-list' : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getTaskTrackers();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading === true && gettingList === false) {
      setLoading(false);
    }
  }, [gettingList, loading, trackList]);

  return (
    <div className="self-end">
      <ArrowDropDownIcon
        aria-describedby={id}
        onClick={handleClick}
        className={`${timerHover ? 'o-100' : 'o-0'} pointer`}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <TrackedListDialogContainer
          height={windowSize.height}
          width={windowSize.width}
        >
          <h3>Total time spent: {msToTime(taskTimeSpent)}</h3>
          <h4 className="pt2">Previously Tracked</h4>
          <TrackItemListContainer
            height={windowSize.height}
            width={windowSize.width}
          >
            {trackList.length > 0 ? (
              trackList.map((track) => (
                <TrackItem item={track} key={track._id} />
              ))
            ) : (
              <h4>This task has not been tracked before.</h4>
            )}
          </TrackItemListContainer>
        </TrackedListDialogContainer>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  trackList: state.timeTrackerReducer.trackListForCurrentTask,
  taskTimeSpent:
    state.taskIndexReducer.taskReducer.currentTask.timeSpent,
  gettingList: state.timeTrackerReducer.gettingTrackList,
});

export default connect(mapStateToProps, { getTaskTrackers })(
  TrackedListDialog,
);
