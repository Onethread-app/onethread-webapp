import React, { useState } from 'react';
import { Icon, Popover } from '@blueprintjs/core';
import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';

// interface IAssignedMembersProps {
//   setShowMemberList: (val: boolean) => void;
// }
export const AssignedMemberListView = () => {
  const [deletePopover, setDeletePopover] = useState(false);
  return (
    <div className="pv2" style={{
      maxHeight: '550px',
      overflowY: 'auto',
    }}>
      <div className="flex">
        <img className="h3" src="https://robohash.org/VLSI" />
        <div className="flex w-100 justify-between pt4 bb pr3 ml3"
          style={{ borderBottom: '1px solid #EEEEEF' }}>
          <div>
            <p className="b ma0">Mithhu 1</p>
            <p className="ma0">added by xxyy</p>
          </div>
          {/* <div>
            <Icon icon="trash" />
          </div> */}
          <div>
            <Popover
              isOpen={deletePopover}
              content={
                <div className="pa3 cf bg-white" style={{ width: '350px' }}>
                  <h1 className="f5">Delete</h1>
                  <AssignedMemeberListEditor setDeletePopover={setDeletePopover} />
                  {/* <DueDateEditor setDatePopover={setDatePopover} /> */}
                </div>
              }
              target={
                <Icon
                  icon="trash"
                  onClick={() => setDeletePopover(true)}
                />
              }
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <img className="h3" src="https://robohash.org/VLSI" />
        <div className="flex w-100 justify-between pt4 bb pr3 ml3"
          style={{ borderBottom: '1px solid #EEEEEF' }}>
          <div>
            <p className="b ma0">Mithhu 1</p>
            <p className="ma0">added by xxyy</p>
          </div>
          <div>
            <Icon icon="trash" />
          </div>
        </div>
      </div>
      <div className="flex">
        <img className="h3" src="https://robohash.org/VLSI" />
        <div className="flex w-100 justify-between pt4 bb pr3 ml3"
          style={{ borderBottom: '1px solid #EEEEEF' }}>
          <div>
            <p className="b ma0">Mithhu 1</p>
            <p className="ma0">added by xxyy</p>
          </div>
          <div>
            <Icon icon="trash" />
          </div>
        </div>
      </div>
    </div>
  )
}
