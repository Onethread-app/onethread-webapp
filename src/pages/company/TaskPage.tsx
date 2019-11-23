import React from "react";
import { BoardListView } from 'components/company/board/ListView';

export const TaskPage = () => {

	return (
		<div className="pa4 h-100">
			<div className="br3 bg-white h-100 pa4 cf flex flex-column">
				<BoardListView />
			</div>
		</div>
	);
};
