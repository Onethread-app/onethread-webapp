import React from 'react';
import moment from 'moment';

const Clock = () => {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div>
      <h2>{moment(date).format('hh:mm')}</h2>
    </div>
  );
};

export default Clock;
