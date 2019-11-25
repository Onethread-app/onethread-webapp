import { useState, useEffect } from 'react';

import useDebounce from './useDebounce';

function useLiveSearch(query: string, requestFactory: any, delay = 250, neglectValue = '') {
  const [response, setResponse] = useState([]);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    let isActive = true;

    if (debouncedQuery !== neglectValue) {
      requestFactory(debouncedQuery).then((res: any) => {
        if (isActive) {
          setResponse(res.employees.data);
        }
      });
    } else {
      setResponse([]);
    }
    return () => {
      isActive = false;
    };
  }, [debouncedQuery])

  return response;
}

export default useLiveSearch;
