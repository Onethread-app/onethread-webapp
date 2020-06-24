import React, { useState } from 'react';
import { RoomList } from './RoomList';
import { connect, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CreateForm } from './Form';
import { clearRoomError } from 'stores/room/Actions';
import { RightSidebar } from 'components/RightSidebar';
import { InputGroupField } from 'components/fields/InputGroupField';

import createIcon from './../../../../resources/images/create.svg';
import searchIcon from './../../../../resources/images/search.svg';
import { isMobileOnly } from 'react-device-detect';
import { room } from 'stores/room/Types';

interface RoomSideBarComponentProps {
  companyRole?: string;
  isOpen?: boolean;
}
interface RoomSideBarInternalProps
  extends RoomSideBarComponentProps,
    RouteComponentProps {
  clearRoomError: () => void;
}
const RoomSideBarComponent = (props: RoomSideBarInternalProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={`flex flex-column h-100 t-25-a pt4-ns pt2 mh2 mh0-ns ${
          props.isOpen ? 'db' : 'dn overflow-hidden'
        }`}
      >
        <div className="flex justify-between items-center ph3-ns">
          <h3 className="tigrow-darkGray">Rooms</h3>
            <span
              className="bp3-icon grow pointer"
              onClick={() => { 
                setShowDialog(!showDialog);
                dispatch({ type: room.CLEAR_STATUS_CODE });
              }}
            >
              <img
                src={createIcon}
                width="30px"
                height="30px"
                color="#0FA3A3"
              />
            </span>
        </div>
        <div className="flex items-center ph3-ns relative">
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
          {props.isOpen || isMobileOnly ? <RoomList /> : null}
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
