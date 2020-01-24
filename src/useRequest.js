import {
  useState,
  useCallback,
  useContext,
  useRef,
  useEffect,
  useMemo
} from "react";
import axios from "axios";
import { AxiosContext } from "./axiosContext";
import formatAxiosError from "./formatAxiosError";

const useRequest = (
  { request, cancelOnUnmount = true, onRequest, onSuccess, onError, onCancel },
  deps
) => {
  // Global axios instance.
  const { instance: axiosInstance } = useContext(AxiosContext);
  if (!axiosInstance) {
    throw new Error("requires an Axios instance to be passed through");
  }

  // Request state data.
  const [requestState, setRequestState] = useState({
    fetching: !!deps, // immediately set fetching status for deny fast switching
    fetched: false,
    canceled: false,
    error: undefined,
    data: undefined
  });
  const source = useRef(null);
  const unmounted = useRef(false);
  const updateRequestState = newState => {
    if (unmounted.current) return;
    setRequestState(currentState => ({ ...currentState, ...newState }));
  };
  const cancel = () => {
    source.current && source.current.cancel("Source component will unmount.");
  };

  // Fetch function.
  const fetch = useCallback(
    async params => {
      // Create cancel source.
      source.current = axios.CancelToken.source();

      // Get and check axios request config.
      const requestConfig = request(params, requestState.data);
      if (!requestConfig) return;

      // Call request.
      try {
        updateRequestState({ fetching: true });
        onRequest && onRequest(params, requestState.data);
        const response = await axiosInstance({
          ...requestConfig,
          cancelToken: source.current.token
        });
        updateRequestState({
          data: response.data,
          fetching: false,
          fetched: true,
          canceled: false,
          error: undefined
        });
        onSuccess && onSuccess(response.data, params);
      } catch (thrown) {
        const error = formatAxiosError(thrown);
        const canceled = axios.isCancel(thrown);
        updateRequestState({
          canceled,
          fetched: false,
          error,
          data: undefined,
          fetching: false
        });
        if (canceled) {
          onCancel && onCancel(error, params);
        } else {
          onError && onError(error, params);
        }
      } finally {
        source.current = null;
      }
    },
    [axiosInstance, request]
  );

  // Autofetch on deps exist and changed.
  useEffect(() => {
    if (deps) fetch();
  }, deps);

  // Autocancel on unmount.
  useEffect(
    () => () => {
      unmounted.current = true;
      if (cancelOnUnmount) {
        cancel();
      }
    },
    [cancelOnUnmount]
  );

  return useMemo(() => ({ ...requestState, fetch, cancel }), [
    requestState,
    fetch
  ]);
};

export default useRequest;
