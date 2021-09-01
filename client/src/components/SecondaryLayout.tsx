import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { userSubscriber } from 'layouts/company/room/channelSubscribe';
import { isEmpty } from 'lodash';
import { User } from 'stores/user/Reducer';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';
import TimerWatch from './timer/TimerWatch';

interface SecondaryLayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

export const SecondaryLayout = (props: SecondaryLayoutProps) => {
  const user: User = useSelector(
    (state: any) => state.userReducer.user,
  );
  const currentlyTracking: ICurrentTrack = useSelector(
    (state: any) => state.timeTrackerReducer.currentlyTracking,
  );
  const { taskId }: any = useParams();

  useEffect(() => {
    async function subscribeUser() {
      await userSubscriber();
    }
    if (!isEmpty(user._id)) {
      subscribeUser();
    }
  }, []);

  return props.Component ? (
    <div className="relative h-100">
      <props.Component />
      {!!currentlyTracking.name && taskId !== currentlyTracking.task && (
        <div className="fixed" style={{ bottom: 20, right: 50 }}>
          <TimerWatch />
        </div>
      )}
    </div>
  ) : null;
};
