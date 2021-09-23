import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { IRoom, IRoomReducer } from 'stores/room/Reducer';

import { RoomListItem } from './RoomListItem';

interface IRoomListComponentProps {
  currentRoom?: IRoomReducer['currentRoom'];
  rooms?: IRoom[];
  search: string;
  gettingRooms: boolean;
}

export const RoomListComponent = (props: IRoomListComponentProps) => {
  const roomBgColor = [
    '#D8315B',
    '#9F7DE8',
    '#34b3e9',
    '#456990',
    '#CDA2AB',
    '#FE5E41',
  ];

  return (
    <>
      <main className='mw6' id='roomList'>
        <ul className='list pa0 mh2-ns'>
          {props.gettingRooms === false
          && props.rooms
          && props.rooms.length ? (
              props.search ? (
                props.rooms
                  .filter(
                    (item) => !item.name
                      .toLowerCase()
                      .indexOf(props.search.toLowerCase()),
                  )
                  .map((filteredRooms, i, arr: {}) => (
                    <RoomListItem
                      key={filteredRooms._id}
                      room={filteredRooms}
                      active={
                      props.currentRoom !== undefined
                      && filteredRooms._id === props.currentRoom._id
                    }
                      iconBgColor={roomBgColor[i % roomBgColor.length]}
                    />
                  ))
              ) : (
                props.rooms.map((room: IRoom, i: number, arr: any) => (
                  <RoomListItem
                    key={room._id}
                    room={room}
                    lastChild={isEqual(
                      room._id,
                      arr[props.rooms!.length - 1].id,
                    )}
                    active={
                      props.currentRoom !== undefined
                      && room._id === props.currentRoom._id
                    }
                    iconBgColor={roomBgColor[i % roomBgColor.length]}
                  />
                ))
              )
            ) : (
              <p className='ph2'>No rooms</p>
            )}
        </ul>
      </main>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  currentRoom: state.roomReducer.currentRoom,
  rooms: state.roomReducer.rooms,
});

export const RoomList = connect(
  mapStateToProps,
  null,
)(RoomListComponent);
