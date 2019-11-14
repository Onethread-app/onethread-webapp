import React, { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  TextArea,
  FileInput,
  Dialog
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
  const [showDialog, setShowDialog] = useState(false)
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
    <>
      <div className="sendMessage shadow-3 flex w-100 bg-tigrow justify-around">
        <div className="flex items-center mh1" style={{ width: '42px' }}>
          <img src={user} className="dib" alt="user" />
        </div>
        <TextArea
          className="w-100 h-auto mv2"
          style={{ resize: 'none' }}
          placeholder="Write your message"
          onKeyPress={handleKeyPress}
          onChange={onChange}
          value={text}
          growVertically={true}
        />
        <Button
          className="bp3-minimal outline-0 mh2 w2 mv3"
          onClick={() => setShowDialog(true)}
        >
          <Icon icon="link" className="tigrow-lightBlue" />
        </Button>
        <div>
        </div>
      </div>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div className="pa3 cf">
            <h1 className="f5">Attach Files</h1>
            <FileInput className="bp3-fill" text="Choose file..." />
            <div>
              <Button
                type="submit"
                text="Attach"
                className="grow h2 pointer w-40 fr mt2"
                style={{ background: "#0fa3a3", outline: "none", color: 'white', boxShadow: 'none' }}
              />
            </div>
          </div>
        </Dialog>
      )
      }
    </>
  )
})
