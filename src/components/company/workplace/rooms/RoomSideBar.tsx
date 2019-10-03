import React from 'react'
import { RoomList } from './RoomList'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from '@blueprintjs/core';

const RoomSideBarComponent = (props: any) => {
  return (
    <div className={`mt5 z-1 t-25-a o-100 ${props.isOpen ? '' : 'o-0'}`}>
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