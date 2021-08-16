import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { IRoom } from 'stores/room/Reducer';
import { CHANGE_ROOM } from 'stores/room/Types';
import { RoomQueries, RoomPage } from '../Index';
import { isMobileOnly } from 'react-device-detect';
import { Drawer } from '@blueprintjs/core';
import memberListIcon from './../../../../resources/images/member-list.svg';
interface RoomListItemProps {
  room: IRoom;
  lastChild?: boolean;
  active: boolean;
  iconBgColor: string;
  currentCompany?: string;
}

export const RoomListItem = (props: RoomListItemProps) => {
  const [showDialog, setShowDialog] = useState(false);
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

  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });

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
                    `/company/${props.currentCompany}/project/${
                      props.room.project
                    }/room?roomId=${props.room._id}${
                      queries.view ? '&view=' + queries.view : ''
                    }`,
                  )
                : history.push(
                    `${location.pathname}?roomId=${props.room._id}${
                      queries.view ? '&view=' + queries.view : ''
                    }`,
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
            <div className="ma0 pointer dim flex items-center">
              <img
                className=""
                src={memberListIcon}
                width="20px"
                height="20px"
                style={{}}
                color="#34b3e9"
                alt=""
              />
              <span className="f5 ml2 fw7">
                {props.room.memberCount}
              </span>
            </div>
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
    </>
  );
};
