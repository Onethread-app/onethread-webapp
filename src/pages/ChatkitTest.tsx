import React, { useEffect } from 'react'
const { withChatkit } = require("@pusher/chatkit-client-react");


export const ChatkitTest = withChatkit((props: any) => {
  useEffect(() => {
    if (!props.chatkit.isLoading) {
      let user = props.chatkit.currentUser;
      console.log(user);
      console.log("joinedRooms", user.rooms);

      // getJoinableRooms
      user.getJoinableRooms()
        .then((joinableRooms: any) => {
          console.log("joinableRooms", joinableRooms);
        })
        .catch((err: any) => console.log('error on joinableRooms: ', err));
    }
  }, [props.chatkit])


  return (
    <div>
      {props.chatkit.isLoading
        ? 'Connecting to Chatkit...'
        : `Hello ${props.chatkit.currentUser.name}!`}
    </div>
  );
});