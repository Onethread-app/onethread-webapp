import { useEffect, useState } from 'react';
import moment from 'moment';

const Clock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
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
