import Toaster from './Types';

function getInitialToastData() {
  return JSON.parse(
    JSON.stringify({ isEnabled: false, type: '', message: '' }),
  );
}

const initialState = {
  toast: getInitialToastData(),
};
export default function toasterReducer(state = initialState, action) {
  switch (action.type) {
    case Toaster.TOAST.SUCCESS:
      return {
        ...state,
        toast: {
          isEnabled: true,
          type: Toaster.TOAST.SUCCESS,
          message: action.result,
        },
      };
    case Toaster.TOAST.FAILURE:
      return {
        ...state,
        toast: {
          isEnabled: true,
          type: Toaster.TOAST.FAILURE,
          message: action.result,
        },
      };
    case Toaster.TOAST.RESET:
      return {
        ...state,
        toast: getInitialToastData(),
      };
    default:
      return state;
  }
}
