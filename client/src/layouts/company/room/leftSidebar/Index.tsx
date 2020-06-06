import React, { useState } from 'react';
import { RoomList } from './RoomList';
import { connect, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CreateForm } from './Form';
import { clearRoomError } from 'stores/room/Actions';
import { RightSidebar } from 'components/RightSidebar';
import { InputGroupField } from 'components/fields/InputGroupField';
import { projectRules } from './../../project/settings/projectrules';
import createIcon from './../../../../resources/images/create.svg';
import searchIcon from './../../../../resources/images/search.svg';
import { isMobileOnly } from 'react-device-detect';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { room } from 'stores/room/Types';
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
import { room } from 'stores/room/Types';
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
import { room } from 'stores/room/Types';
>>>>>>> 6d92f22e... Dev (#202)

interface RoomSideBarComponentProps {
  projectRole?: string;
  optionalRole?: string;
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          { props.projectRole && 
            props.optionalRole && 
            (projectRules(props.optionalRole)[props.projectRole] === true || 
            projectRules(props.optionalRole)[props.projectRole].includes(
            'createUpdateRoom',
            )) &&
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
          }
      </div>
=======
          {props.companyRole && projectPermit(props.companyRole) ? (
=======
>>>>>>> e5e8ab62... Feature/role access (#187)
=======
>>>>>>> 380328e7... Feature/role access (#187)
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
>>>>>>> a51ad486... Feature/mobile responsive (#148)
        <div className="flex items-center ph3-ns relative">
          <InputGroupField
            id="roomName"
            value={searchKeyword}
            placeHolder="Search for Rooms"
            className="pv1 ba b--light-silver br3 pl4"
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
<<<<<<< HEAD
          {props.isOpen || isMobileOnly ? <RoomList search={searchKeyword}/> : null}
=======
          {props.isOpen || isMobileOnly ? <RoomList /> : null}
>>>>>>> a51ad486... Feature/mobile responsive (#148)
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
    companyRole: 
      state.companyReducer.currentCompany.role,
    projectRole: 
      state.projectReducer.projectRole && 
      state.projectReducer.projectRole.projects && 
      state.projectReducer.projectRole.projects.role,
    optionalRole: 
      state.projectReducer.projectRole &&
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.project &&
      state.projectReducer.projectRole.projects.project.optionalRole,
  };
};

export const RoomSideBar = connect(mapStateToProps, {
  clearRoomError,
})(withRouter(RoomSideBarComponent));
