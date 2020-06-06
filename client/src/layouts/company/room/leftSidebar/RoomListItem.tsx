import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { IRoom } from 'stores/room/Reducer';
import { CHANGE_ROOM } from 'stores/room/Types';
import { RoomQueries, RoomPage } from '../Index';
import { isMobileOnly } from 'react-device-detect';
import { Drawer } from '@blueprintjs/core';

interface RoomListItemProps {
  room: IRoom;
  lastChild?: boolean;
  active: boolean;
  iconBgColor: string;
  currentCompany?: string;
}

export const RoomListItem = (props: RoomListItemProps) => {
  const [showDialog, setShowDialog] = useState(false);
<<<<<<< HEAD
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
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

  return (
    <>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      <div
=======
      <li
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
      <div
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
      <div
>>>>>>> 6d92f22e... Dev (#202)
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
<<<<<<< HEAD
              props.currentCompany?
                history.push(
                  `/company/${props.currentCompany}/project/${props.room.project}/room?roomId=${props.room._id}${
                    queries.view ? '&view=' + queries.view : ''
                  }`,
                )
              : 
                history.push(
                  `${location.pathname}?roomId=${props.room._id}${
                    queries.view ? '&view=' + queries.view : ''
                  }`,
                );
=======
              history.push(
                `${location.pathname}?roomId=${props.room._id}${
                  queries.view ? '&view=' + queries.view : ''
                }`,
              );
>>>>>>> a51ad486... Feature/mobile responsive (#148)
            }
            if (isMobileOnly) {
              setShowDialog(true);
            }
          }}
          className={`flex items-center ph2 pv2 bb b--black-10 ${
            props.lastChild ? 'bn' : ''
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          }`}
=======
            }`}
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
          }`}
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
            }`}
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
=======
          }`}
>>>>>>> a26cd117... Release/v2.2.0 (#183)
        >
          <div className="db pr3">
            <span
              className="ttc ba b--black-10 db w2 h2 br3 tc lh-2 bg-light-gray"
<<<<<<< HEAD
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
          <div className="flex justify-around items-center">
            <h1
              className="f6 fw4 mv0 break-word"
              style={{
                color: props.room.archive
                  ? 'rgb(141, 141, 141)'
                  : 'black',
              }}
            >
=======
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
          <div className="flex justify-around items-center">
            <h1
              className="f6 fw4 mv0 break-word"
              style={{
                color: props.room.archive
                  ? 'rgb(141, 141, 141)'
                  : 'black',
              }}
            >
>>>>>>> a51ad486... Feature/mobile responsive (#148)
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
        </article>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      </div>
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <RoomPage setShowDialog={setShowDialog} />
          </div>
        </Drawer>
=======
      </li>
=======
      </div>
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
      </div>
>>>>>>> 6d92f22e... Dev (#202)
      {showDialog && (
        <Drawer
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
        onClose={() => setShowDialog(!showDialog)}
        isOpen={showDialog}
        canOutsideClickClose={false}
        style={{ width: '100%' }}
      >
        <div>
          <RoomPage setShowDialog={setShowDialog}/>
        </div>
      </Drawer>
<<<<<<< HEAD
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <RoomPage setShowDialog={setShowDialog} />
          </div>
        </Drawer>
<<<<<<< HEAD
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
      )}
    </>
  );
};
