import { useState, useCallback, useContext, useRef, useEffect, useMemo } from 'react'
import axios from 'axios'
import { AxiosContext } from './axiosContext'
import formatAxiosError from './formatAxiosError'

const defaultArgs = { 
  request: params => params,
  cancelOnUnmount = true, 
  onRequest = () => void 0, 
  onSuccess = () => void 0, 
  onError = () => void 0, 
  onCancel = () => void 0, 
  getNextFetchParams = prevParams => prevParams, 
  isCanNextFetch = () => false,
  transformData: (newData, prevData, params) => newData,
}

const useRequest = (args, deps) => {
  const { 
    request, 
    cancelOnUnmount, 
    onRequest, 
    onSuccess, 
    onError, 
    onCancel,
    getNextFetchParams, 
    isCanNextFetch,
    transformData,
  } = {...args, ...defaultArgs}

  // Global axios instance.
  const { instance: axiosInstance } = useContext(AxiosContext)
  if (!axiosInstance) {
    throw new Error('requires an Axios instance to be passed through')
  }

  // Request state data.
  const [requestState, setRequestState] = useState({
    fetching: false,
    fetched: false,
    canFetchNext: false,
    canceled: false,
    error: undefined,
    data: undefined
  })
  const source = useRef(null)
  const previousParams = useRef(null)

  // Cancel function.
  const cancel = useCallback((message) => {
    source.current && source.current.cancel(message)
  }, [])

  // Fetch function.
  const fetch = useCallback(async (...params) => {
    // Create cancel source.
    source.current = axios.CancelToken.source()

    // Save params to history (for fetchNext)
    previousParams.current = params

    // Get and check axios request config.
    const requestConfig = request(...params)
    if (!requestConfig) return

    // Call request.
    try {
      setRequestState(state => ({ ...state, fetching: true }))
      onRequest(params)
      const response = await axiosInstance({
        ...requestConfig,
        cancelToken: source.current.token
      })
  
      const data = transformData(response.data, requestState.data, params)
      const canNextFetch = isCanNextFetch(response.data, params)
      setRequestState(state => ({
        ...state,
        data,
        fetching: false,
        fetched: true,
        canNextFetch,
        canceled: false,
        error: undefined
      }))
      onSuccess(newData, params)
  
    } catch (thrown) {
      const error = formatAxiosError(thrown)
      const canceled = axios.isCancel(thrown)
      setRequestState(state => ({
        ...state,
        data: undefined,
        fetching: false,
        fetched: false,
        // canFetchNext - skip changes
        canceled,
        error,
      }))
      if (canceled) {
        onCancel(error, params)
      } else {
        onError(error, params)
      }
    } finally {
      source.current = null
    }
  }, [axiosInstance, request, requestState.data])

  // Fetch next page of data. Result will be added to current data.
  const fetchNext = useCallback(() => {
    if (!requestState.canFetchNext) return
    const nextParams = getNextFetchParams(previousParams.current, requestState.data)

    fetch(nextParams)
  }, [fetch, requestState.canFetchNext])

  // Autofetch on deps exist and changed.
  useEffect(() => {
    if (deps) fetch(...deps)
  }, deps)

  // Autocancel on unmount.
  useEffect(() => () => {
    if (cancelOnUnmount) cancel('Source component will unmount.')
  }, [cancelOnUnmount])

  return useMemo(() => ({ ...requestState, fetch, fetchNext, cancel }), [requestState, fetch, cancel])
}

export default useRequest
