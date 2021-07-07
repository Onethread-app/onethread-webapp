import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { find } from 'lodash';
import moment from 'moment';
import { isMobileOnly } from 'react-device-detect';

import { IChat } from 'stores/room/Reducer';
import { CHANGE_ROOM } from 'stores/room/Types';

import { Color } from 'stores/UtilsActions';
import { RoomQueries } from 'layouts/company/room/Index';

import UserIcon from 'resources/images/profilePhoto.svg';

interface IChatListItem {
  chat: IChat;
}

const ChatListItem = (props: IChatListItem) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [queries, setQueries] = React.useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });

  React.useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [history.location.search]);

  const handleClick = () => {
    dispatch({ type: CHANGE_ROOM });
    history.push(
      `/company/${props.chat.room.company.uniqueName}/project/${
        props.chat.room.project._id
      }/room?roomId=${props.chat.room._id}${
        queries.view ? '&view=' + queries.view : ''
      }`,
    );
  };

  return (
    <div
      className={`flex flex-auto items-center pointer dim ${
        isMobileOnly ? 'ph1' : 'ph3'
      } pv1 mb1 w-100`}
      style={{
        background: props.chat.read ? '#f2f3f4' : '#fff',
      }}
      onClick={handleClick}
    >
      <div className="mr2" style={{ width: '32px', flexShrink: 0 }}>
        <img
          src={
            props.chat.message.account.profileImage
              ? props.chat.message.account.profileImage
              : UserIcon
          }
          alt=""
          style={{
            height: '32px',
            width: '32px',
          }}
          className="br4"
        />
      </div>
      <div className="flex flex-auto flex-column">
        <div className="flex flex-auto items-center justify-between mb1">
          <h3
            className={`pa0 mv0 ml0 mr4 ttc f6 ${
              props.chat.read ? 'gray fw5 ' : 'inherit fw6 '
            }`}
          >
            {`${props.chat.message.account.firstName} ${props.chat.message.account.lastName}`}
          </h3>
          <div className="flex items-center">
            <p
              className="bp3-tag modifier mb0"
              style={{ background: 'rgb(63, 97, 197)' }}
            >{`${props.chat.room.name}`}</p>
            <p
              className="ml2 bp3-tag modifier mb0"
              style={{
                background: `${
                  find(Color, ['code', props.chat.room.project.color])
                    ? find(Color, [
                        'code',
                        props.chat.room.project.color,
                      ])!.value
                    : 'inherit'
                }`,
              }}
            >{`${props.chat.room.project.name}`}</p>
          </div>
        </div>
        <div className="flex items-center justify-between flex-auto">
          <p
            className={`truncate mr3 w-60 ${
              props.chat.read ? 'gray' : 'inherit'
            }`}
            style={{ maxWidth: '60%' }}
          >{`${props.chat.message.text}`}</p>
          <p
            className="gray w-40 self-end tr"
            style={{ fontSize: '11px' }}
          >
            {moment(props.chat.message.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {};
};

export default connect(mapStateToProps)(ChatListItem);
