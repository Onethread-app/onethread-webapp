import { SET_RIGHT_SIDEBAR, TOGGLE_RIGHT_SIDEBAR, CLEAR_LAYOUT_REDUCER_STATE } from './Types';

export interface ILayoutReducer {
	rightSidebar: { open: boolean };
}
const InitialState: ILayoutReducer = {
	rightSidebar: { open: false }
};

export const LayoutReducer = (state = InitialState, action: { type: string, payload: any }) => {
	switch (action.type) {
		case SET_RIGHT_SIDEBAR:
			return {
				...state,
				rightSidebar: { open: action.payload },
			};
		case TOGGLE_RIGHT_SIDEBAR:
			return {
				...state,
				rightSidebar: { open: !state.rightSidebar.open },
			};
		case CLEAR_LAYOUT_REDUCER_STATE:
			return {
				...InitialState
			};
		default:
			return state;
	}
};
