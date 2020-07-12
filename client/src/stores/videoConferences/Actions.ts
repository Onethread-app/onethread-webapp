import { GET_VIDEO_CONFERENCE_MAIN } from './Types';

export function getAllVideoConferencesReocords(body = {}) {
  return {
    type: GET_VIDEO_CONFERENCE_MAIN,
    body,
  };
}
