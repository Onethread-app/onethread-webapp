import React, { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  TextArea
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
  useEffect(() => {
    setText("");
  }, [roomId])
  const sendMessage = (text: string) => {
    // TODO: send to backend
    props.chatkit.currentUser.sendSimpleMessage({
      roomId,
      text,
    })
  }
  const onChange = (e: any) => {
    setText(e.target.value);
    props.chatkit.currentUser
      .isTypingIn({ roomId })
      .catch((error: any) => console.error('error on typing', error))
  };
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && text !== "") {
      sendMessage(text);
        setText("");
    }
  }
  return (
    <div className="sendMessage shadow-3 flex w-100 bg-tigrow justify-around">
      <div className="flex items-center w2 mh1">
        <img src={user} className="dib" alt="user" />
      </div>
      {/* <input
        className="h-auto w-100 bp3-input ma1 outline-0 shadow-0"
        style={{ resize: "none" }}
        placeholder="Write your message"
        onChange={onChange}
        onKeyPress={handleKeyPress}
        value={text}
      /> */}
      <TextArea
        className="w-90 h-auto mv2"
        style={{ resize: 'none' }}
        placeholder="Write your message"
        onKeyPress={handleKeyPress}
        onChange={onChange}
        value={text}
        growVertically={true}
      />
      <Button className="bp3-minimal outline-0 mv2 mh1 w3">
        <Icon icon="link" className="tigrow-lightBlue" />
      </Button>
    </div>
  )
})
