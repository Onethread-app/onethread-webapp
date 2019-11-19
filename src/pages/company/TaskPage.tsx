import React, { useState } from "react";
import { BoardListView } from 'components/company/board/ListView';
import { Button } from '@blueprintjs/core';
import { BoardDetailsView } from 'components/company/board/DetailsView';

export const TaskPage = () => {

	const [boardView, setBoardView] = useState(0);

	return (
		<div className="pa4 h-100">
			<div className="br3 bg-white h-100 pa4 cf flex flex-column">
				{boardView === 0 ?
					<BoardListView setBoardView={setBoardView} />
					:
					<div className="flex flex-column h-100">
						<div>
							<Button
								className="grow h2 pointer white bp3-minimal "
								style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
								text="Show all boards"
								onClick={() => setBoardView(0)}
							/>
						</div>
						<BoardDetailsView />
					</div>
				}
			</div>
		</div>
	);
};
