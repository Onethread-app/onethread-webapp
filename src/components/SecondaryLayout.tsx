import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_ROOM, GET_COMPANY_ROOMS } from 'stores/room/Types';
import { userSubscriber } from 'layouts/company/room/channelSubscribe';
import { isEmpty } from 'lodash';
import { User } from 'stores/user/Reducer';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface SecondaryLayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
  chatkit?: any;
}

export const SecondaryLayout = withChatkit((props: SecondaryLayoutProps) => {
  const companyId = useSelector((state: any) => state.companyReducer.currentCompany._id);
  const user: User = useSelector((state: any) => state.userReducer.user);

  const dispatch = useDispatch();

  const connectChatManager = () => {
    if (!props.chatkit.isLoading) {
      props.chatkit.chatManager
        .connect({
          onRoomUpdated: (room: any) => {
            dispatch({ type: UPDATE_ROOM, payload: room });
          }
        })
        .then((currentUser: any) => {
          // console.log('Successful connection', currentUser)
        })
        .catch((err: any) => {
          connectChatManager();
        });
    }
  };

  useEffect(() => {
    if (!props.chatkit.isLoading && companyId) {
      connectChatManager();

      const companyRooms = props.chatkit.currentUser.rooms
        .filter((room: any) => room.customData.company === companyId)
        .map((room: any) => {
          return {
            _id: room.id,
            name: room.name,
            company: room.customData.company,
            project: room.customData.project,
            unreadCount: room.unreadCount,
          };
        });

      dispatch({ type: GET_COMPANY_ROOMS, payload: companyRooms });
    }
  }, [props.chatkit, companyId]);

  useEffect(() => {
    async function subscribeUser() {
      await userSubscriber();
    }
    if (!isEmpty(user._id)) {
      subscribeUser();
    }
  }, []);

  return props.Component ? <props.Component /> : null;
});
