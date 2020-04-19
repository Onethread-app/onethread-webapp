import { SET_RIGHT_SIDEBAR, TOGGLE_RIGHT_SIDEBAR } from './Types';

export const setRightSidebar = (data: boolean) => async (
	dispatch: any,
	getState: any
) => {
	await dispatch({
		type: SET_RIGHT_SIDEBAR,
		payload: data
	});
};

export const toggleRightSidebar = () => async (
	dispatch: any,
	getState: any
) => {
	await dispatch({
		type: TOGGLE_RIGHT_SIDEBAR
	});
};