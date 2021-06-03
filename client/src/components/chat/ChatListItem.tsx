import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { find } from 'lodash';
import moment from 'moment';

import { IChat } from 'stores/room/Reducer';
import { CHANGE_ROOM } from 'stores/room/Types';

import { Color } from 'stores/UtilsActions';
import { RoomQueries } from 'layouts/company/room/Index';

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
      className="flex items-center pointer dim ph3 pv1 mb1 w-100"
      style={{ background: props.chat.read ? '#f2f3f4' : '#fff' }}
      onClick={handleClick}
    >
      <div className="mr2">
        <img
          src={props.chat.message.account.profileImage}
          alt={`${props.chat.message.account.firstName} ${props.chat.message.account.lastName}`}
          style={{
            height: '32px',
            width: '32px',
          }}
          className="br4"
        />
      </div>
      <div className="flex flex-column">
        <div className="flex items-center">
          <h3
            className={`pa0 mv0 ml0 mr4 ttc f6 ${
              props.chat.read ? 'gray fw5 ' : 'inherit fw6 '
            }`}
          >
            {`${props.chat.message.account.firstName} ${props.chat.message.account.lastName}`}
          </h3>
          <p
            className="mr2 bp3-tag modifier mb0"
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
          <p className="bp3-tag modifier mb0">{`${props.chat.room.company.uniqueName}`}</p>
        </div>
        <div className="flex justify-between">
          <p
            className={`truncate mr3 ${
              props.chat.read ? 'gray' : 'inherit'
            }`}
            style={{ maxWidth: '300px' }}
          >{`${props.chat.message.text}`}</p>
          <p className="gray">
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
