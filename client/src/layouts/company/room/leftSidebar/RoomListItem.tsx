import { useState, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch, connect } from 'react-redux';

import { Drawer } from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { IRoom, IRoomReducer } from 'stores/room/Reducer';
import { CHANGE_ROOM } from 'stores/room/Types';

import memberListIcon from './../../../../resources/images/member-list.svg';

import { MembersList } from '../chatLayout/members/MembersList';
import { RoomQueries, RoomPage } from '../Index';

interface RoomListItemProps {
  room: IRoom;
  lastChild?: boolean;
  active: boolean;
  iconBgColor: string;
  currentCompany?: string;
  users: IRoomReducer['users'];
}

const RoomListItemComponent = (props: RoomListItemProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const unreadCount = useSelector(
    (state: any) =>
      state.roomReducer.roomNotification.roomsUnreadCount &&
      state.roomReducer.roomNotification.roomsUnreadCount[
        props.room._id
      ],
  );
  const [showDialog, setShowDialog] = useState(false);

  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });

  const [showMemberListDialog, setShowMemberListDialog] =
    useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [location.search]);

  useEffect(() => {
    isMobileOnly && queries.roomId
      ? setShowDialog(true)
      : setShowDialog(false);
  }, [queries.roomId]);

  return (
    <>
      <div
        id="roomListItem"
        className="pointer br1"
        style={{
          background: props.active ? 'rgb(63, 97, 197)' : '',
          color: props.active ? '#FFFFFF' : '',
        }}
      >
        <article
          onClick={() => {
            if (!props.active) {
              dispatch({ type: CHANGE_ROOM });
              // tslint:disable-next-line: max-line-length
              props.currentCompany
                ? history.push(
                    `/company/${props.currentCompany}/project/${props.room.project}/?ptab=2&discussion=${props.room._id}&thread=0`,
                  )
                : history.push(
                    `${location.pathname}?ptab=2&discussion=${props.room._id}&thread=0`,
                  );
            }
            if (isMobileOnly) {
              setShowDialog(true);
            }
          }}
          className={`flex items-center ph2 pv2 bb b--black-10 ${
            props.lastChild ? 'bn' : ''
          }`}
        >
          <div className="db pr3">
            <span
              className="ttc ba b--black-10 db w2 h2 br3 tc lh-2 bg-light-gray"
              style={{
                backgroundColor: props.room.archive
                  ? 'rgb(215, 215, 215)'
                  : props.iconBgColor,
                color: '#FFFFFF',
              }}
            >
              {props.room.name[0]}
            </span>
          </div>
          <div className="flex justify-between items-center w-100">
            <div className="flex">
              <h1
                className={`f6 mv0 break-word ${
                  props.active ? 'fw7' : 'fw4'
                }`}
                style={{
                  color: props.room.archive
                    ? 'rgb(141, 141, 141)'
                    : props.active
                    ? '#fff'
                    : '#000',
                }}
              >
                {props.room.name}
              </h1>
              {unreadCount > 0 ? (
                <h6
                  className="bg-tigrowLightBlue white fw8 ma0 ml1"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '50%',
                  }}
                >
                  {unreadCount}
                </h6>
              ) : null}
            </div>
            <div
              onClick={() =>
                setShowMemberListDialog(!showMemberListDialog)
              }
              className="ma0 pointer dim flex items-center"
            >
              <img
                className=""
                src={memberListIcon}
                width="20px"
                height="20px"
                style={{}}
                color="#08A0F7"
                alt=""
              />
              <span className="f5 ml2 fw7">
                {props.room.memberCount}
              </span>
            </div>
          </div>
        </article>
      </div>
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(false)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <RoomPage setShowDialog={setShowDialog} />
          </div>
        </Drawer>
      )}
      {showMemberListDialog && (
        <Dialog
          onClose={() =>
            setShowMemberListDialog(!showMemberListDialog)
          }
          isOpen={showMemberListDialog}
          style={{ background: '#fff' }}
        >
          <MembersList users={props.users} />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    users: state.roomReducer.users,
  };
};

export const RoomListItem = connect(mapStateToProps)(
  RoomListItemComponent,
);
