import { useEffect, useState } from "react";
import { parseApiError } from "../utils/errorHelper";

// Calls an API function when the page opens, and AGAIN whenever
// any value inside `deps` changes (for example the search text or page number).
// Returns: data, loading (true/false), error (text)
export default function useFetch(apiCall, deps = []) {
  const requestKey = JSON.stringify(deps);

  // We remember WHICH request (key) the saved result belongs to
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    let ignore = false;   // ignores answers of old requests

    apiCall()
      .then((response) => {
        if (!ignore) setResult({ key: requestKey, data: response.data, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ key: requestKey, data: null, error: parseApiError(err).message });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  // If the saved result belongs to an older request, we are still loading the new one
  const loading = result.key !== requestKey;

  return {
    data: result.data,                       // may be the OLD data while loading
    error: loading ? "" : result.error,
    loading,
  };
}