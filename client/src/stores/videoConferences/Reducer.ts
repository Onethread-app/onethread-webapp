import {
  GET_VIDEO_CONFERENCE_MAIN,
  GET_VIDEO_CONFERENCE_SUCCESS,
  GET_VIDEO_CONFERENCE_FAIL,
} from './Types';

const initialState = {
  loading: null,
  records: [],
};

export function videoConferencesReducers(
  state = initialState,
  action,
) {
  switch (action.type) {
    case GET_VIDEO_CONFERENCE_MAIN:
      return {
        ...state,
        loading: true,
        records: state.records,
      };

    case GET_VIDEO_CONFERENCE_SUCCESS:
      console.log('succes', action);

      return {
        ...state,
        loading: false,
        records: action.result.records,
      };

    case GET_VIDEO_CONFERENCE_FAIL:
      return {
        ...state,
        loading: null,
        records: [],
      };

    default:
      return state;
  }
}
