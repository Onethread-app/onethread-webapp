import TimeTrackerTypes from './Types';

export interface ICurrentTrack {
  name: string;
  task: string;
  subtask?: string;
  column: string;
  project: string;
  company: string;
  start_time: Date | null;
  duration: number;
}

export interface ITrack {
  _id: string;
  start_time: Date;
  duration: number;
  task: {
    _id: string;
    name: string;
    boardId: {
      _id: string;
    };
  };
  subtask?: {
    _id: string;
    name: string;
  };
  column: {
    _id: string;
    name: string;
  };
  project: {
    _id: string;
    name: string;
  };
  company: {
    _id: string;
    name: string;
    uniqueName: string;
  };
  account: {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
}

export interface ITimeTracker {
  trackedList: ITrack[];
  currentlyTracking: ICurrentTrack;
  trackListForCurrentTask: ITrack[];
  addingTrack: boolean;
  errorOnAddingTrack: string;
  gettingTrackList: boolean;
  errorOnGettingTrackList: string;
}

const InitialState: ITimeTracker = {
  trackedList: [],
  currentlyTracking: {
    name: '',
    task: '',
    subtask: '',
    column: '',
    project: '',
    company: '',
    start_time: null,
    duration: 0,
  },
  trackListForCurrentTask: [],
  addingTrack: false,
  errorOnAddingTrack: '',
  gettingTrackList: false,
  errorOnGettingTrackList: '',
};

export const TimeTrackerReducer = (
  state = InitialState,
  action: any,
) => {
  switch (action.type) {
    case TimeTrackerTypes.ADD_ITEM_TO_TRACK:
      return {
        ...state,
        currentlyTracking: action.payload,
      };
    case TimeTrackerTypes.UPDATE_DURATION_PER_SECOND:
      return {
        ...state,
        currentlyTracking: {
          ...state.currentlyTracking,
          duration: action.payload,
        },
      };
    case TimeTrackerTypes.ADD_TRACKED_TIME_START:
      return {
        ...state,
        currentlyTracking: {
          name: '',
          task: '',
          subtask: '',
          column: '',
          project: '',
          company: '',
          duration: 0,
          start_time: null,
        },
        addingTrack: true,
        errorOnAddingTrack: '',
      };
    case TimeTrackerTypes.ADD_TRACKED_TIME_SUCCESS:
      return {
        ...state,
        addingTrack: false,
      };
    case TimeTrackerTypes.ADD_TRACKED_TIME_FAILURE:
      return {
        ...state,
        errorOnAddingTrack: action.payload,
        addingTrack: false,
      };
    case TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_START:
      return {
        ...state,
        gettingTrackList: true,
        errorOnGettingTrackList: '',
      };
    case TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_SUCCESS:
      return {
        ...state,
        trackListForCurrentTask: action.payload,
        gettingTrackList: false,
      };
    case TimeTrackerTypes.GET_TRACKED_TIME_LIST_FOR_TASK_FAILURE:
      return {
        ...state,
        errorOnGettingTrackList: action.payload,
        gettingTrackList: false,
      };
    default:
      return state;
  }
};
