import React from 'react';
import { Button } from '@blueprintjs/core';

interface IAssignedMemberDeleteProps {
  setDeletePopover: (val: boolean) => void;
}

export const AssignedMemeberListEditor = (props: IAssignedMemberDeleteProps) => {
  return (
    <div>
      <p>Are you sure want to permanently remove X from Y? </p>
      <div className="flex justify-end mt4">
							<Button
								className="grow h2 pointer white bp3-minimal w4 mr3"
								style={{
									background: '#fff',
									outline: 'none',
									border: '1px solid #0fa3a3',
									color: '#0fa3a3'
								}}
								onClick={() => props.setDeletePopover(false)}
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
								// loading={submitting}
                type="submit"
								onClick={() => props.setDeletePopover(false)}
								// disabled={submitting || pristine}
							>
								Remove
							</Button>
						</div>
    </div>
  );
};
