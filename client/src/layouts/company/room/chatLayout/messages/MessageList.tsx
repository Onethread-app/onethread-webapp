import React, { useEffect, useRef, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { connect, useDispatch } from 'react-redux';

import moment from 'moment';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { IRoomMessage, IRoomReducer } from 'stores/room/Reducer';
import {
  getRoomMessages,
  updateLastSeen,
} from '../../../../../stores/room/Actions';
import { ALL_MESSAGE_RECEIVED } from 'stores/room/Types';

import { MessageItem } from 'layouts/company/room/chatLayout/messages/MessageItem';

interface MessageListProps {
  updateLastSeen: (roomId: string) => void;
  getRoomMessages: (
    roomId: string,
    limit?: number,
    skip?: number,
  ) => void;
  messages: IRoomReducer['messages'];
  currentRoom: IRoomReducer['currentRoom'];
  allMessages: boolean;
}

export const MessageListComponent = (props: MessageListProps) => {
  const [first, setFirst] = useState(false);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const callUpdateLastSeen = async (roomId: string) => {
    await props.updateLastSeen(roomId);
  };

  const scrollToBottom = () => {
    // TODO send message read trigger
    if (props.messages.length) {
      callUpdateLastSeen(props.currentRoom._id);
    }

    // On new message, scroll to bottom
    if (
      messagesEndRef &&
      messagesEndRef.current &&
      messagesEndRef.current.scrollTop +
        messagesEndRef.current.clientHeight +
        messagesEndRef.current.clientHeight * 0.3 >=
        messagesEndRef.current.scrollHeight
    ) {
      messagesEndRef.current.scrollTop =
        messagesEndRef.current.scrollHeight;
    }

    // On enter the room, scroll to bottom
    if (messagesEndRef && messagesEndRef.current && !first) {
      messagesEndRef.current.scrollTop =
        messagesEndRef.current.scrollHeight;
      setFirst(true);
    }
  };

  const loadMoreMessages = async () => {
    if (props.allMessages === false && props.currentRoom) {
      const n = skip + limit;
      setSkip(n);
      await props.getRoomMessages(props.currentRoom._id, limit, n);
    }
  };

  const checkGroup = (
    cm: IRoomMessage,
    currIndex: number,
    arr: IRoomMessage[],
  ) => {
    const obj = {
      message: false,
      showPicAndName: true,
    };

    obj.message =
      currIndex !== arr.length - 1 &&
      cm.account._id === arr[currIndex + 1].account._id;

    if (
      currIndex > 0 &&
      cm.account._id === arr[currIndex - 1].account._id
    ) {
      obj.showPicAndName = false;
      return obj;
    }

    return obj;
  };

  const groupMessages = async () => {
    const messages = props!.messages;
    const groups = messages.reduce((groups, message) => {
      const date = moment(message.createdAt).format('MMM DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        messages: groups[date],
      };
    });

    await setAllMessages(groupArrays);
  };

  useEffect(() => {
    setFirst(false);
    setLimit(15);
    setSkip(0);
    dispatch({ type: ALL_MESSAGE_RECEIVED, payload: false });
  }, [props.currentRoom._id]);

  useEffect(scrollToBottom, [props.messages]);

  useEffect(() => {
    groupMessages();
  }, [props!.messages]);

  return (
    <div
      id="message-container"
      className="flex flex-column flex-grow-1 overflow-y-auto ph1 pt2 mb2"
      ref={messagesEndRef}
      style={{ marginBottom: isMobileOnly ? '6.5rem' : '' }}
    >
      {props.allMessages === false && props.messages.length > 0 ? (
        <div
          className="flex justify-center items-center"
          onClick={loadMoreMessages}
        >
          <h6
            className="pv1 ph2 mv0 white br2 pointer flex justify-center items-center"
            style={{
              backgroundColor: 'rgb(92, 108, 142)',
            }}
          >
            <Icon icon="upload" iconSize={18} />
            <span
              style={{
                fontSize: '11px',
                marginLeft: '6px',
              }}
            >
              load more
            </span>
          </h6>
        </div>
      ) : undefined}

      {allMessages.length
        ? allMessages.map((group) => {
            return (
              <>
                <div className="flex justify-center items-center pv2">
                  <small className="tigrow-darkGray">
                    {group.date}
                  </small>
                </div>
                {group.messages.map(
                  (
                    message: IRoomMessage,
                    index: number,
                    arr: IRoomMessage[],
                  ) => {
                    return (
                      <MessageItem
                        key={index}
                        message={message}
                        group={checkGroup(message, index, arr)}
                      />
                    );
                  },
                )}
              </>
            );
          })
        : ''}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    messages: state.roomReducer.messages,
    allMessages: state.roomReducer.allMessages,
  };
};

export const MessageList = connect(mapStateToProps, {
  getRoomMessages,
  updateLastSeen,
})(MessageListComponent);
