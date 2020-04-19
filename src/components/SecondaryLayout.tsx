import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userSubscriber } from 'layouts/company/room/channelSubscribe';
import { isEmpty } from 'lodash';
import { User } from 'stores/user/Reducer';

interface SecondaryLayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

export const SecondaryLayout = (props: SecondaryLayoutProps) => {
  const user: User = useSelector((state: any) => state.userReducer.user);

  // TODO count unread messages here
  // useEffect(() => {
  //   if (companyId) {
  //     const companyRooms = rooms
  //       .filter((room: any) => room.customData.company === companyId)
  //       .map((room: any) => {
  //         return {
  //           _id: room.id,
  //           name: room.name,
  //           company: room.customData.company,
  //           project: room.customData.project,
  //           unreadCount: room.unreadCount,
  //         };
  //       });

  //     dispatch({ type: GET_COMPANY_ROOMS, payload: companyRooms });
  //   }
  // }, [, companyId]);

  useEffect(() => {
    async function subscribeUser() {
      await userSubscriber();
    }
    if (!isEmpty(user._id)) {
      subscribeUser();
    }
  }, []);

  return props.Component ? <props.Component /> : null;
};
