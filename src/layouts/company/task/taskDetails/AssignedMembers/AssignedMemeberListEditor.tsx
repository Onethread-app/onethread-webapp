import React, { useState } from 'react';
import { Button, Popover, Icon } from '@blueprintjs/core';
import { deleteMember } from 'stores/taskMembers/Action';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ITaskMember } from 'stores/taskMembers/Reducer';

interface IAssignedMemeberListEditorComponentProps {
	assignMemberId: ITaskMember['_id'];
	deleteMember: (assignMemberId: ITaskMember['_id']) => void;
}

export const AssignedMemeberListEditorComponent = (props: IAssignedMemeberListEditorComponentProps
	 & RouteComponentProps ) => {

	const [deletePopover, setDeletePopover] = useState(false);
	return (
		<Popover
			isOpen={deletePopover}
			content={
				<div className="pa3 cf bg-white" style={{ width: '350px' }}>
                  <h1 className="f5">Delete</h1>
					<p>Are you sure want to permanently remove </p>
					<div className="flex justify-end mt4">
						<Button
							className="grow h2 pointer white bp3-minimal w4 mr3"
							style={{
								background: '#fff',
								outline: 'none',
								border: '1px solid #0fa3a3',
								color: '#0fa3a3'
							}}
							onClick={() => setDeletePopover(false)}
						>
							Cancel
									</Button>
						<Button
							className="grow h2 pointer white bp3-minimal w4"
							style={{
								background: '#0fa3a3',
								outline: 'none',
								color: 'white'
							}}
							type="submit"
							onClick={async () => {
							await props.deleteMember(props.assignMemberId);
							setDeletePopover(false);
							}}
						>
							Remove
									</Button>
					</div>
				</div>

			}
			target={
				<Icon
					icon="trash"
					onClick={() => setDeletePopover(true)}
				/>
			}
		/>
	);
};
  
export const AssignedMemeberListEditor = connect(null, 
	{ deleteMember })(withRouter(AssignedMemeberListEditorComponent));
