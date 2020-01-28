import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { AssignedMemberListView } from './AssignedMemberListView';

export const AssignedMembersView = () => {
  const [showMemberlist, setShowMemberList] = useState(false);
  return (
    <>
      <div className="flex">
        <div className="pa1 dib">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br2 h2 w2 pointer" alt="avatar"
            onClick={() => setShowMemberList(true)}
          />
        </div>
        <div className="pa1 dib">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br2 h2 w2 pointer" alt="avatar"
            onClick={() => setShowMemberList(true)}
          />
        </div>
        <div className="pa1 dib">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br2 h2 w2 pointer" alt="avatar"
            onClick={() => setShowMemberList(true)}
          />
        </div>
        <div
          className="pa1 dib" >
          <p className="br2 h2 w2 pa2 pointer"
            onClick={() => setShowMemberList(true)}
          >
            +5
        </p>
        </div>
      </div>
      {showMemberlist && (
        <Dialog
          title="Members List"
          onClose={() => setShowMemberList(!showMemberlist)}
          isOpen={showMemberlist}
          style={{
            background: '#fff',
          }}
          className="pa3"
        >
          <AssignedMemberListView />
        </Dialog>
      )}
    </>
  );
};
