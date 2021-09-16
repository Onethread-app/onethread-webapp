import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { RoomQueries } from 'layouts/company/room/Index';

export const useUrlSearchParamsForRoom = () => {
  const [queries, setQueries] = useState<RoomQueries>({
    view: 'default',
    roomId: '',
  });
  const location = useLocation();

  useCallback(() => {
    const query = new URLSearchParams(location.search);
    const view =
      query.get('view') && query.get('view') === 'mobile'
        ? 'mobile'
        : 'default';
    const roomId = query.get('roomId') ? query.get('roomId')! : '';
    setQueries({ view, roomId });
  }, [location.search]);

  return queries;
};
