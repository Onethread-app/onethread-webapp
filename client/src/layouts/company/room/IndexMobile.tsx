import React, { useEffect } from 'react';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { connect } from 'react-redux';
import { IRoomReducer, IRoom } from 'stores/room/Reducer';
import {
  getRooms
} from 'stores/room/Actions';
import { withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import Pusher from 'pusher-js';
import { NavbarCompany } from 'components/NavbarCompany';
import { ICompany } from 'stores/company/Reducer';

export interface RoomQueries {
  view: 'default' | 'mobile';
  roomId: string;
}

interface RoomPageComponentProps extends RouteComponentProps {
  currentRoom: IRoomReducer['currentRoom'];
  companyId: string;
  projectId: string;
  rooms: IRoom[];
  getRooms: () => void;
  pusherInstance: Pusher | undefined;
  company: ICompany;
  project: any;
}

const RoomPageMobileComponent = (props: RoomPageComponentProps) => {

  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');
  const load = async (_getRooms: any) => {
    await _getRooms();
  };

  // get all rooms
  useEffect(() => {
    if (props.companyId && props.projectId) {
      load(props.getRooms);
    }
  }, [props.companyId, props.projectId]);

  return (
    <>
      <NavbarCompany title="Rooms"/>
      { !(view && view=== 'mobile') && 
      <div className="flex justify-between mt5">
        <NavLink
          exact
          className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
          to={`/company/${props.company.name}/project/${props.project._id}`}
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'darkGray' }}
        >
          <small style={{ color: 'inherit' }}>Preface</small>
        </NavLink>
        <NavLink
          exact
          className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
          to={`/company/${props.company.name}/project/${props.project._id}/room`}
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'darkGray' }}
        >
          <small style={{ color: 'inherit' }}>Room</small>
        </NavLink>
        <NavLink
          exact
          className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
          to={`/company/${props.company.name}/project/${props.project._id}/board`}
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'darkGray' }}
        >
          <small style={{ color: 'inherit' }}>Board</small>
        </NavLink>
        <NavLink
          exact
          className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
          to={`/company/${props.company.name}/project/${props.project._id}/team`}
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'darkGray' }}
        >
          <small style={{ color: 'inherit' }}>Team</small>
        </NavLink>
        <NavLink
          exact
          className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
          to={`/company/${props.company.name}/project/${props.project._id}/settings`}
          activeStyle={{ background: '#3F61C5', color: 'white' }}
          style={{ color: 'darkGray' }}
        >
          <small style={{ color: 'inherit' }}>Settings</small>
        </NavLink>
      </div>}
      <div className="flex h-100 w-100">
        <div
          className="w-100"
        >
          <RoomSideBar />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.projectDetails._id,
    rooms: state.roomReducer.rooms,
    pusherInstance: state.pusherReducer.pusherInstance,
    company: state.companyReducer.currentCompany,
    project: state.projectReducer.projectDetails
  };
};

export const RoomPageMobile = connect(mapStateToProps, {
  getRooms
})(withRouter(RoomPageMobileComponent));
