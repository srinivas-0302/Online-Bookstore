import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Gives: searchParams (to read), updateParams (to change some), clearParams (to remove all)
export default function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const clearParams = useCallback(() => setSearchParams({}), [setSearchParams]);

  return { searchParams, updateParams, clearParams };
}