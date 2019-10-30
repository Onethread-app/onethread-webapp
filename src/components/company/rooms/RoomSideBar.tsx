import React, { useState } from 'react'
import { RoomList } from './RoomList'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, Dialog } from '@blueprintjs/core';
import { CreateForm } from './CreateForm';

interface RoomSideBarComponentProps {
  isOpen: boolean;
  chatkit?: any;
}

const RoomSideBarComponent = (props: RoomSideBarComponentProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className={`mt5 t-25-a ${props.isOpen ? 'db' : 'dn'}`}>
        <div className="flex ph3">
          <div className="w-50 tl"><h3 className="tigrow-lightGray-1">Rooms</h3></div>
          <div className="w-50 tr">
            <Button
              onClick={() => setShowDialog(!showDialog)}
              className="mv2 bp3-button bp3-button bp3-intent-primary" icon='add'>
            </Button>
          </div>
        </div>
        <RoomList />
      </div>
      {showDialog && (
        <Dialog
          icon="layout-auto"
          onClose={() => setShowDialog(!showDialog)}
          title="Create room"
          isOpen
          style={{ background: '#fff' }}
        >
          <CreateForm setShowDialog={setShowDialog} />
        </Dialog>
      )}</>
  )
}

export const RoomSideBar = connect(
  null,
  null
)(withRouter(RoomSideBarComponent));