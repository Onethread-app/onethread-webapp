import React, { useState } from 'react'
import { RoomList } from './RoomList'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, Dialog } from '@blueprintjs/core';
import { CreateForm } from './CreateForm';
import { permit } from 'stores/UtilsActions';

interface RoomSideBarComponentProps {
  companyRole?: string;
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
          {props.companyRole && permit(props.companyRole) ?
            <div className="w-50 tr">
              <Button
                onClick={() => setShowDialog(!showDialog)}
                className="mv2 bp3-button bp3-button bp3-intent-primary" icon='add'>
              </Button>
            </div>
            : undefined}
        </div>
        <RoomList />
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <CreateForm setShowDialog={setShowDialog} />
        </Dialog>
      )}</>
  )
}

const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
  }
}

export const RoomSideBar = connect(
  mapStateToProps,
  null
)(withRouter(RoomSideBarComponent));