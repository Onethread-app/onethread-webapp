import { combineReducers } from 'redux';
import { UserReducer } from './user/Reducer';
import { CompanyReducer } from './company/Reducer';
import { RoomReducer } from './room/Reducer';
import { LayoutReducer } from './layout/Reducer';
import { BoardReducer } from './board/Reducer';

export const RootReducer = combineReducers({
	layoutReducer: LayoutReducer,
	roomReducer: RoomReducer,
	userReducer: UserReducer,
	companyReducer: CompanyReducer,
	boardReducer: BoardReducer
});
