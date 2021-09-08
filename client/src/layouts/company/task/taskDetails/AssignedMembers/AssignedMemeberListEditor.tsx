import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ITaskMember } from 'stores/taskMembers/Reducer';
import { deleteMember } from 'stores/taskMembers/Action';

interface IAssignedMemeberListEditorComponentProps {
  assignMemberId: ITaskMember['_id'];
  deleteMember: (assignMemberId: ITaskMember['_id']) => void;
}

export const AssignedMemeberListEditorComponent = (
  props: IAssignedMemeberListEditorComponentProps &
    RouteComponentProps,
) => {
  const [deletePopover, setDeletePopover] = useState(false);
  return (
    <Popover
      isOpen={deletePopover}
      content={
        <div className="pa3 cf bg-white" style={{ width: '350px' }}>
          <h1 className="f5">Delete</h1>
          <p>Are you sure want to permanently delete </p>
          <div className="flex justify-end mt4">
            <Button
              className="grow h2 pointer white bp3-minimal w4 mr3"
              style={{
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }}
              type="submit"
              onClick={async () => {
                await props.deleteMember(props.assignMemberId);
                setDeletePopover(false);
              }}
            >
              Yes, Delete
            </Button>
            <Button
              className="grow h2 pointer white bp3-minimal w4"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #34b3e9',
                color: '#34b3e9',
              }}
              onClick={() => setDeletePopover(false)}
            >
              No, Keep
            </Button>
          </div>
        </div>
      }
      target={
        // <Icon
        //   className="pt3 pointer"
        //   icon="trash"
        //   onClick={() => setDeletePopover(true)}
        // />
        <Button
          style={{
            width: '100%',
            color: '#5A5A5A',
            border: '1px solid #B1B1B1',
            background: 'none',
          }}
          onClick={() => setDeletePopover(true)}
        >
          Remove
        </Button>
      }
    />
  );
};

export const AssignedMemeberListEditor = connect(null, {
  deleteMember,
})(withRouter(AssignedMemeberListEditorComponent));
