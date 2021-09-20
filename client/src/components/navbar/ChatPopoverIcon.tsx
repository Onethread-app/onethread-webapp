import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';

import ChatIcon from '@material-ui/icons/Chat';
import Badge from '@material-ui/core/Badge/Badge';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';

import { IChat } from 'stores/room/Reducer';
import { compareChats } from 'helpers/utils';

import ChatListItem from 'components/chat/ChatListItem';

interface IChatPopoverIcon {
  type: string;
}

interface IChatPopoverIconInternalProps extends IChatPopoverIcon {
  chats: [IChat];
  totalRoomUnread: number;
}

const ChatPopoverIcon = (props: IChatPopoverIconInternalProps) => {
  return (
    <Popover
      popoverClassName="bg-white"
      position={Position.BOTTOM}
      content={
        <div
          style={{
            maxHeight: '300px',
            width: isMobileOnly ? '320px' : '420px',
          }}
          className={`pt2 pb1 overflow-y-auto`}
        >
          {props.chats && props.chats.length ? (
            props.chats
              .sort(compareChats)
              .map((chat: IChat, index) => (
                <ChatListItem chat={chat} key={index} />
              ))
          ) : (
            <p className="ph2">No room To Show</p>
          )}
        </div>
      }
      target={
        <div className="mr3 pointer">
          <Badge
            badgeContent={props.totalRoomUnread}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            color="secondary"
          >
            <ChatIcon
              style={{
                color: props.type === 'home' ? 'white' : 'dark-gray',
              }}
            />
          </Badge>
        </div>
      }
    />
  );
};

const mapStateToProps = (state: any) => ({
  chats: state.roomReducer.chats,
  totalRoomUnread: state.roomReducer.totalUnread,
});

export default connect(mapStateToProps)(ChatPopoverIcon);
