import React from 'react'
import { RoomList } from './RoomList'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button } from '@blueprintjs/core';

interface RoomSideBarComponentProps {
  isOpen: boolean;
  chatkit?: any;
}

const RoomSideBarComponent = (props: RoomSideBarComponentProps & RouteComponentProps) => {
  return (
    <div className={`mt5 t-25-a ${props.isOpen ? 'db' : 'dn'}`}>
      <div className="flex ph3">
        <div className="w-50 tl"><h3 className="tigrow-lightGray-1">Rooms</h3></div>
        <div className="w-50 tr">
          <Button
            className="mv2 bp3-button bp3-button bp3-intent-primary" icon='add'>
          </Button>
        </div>
      </div>
      <RoomList />
    </div>
  )
}

export const RoomSideBar = connect(
  null,
  null
)(withRouter(RoomSideBarComponent));