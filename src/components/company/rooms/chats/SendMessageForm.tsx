import React, { useState } from 'react'
import {
  Button,
  Icon
} from "@blueprintjs/core";
import user from "../../../../resources/images/user.png";
import { useSelector } from 'react-redux';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface SendMessageFormProps {
  chatkit?: any;
}
export const SendMessageForm = withChatkit((props: SendMessageFormProps) => {
  const roomId = useSelector((state: any) => state.roomReducer.activeRoom.id);
  const [text, setText] = useState("");

  const sendMessage = (text: string) => {
    // TODO: send to backend
    props.chatkit.currentUser.sendSimpleMessage({
      roomId,
      text,
    })
  }
  const onChange = (e: any) => setText(e.target.value);
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && text !== "") {
      sendMessage(text);
      setText("");
    }
  }
  return (
    <div className="sendMessage shadow-3 flex pa1 w-100 bg-tigrow">
      <div className="flex items-center mh1">
        <img src={user} className="dib" alt="user" />
      </div>
      <input
        className="h-auto w-100 bp3-input ma1 outline-0 shadow-0"
        style={{ resize: "none" }}
        placeholder="Write your message"
        onChange={onChange}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <Button className="bp3-button bp3-minimal bp3-large">
        <Icon icon="link" className="tigrow-lightBlue" />
      </Button>
    </div>
  )
})
