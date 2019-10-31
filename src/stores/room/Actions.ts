import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { tokenConfig } from '../UtilsActions';
import { CREATE_ROOM_FROM_SERVER, CREATE_ROOM_ERROR, GET_ROOMS_FROM_SERVER, GET_ROOM_ERROR, LOADING_ROOM, GET_SUGGESTIONS_ROOM_MEMBER, GET_SUGGESTIONS_ROOM_MEMBER_ERROR } from './Types';

export const createRoomAction = (roomData: any) => async (dispatch: any, getState: any) => {

  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      roomData.company = getState().companyReducer.currentCompany._id;
      dispatch({ type: LOADING_ROOM });
      const response = await tigrowApi.post(`/rooms`, roomData, headers);
      dispatch({ type: CREATE_ROOM_FROM_SERVER, payload: response.data.room });
    } else {
      console.log("error in creation of company")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: CREATE_ROOM_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: CREATE_ROOM_ERROR, payload: 'Unauthorized user.' });
    } else {
      console.log(error.response);
    }
  }
}


export const getRoomsAction = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      dispatch({ type: LOADING_ROOM });
      const response = await tigrowApi.get(`/rooms/${getState().companyReducer.currentCompany._id}`, headers);
      dispatch({ type: GET_ROOMS_FROM_SERVER, payload: response.data.rooms });
    } else {
      console.log("error in rooms fetching")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: GET_ROOM_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: GET_ROOM_ERROR, payload: 'Unauthorized user' });
    } else {
      console.log(error.response);
    }
  }
}
export const getSuggestionsForRoomMembers = () => async (dispatch: any, getState: any) => {
  try {
    const headers = tokenConfig(getState);
    if ((headers as any).headers.Authorization) {
      dispatch({ type: LOADING_ROOM });
      const response = await tigrowApi.get(`/rooms/members/${getState().roomReducer.roomId}/${getState().companyReducer.currentCompany._id}`, headers);
      console.log(response.data);
      return response.data;
      // dispatch({ type: GET_SUGGESTIONS_ROOM_MEMBER, payload: response.data.rooms });
    } else {
      console.log("error in rooms fetching")
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: GET_SUGGESTIONS_ROOM_MEMBER_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({ type: GET_SUGGESTIONS_ROOM_MEMBER_ERROR, payload: 'Unauthorized user' });
    } else {
      console.log(error.response);
    }
  }
}
