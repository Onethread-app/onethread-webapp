import { useState } from 'react';

import { CurrentSubscription } from './CurrentSubscription';
import SubscriptionList from './SubscriptionList';
import Checkout from './Checkout';
import PaymentHistory from './PaymentHistory';

interface IPlan {
  _id: string;
  pricing: number;
}
export default function Subscriptions() {
  const [changeComponent, setChangeComponet] = useState<string>('base');
  const [plan, setPlan] = useState<IPlan>({ _id: '', pricing: 0 });
  const getPlan = (planId) => {
    setPlan(planId);
  };
  const changeComponentToThis = (changeComponentTo: string) => {
    setChangeComponet(changeComponentTo);
  };

  return (
    <div>
      <CurrentSubscription
        currentComonent={changeComponent}
        changeComponentTo={changeComponentToThis}
      />

      <SubscriptionList
        getPlan={getPlan}
        changeComponentTo={changeComponentToThis}
        currentComponent={changeComponent}
      />
      <Checkout
        plan={plan}
        currentComponent={changeComponent}
        changeComponentTo={changeComponentToThis}
      />
      <PaymentHistory
        currentComponent={changeComponent}
        changeComponentTo={changeComponentToThis}
      />
    </div>
  );
}
