import { isEqual } from 'lodash';
import { tokenConfig } from '../UtilsActions';
import {
  GET_ROOM_ERROR,
  LOADING_ROOM,
  CLEAR_ROOMS_ERROR,
  CURRENT_ROOM,
  room,
} from './Types';
import { tigrowApi } from 'config';

export const createRoomAction = (roomData: any) => {
  return {
    type: room.CREATE_ROOM_LOAD,
    roomData,
  };
};

export const getRooms = () => {
  return {
    type: room.GET_ROOMS_LOAD,
  };
};

export const getRoom = (roomId: string) => async (
  dispatch: any,
  getState: any,
) => {
  try {
    const headers = tokenConfig();
    if ((headers as any).headers.Authorization) {
      dispatch({ type: LOADING_ROOM });
      const response = await tigrowApi.get(
        `rooms/${roomId}`,
        headers,
      );
      dispatch({ type: CURRENT_ROOM, payload: response.data.room });
      return response.status;
    } else {
      // tslint:disable-next-line: no-console
      console.log('error in room fetching');
    }
  } catch (error) {
    if (isEqual(error.message, 'Network Error')) {
      dispatch({ type: GET_ROOM_ERROR, payload: 'Network error' });
    } else if (error.response.status === 401) {
      dispatch({
        type: GET_ROOM_ERROR,
        payload: 'Unauthorized user',
      });
    } else {
      // tslint:disable-next-line: no-console
      console.log(error.response);
    }
    return error.response.status;
  }
};

export const getRoomMembers = (roomId: string) => {
  return {
    type: room.GET_ROOM_MEMBERS_LOAD,
    roomId,
  };
};

export const addRoomMembers = (
  data: {
    room: string;
    company: string;
    project: string;
    members: Array<{
      account: any;
      team: any;
    }>;
  },
  selectedRoomMember: any,
) => {
  return {
    type: room.ADD_MEMBER_IN_ROOM_LOAD,
    data,
    selectedRoomMember,
  };
};

export const clearRoomError = () => ({
  type: CLEAR_ROOMS_ERROR,
});

export const sendRoomMessage = (data: {
  text: string;
  room: string;
  files: any[];
  type?: string;
}) => {
  return {
    type: room.SEND_MESSAGE_LOAD,
    data,
  };
};

export const getRoomMessages = (
  roomId: string,
  limit: number = 15,
  skip: number = 0,
) => {
  return {
    type: room.GET_ROOM_MESSAGES_LOAD,
    roomId,
    limit,
    skip,
  };
};

export const fileUploadAction = (
  imageSelected: any,
  roomID: string,
) => {
  return {
    type: room.FILE_UPLOAD_LOAD,
    imageSelected,
    roomID,
  };
};

export const archiveRoom = (
  data: { archive: boolean },
  roomId: string,
) => {
  return {
    type: room.ARCHIVE_ROOM_LOAD,
    data,
    roomId,
  };
};

export const getRoomSharedFiles = (
  roomId: string,
  limit: number = 1000,
  skip: number = 0,
) => {
  return {
    type: room.GET_ROOM_SHARED_FILES_LOAD,
    roomId,
    limit,
    skip,
  };
};

// export const getRoomDiscussions = (
//   roomId: string,
//   limit: number = 1000,
//   skip: number = 0,
// ) => async (dispatch: any) => {
//   try {
//     const headers = tokenConfig();
//     if ((headers as any).headers.Authorization) {
//       const response = await tigrowApi.get(
//         `messages/room/${roomId}/discussion?limit=${limit}&skip=${skip}`,
//         headers,
//       );
//       // if (response.data.count < limit) {
//       // 	dispatch({ type: ALL_MESSAGE_RECEIVED, payload: true });
//       // }
//       dispatch({
//         type: GET_ROOM_DISCUSSIONS,
//         payload: response.data.discussion,
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log('error in rooms discussion fetching');
//     }
//   } catch (error) {
//     if (isEqual(error.message, 'Network Error')) {
//       dispatch({
//         type: GET_ROOM_DISCUSSIONS_ERROR,
//         payload: 'Network error',
//       });
//     } else {
//       // tslint:disable-next-line: no-console
//       console.log(error.response);
//     }
//   }
// };
export const getRoomDiscussions = (
  roomId: string,
  limit: number = 1000,
  skip: number = 0,
) => {
  return {
    type: room.GET_ROOM_DISCUSSIONS_LOAD,
    roomId,
    limit,
    skip,
  };
};

export const toggleDiscussionRoom = (
  data: { discussion: boolean },
  messageId: string,
) => {
  return {
    type: room.TOGGLE_ROOM_DISCUSSIONS_LOAD,
    data,
    messageId,
  };
};

export const updateLastSeen = (roomId: string) => {
  return {
    type: room.CLEAR_UNREAD_COUNT_FOR_SINGLE_ROOM_LOAD,
    roomId,
  };
};

export const fethcRooms = () => {
  return {
    type: room.FETCH_ROOMS_LOAD,
  };
};
