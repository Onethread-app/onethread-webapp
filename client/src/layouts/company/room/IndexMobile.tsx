import React, { useEffect } from 'react';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import { connect } from 'react-redux';
import { IRoomReducer, IRoom } from 'stores/room/Reducer';
import { getRooms } from 'stores/room/Actions';
import {
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2e223ec5... Auto Login & Webview for app (#191)
import {
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
} from '../../../stores/project/Actions';
<<<<<<< HEAD
=======
>>>>>>> 9bf420fb... Release/v2.2.0 (#181)
=======
>>>>>>> 2e223ec5... Auto Login & Webview for app (#191)
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
  getSingleProject: (pid: string) => void;
  setCurrentProjectId: (pid: string) => void;
  getRoleForProject: (pid: string) => void;
}

const RoomPageMobileComponent = (props: RoomPageComponentProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');
=======
>>>>>>> 9bf420fb... Release/v2.2.0 (#181)
=======
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');
>>>>>>> 2e223ec5... Auto Login & Webview for app (#191)
  const load = async (_getRooms: any) => {
    await _getRooms();
  };

  // get all rooms
  useEffect(() => {
    if (props.companyId && props.projectId) {
      load(props.getRooms);
    }
  }, [props.companyId, props.projectId]);


  if(props.projectId===''){
    const { projectId } = (props.match.params as any);
      props.getSingleProject(projectId);
      props.setCurrentProjectId(projectId);
      props.getRoleForProject(projectId);
  }

  return (
    <>
      <NavbarCompany title="Rooms" />
      { !(view && view === 'mobile') && 
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
        <div className="w-100">
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
    project: state.projectReducer.projectDetails,
  };
};

export const RoomPageMobile = connect(mapStateToProps, {
  getRooms,
<<<<<<< HEAD
<<<<<<< HEAD
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
=======
>>>>>>> 9bf420fb... Release/v2.2.0 (#181)
=======
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
>>>>>>> 2e223ec5... Auto Login & Webview for app (#191)
})(withRouter(RoomPageMobileComponent));
