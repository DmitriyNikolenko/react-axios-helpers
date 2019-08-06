import { useState, useCallback, useContext, useRef, useEffect, useMemo } from 'react'
import axios from 'axios'
import { AxiosContext } from './axiosContext'
import formatAxiosError from './formatAxiosError'

const useRequest = ({ request, cancelOnUnmount = true, onRequest, onSuccess, onError }, deps) => {
  // Global axios instance.
  const { instance: axiosInstance } = useContext(AxiosContext)
  if (!axiosInstance) {
    throw new Error('requires an Axios instance to be passed through')
  }

  // Request state data.
  const [requestState, setRequestState] = useState({
    fetching: false,
    fetched: false,
    canceled: false,
    error: undefined,
    data: undefined
  })
  const source = useRef(null)

  // Cancel function.
  const cancel = useCallback((message) => {
    source.current && source.current.cancel(message)
  }, [])

  // Fetch function.
  const fetch = useCallback(async (...params) => {
    // Create cancel source.
    source.current = axios.CancelToken.source()

    // Get and check axios request config.
    const requestConfig = request(...params)
    if (!requestConfig) return

    // Call request.
    try {
      setRequestState(state => ({ ...state, fetching: true }))
      onRequest && onRequest(params)
      const data = await axiosInstance({
        ...requestConfig,
        cancelToken: source.current.token
      })
      setRequestState(state => ({
        ...state,
        data,
        fetching: false,
        fetched: true,
        canceled: false,
        error: undefined
      }))
      onSuccess && onSuccess(data, params)
    } catch (thrown) {
      const error = formatAxiosError(thrown)
      const canceled = axios.isCancel(thrown)
      setRequestState(state => ({
        ...state,
        canceled,
        fetched: false,
        error,
        data: undefined,
        fetching: false
      }))
      onError && onError(error, params)
    } finally {
      source.current = null
    }
  }, [axiosInstance, request])

  // Autofetch on deps exist and changed.
  useEffect(() => {
    if (deps) fetch(...deps)
  }, deps)

  // Autocancel on unmount.
  useEffect(() => () => {
    if (cancelOnUnmount) cancel('Source component will unmount.')
  }, [cancelOnUnmount])

  return useMemo(() => ({ ...requestState, fetch, cancel }), [requestState, fetch, cancel])
}

export default useRequest
