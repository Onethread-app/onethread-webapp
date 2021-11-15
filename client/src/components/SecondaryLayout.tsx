import { useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { User } from 'stores/user/Reducer';

import { userSubscriber } from 'layouts/company/room/channelSubscribe';

interface SecondaryLayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

export const SecondaryLayout = (props: SecondaryLayoutProps) => {
  const user: User = useSelector(
    (state: any) => state.userReducer.user,
  );

  useEffect(() => {
    async function subscribeUser() {
      await userSubscriber();
    }
    if (!isEmpty(user._id)) {
      subscribeUser();
    }
  }, []);

  return props.Component ? (
    <div className={` ${isMobileOnly ? '' : 'relative'} h-100`}>
      <props.Component />
    </div>
  ) : null;
};
