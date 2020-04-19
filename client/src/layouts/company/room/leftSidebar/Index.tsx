import React, { useState } from 'react';
import { RoomList } from './RoomList';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CreateForm } from './Form';
import { projectPermit } from 'stores/UtilsActions';
import { clearRoomError } from 'stores/room/Actions';
import { RightSidebar } from 'components/RightSidebar';
import { InputGroupField } from 'components/fields/InputGroupField';

import createIcon from './../../../../resources/images/create.svg';
import searchIcon from './../../../../resources/images/search.svg';

interface RoomSideBarComponentProps {
  companyRole?: string;
  isOpen: boolean;
}
interface RoomSideBarInternalProps
  extends RoomSideBarComponentProps,
    RouteComponentProps {
  clearRoomError: () => void;
}
const RoomSideBarComponent = (props: RoomSideBarInternalProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <>
      <div
        className={`flex flex-column h-100 t-25-a pt4 ${
          props.isOpen ? 'db' : 'dn overflow-hidden'
        }`}
      >
        <div className="flex justify-between items-center ph3">
          <h3 className="tigrow-darkGray">Rooms</h3>
          {props.companyRole && projectPermit(props.companyRole) ? (
            <span
              className="bp3-icon grow pointer"
              onClick={() => setShowDialog(!showDialog)}
            >
              <img
                src={createIcon}
                width="30px"
                height="30px"
                color="#0FA3A3"
              />
            </span>
          ) : undefined}
        </div>
        <div className="flex items-center ph3 relative">
          <InputGroupField
            id="companyName"
            value={searchKeyword}
            placeHolder="Search for Rooms"
            className="pv1 ba b--light-silver br3"
            style={{
              paddingLeft: '36px',
              boxShadow: 'none',
            }}
            onChange={(event: any) => {
              setSearchKeyword(event.target.value);
            }}
          />
          <img
            className="absolute ml2"
            src={searchIcon}
            width="20px"
            height="20px"
            style={{
              marginLeft: '10px',
            }}
            color="#0FA3A3"
          />
        </div>
        <div className="flex-grow-1 overflow-y-auto">
          {props.isOpen ? <RoomList /> : null}
        </div>
      </div>
      {showDialog && (
        <RightSidebar
          onClose={() => {
            setShowDialog(!showDialog);
          }}
        >
          <CreateForm setShowDialog={setShowDialog} />
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
  };
};

export const RoomSideBar = connect(mapStateToProps, {
  clearRoomError,
})(withRouter(RoomSideBarComponent));
