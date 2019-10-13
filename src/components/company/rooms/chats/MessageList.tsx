import React, { useEffect, useRef, useState } from 'react'
import { MessageItem } from 'components/common/MessageItem';
import user from "../../../../resources/images/user.png";
// import { Loading } from 'components/common/field/Loading';
import { useSelector } from 'react-redux';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface MessageListProps {
  chatkit?: any;
}

export const MessageList = withChatkit((props: MessageListProps) => {
  const [first, setFirst] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useSelector((state: any) => state.roomReducer.messages);
  const roomId = useSelector((state: any) => state.roomReducer.roomId);

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
  }, [roomId])
  useEffect(scrollToBottom, [messages]);

  return (
    <div
      className="overflow-y-auto ph1 pt2"
      ref={messagesEndRef}
      style={{ height: "calc(100vh - 153px)" }}>
      {!props.chatkit.isLoading && props.chatkit.currentUser.rooms.length > 0 ? messages.length > 1 && messages[0].id !== null ? messages.map((message: any, i: number, arr: any) => {
        return (
          <MessageItem
            key={message.id}
            img={user}
            text={message.text}
            createdAt={message.createdAt}
            sender={message.userStore.users[message.senderId]}
          />
        );
      }) : "" : ""}
    </div>
  )
})
