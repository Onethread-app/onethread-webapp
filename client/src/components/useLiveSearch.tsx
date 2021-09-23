import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutRef);
  });

  return debouncedValue;
}

export function useLiveSearch(
  query: string,
  requestFactory: any,
  delay = 180,
  neglectValue = '',
) {
  const [response, setResponse] = useState([]);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    let isActive = true;

    if (debouncedQuery !== neglectValue) {
      requestFactory(debouncedQuery).then((res: any) => {
        if (isActive) {
          setResponse(res);
        }
      });
    } else {
      setResponse([]);
    }
    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  return response;
}
