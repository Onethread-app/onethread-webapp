import TimeTrackerTypes from './Types';
import { ICurrentTrack } from './Reducer';

export const addItemToTrack = (item: ICurrentTrack) => ({
  type: TimeTrackerTypes.ADD_ITEM_TO_TRACK,
  payload: item,
});

export const addTrackedTime = (payload: ICurrentTrack) => ({
  type: TimeTrackerTypes.ADD_TRACKED_TIME_START,
  payload,
});

export const addTrackedTimeSuccess = (response: any) => ({
  type: TimeTrackerTypes.ADD_TRACKED_TIME_SUCCESS,
  payload: response,
});

export const addTrackedTimeFailure = (errorMessage: any) => ({
  type: TimeTrackerTypes.ADD_TRACKED_TIME_FAILURE,
  payload: errorMessage,
});

export const getTaskTrackers = () => ({
  type: TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_START,
});

export const getTaskTrackersSuccess = (response: any) => ({
  type: TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_SUCCESS,
  payload: response,
});

export const getTaskTrackersFailure = (errorMessage: any) => ({
  type: TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_FAILURE,
  payload: errorMessage,
});

export const updateDurationPersecond = (duration: number) => ({
  type: TimeTrackerTypes.UPDATE_DURATION_PER_SECOND,
  payload: duration,
});
