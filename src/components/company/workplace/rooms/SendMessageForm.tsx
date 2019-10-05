import React, { useState } from 'react'
import {
  Button,
  Icon
} from "@blueprintjs/core";
import user from "../../../../resources/images/user.png";
const { withChatkit } = require("@pusher/chatkit-client-react");

interface SendMessageFormProps {
  chatkit?: any;
}
export const SendMessageForm = withChatkit((props: SendMessageFormProps) => {
  const [roomId, setRoomId] = useState("56c2c264-1b5c-45f6-bc3b-c4b77cca2959");
  const [text, setText] = useState("");

  const sendMessage = (text: string) => {
    props.chatkit.currentUser.sendMessage({
      text,
      roomId
    })
  }
  const onChange = (e: any) => setText(e.target.value);
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage(text);
      setText("");
    }
  }
  return (
    <div className="absolute bottom-0 br3 shadow-3 flex pa1 w-100 bg-tigrow">
      <div className="flex items-center mh1">
        <img src={user} className="dib" alt="user" />
      </div>
      <input
        className="bp3-input ma1 w-100 outline-0 shadow-0"
        style={{ resize: "none" }}
        placeholder="Write your message"
        onChange={onChange}
        onKeyPress={handleKeyPress}
        value={text}
      />
      <div className="flex">
        <Button className="bp3-button bp3-minimal bp3-large">
          <Icon icon="media" style={{ color: "#0fa3a3" }} />
        </Button>
        <Button className="bp3-button bp3-minimal bp3-large">
          <Icon icon="link" style={{ color: "#0fa3a3" }} />
        </Button>
        <Button className="bp3-button bp3-minimal bp3-large">
          <Icon icon="insert" style={{ color: "#0fa3a3" }} />
        </Button>
      </div>
    </div>
  )
})
