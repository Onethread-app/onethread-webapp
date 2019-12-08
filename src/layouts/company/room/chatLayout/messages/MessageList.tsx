import React, { useEffect, useRef, useState } from 'react'
import { MessageItem } from 'layouts/company/room/chatLayout/messages/MessageItem';
import { useSelector } from 'react-redux';
const { withChatkit } = require("@pusher/chatkit-client-react");

const UserIcon = require('./../../../../../resources/images/user.png');

interface MessageListProps {
  chatkit?: any;
}

export const MessageList = withChatkit((props: MessageListProps) => {
  const [first, setFirst] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useSelector((state: any) => state.roomReducer.messages);
  const roomId = useSelector((state: any) => state.roomReducer.roomId);
  const companyRooms = useSelector((state: any) => state.roomReducer.companyRooms);
  const typingUsers = useSelector((state: any) => state.roomReducer.typingUsers);

  const scrollToBottom = () => {
    // On new message, scroll to bottom
    if (messagesEndRef && messagesEndRef.current && messagesEndRef.current.scrollTop + messagesEndRef.current.clientHeight + 66 * 4 >= messagesEndRef.current.scrollHeight) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
    // at first, scroll to bottom
    else if (messagesEndRef && messagesEndRef.current && !first) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      setFirst(true);
    }
  }
  useEffect(() => {
    setFirst(false)
  }, [roomId]);

  useEffect(scrollToBottom, [messages]);

  // typing indicator
  useEffect(() => {
    (messagesEndRef as any).current.scrollTop = (messagesEndRef as any).current.scrollHeight;
  }, [typingUsers]);

  return (
    <div
      className="overflow-y-auto ph1 pt2"
      ref={messagesEndRef}
      style={{ height: "calc(100vh - 186px)" }}>
      {!props.chatkit.isLoading && companyRooms.length ? messages.length ? messages.map((message: any) => {
        return (
          <MessageItem
            key={message.id}
            img={UserIcon}
            text={message.parts[0].payload.content}
            createdAt={message.createdAt}
            sender={{
              id: message.userStore.users[message.senderId].id,
              name: message.userStore.users[message.senderId].name,
            }}
          />
        );
      }) : "" : ""}
      {typingUsers.length ? typingUsers.map((user: any, i: number) => {
        return (
          <h6 key={i} className="mv1">{user} is typing ...</h6>
        );
      }) : ""}


    </div>
  )
})
