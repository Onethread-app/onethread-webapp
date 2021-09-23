import { useEffect } from 'react';
import {
  withRouter,
  RouteComponentProps,
  NavLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Pusher from 'pusher-js/types/src/core/pusher';

import { ICompany } from 'stores/company/Reducer';
import { IRoomReducer, IRoom } from 'stores/room/Reducer';
import { getRooms } from 'stores/room/Actions';

import Navbar from 'components/navbar/Navbar';
import { RoomSideBar } from 'layouts/company/room/leftSidebar/Index';
import {
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
} from '../../../stores/project/Actions';

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
  const { t } = useTranslation();
  const query = new URLSearchParams(props.location.search);
  const view = query.get('view');

  if (props.projectId === '') {
    const { projectId } = props.match.params as any;
    props.getSingleProject(projectId);
    props.setCurrentProjectId(projectId);
    props.getRoleForProject(projectId);
  }

  // get all rooms
  useEffect(() => {
    if (props.companyId && props.projectId) {
      props.getRooms();
    }
  }, [props.companyId, props.projectId]);

  return (
    <>
      <Navbar type='company' />
      {!(view && view === 'mobile') && (
        <div className='flex justify-between mt5'>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.company.Projects.Overview')}
            </small>
          </NavLink>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.project.Project-preface.Intro')}
            </small>
          </NavLink>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.project.Project-rooms.Rooms')}
            </small>
          </NavLink>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.project.Project-boards.Board')}
            </small>
          </NavLink>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.project.Project-teammates.Team-members')}
            </small>
          </NavLink>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{
              color: 'darkGray',
            }}
          >
            <small
              style={{
                color: 'inherit',
              }}
            >
              {t('app.company.Projects.Project-Settings')}
            </small>
          </NavLink>
        </div>
      )}
      <div className='flex h-100 w-100'>
        <div className='w-100'>
          <RoomSideBar />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  currentRoom: state.roomReducer.currentRoom,
  companyId: state.companyReducer.currentCompany._id,
  projectId: state.projectReducer.projectDetails._id,
  rooms: state.roomReducer.rooms,
  pusherInstance: state.pusherReducer.pusherInstance,
  company: state.companyReducer.currentCompany,
  project: state.projectReducer.projectDetails,
});

export const RoomPageMobile = connect(mapStateToProps, {
  getRooms,
  getSingleProject,
  setCurrentProjectId,
  getRoleForProject,
})(withRouter(RoomPageMobileComponent));

export default RoomPageMobile;
