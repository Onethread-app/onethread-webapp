import React, { useState } from 'react'
import { RoomList } from './RoomList'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button } from '@blueprintjs/core'

interface SideBarLeftProps {
  isOpen: boolean
}

interface SideBarLeftInternalProps extends SideBarLeftProps, RouteComponentProps {
  chatkit?: Object;
}

const SideBarLeftComponent = (props: SideBarLeftInternalProps) => {
  const [rooms] = useState([{
    id: "1",
    roomImg: "https://robohash.org/" + 1,
    roomTitle: "Back-End"
  }, {
    id: "2",
    roomImg: "https://robohash.org/" + 2,
    roomTitle: "Front-End"
  }, {
    id: "3",
    roomImg: "https://robohash.org/" + 3,
    roomTitle: "UX/UI"
  }, {
    id: "4",
    roomImg: "https://robohash.org/" + 4,
    roomTitle: "SQA"
  }]);
  return (
    <div className={`ph3 mt5 z-1 ${props.isOpen ? '' : 'dn'}`}>
      <div className="flex">
        <div className="w-50 tl"><h3 className="tigrow-lightGray-1">Rooms</h3></div>
        <div className="w-50 tr">
          <Button
            className="mv2 bp3-button bp3-button bp3-intent-primary" icon='add'>
          </Button>
        </div>
      </div>
      <RoomList rooms={rooms} />
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    chatkit: state.chatkitReducer
  };
};

export const SideBarLeft = connect(
  mapStateToProps,
  null
)(withRouter(SideBarLeftComponent));