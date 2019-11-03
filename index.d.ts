
declare module 'react-axios-helpers' {
	import React from 'react'
	import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

	interface AxiosContextInterface {
		instance: AxiosInstance
	}

	interface TUseRequestOptions<TData, TParams, TResponse = TData> {
		request: (props: TParams) => AxiosRequestConfig | undefined | null
		cancelOnUnmount?: boolean
		onRequest?: (props: TParams) => void
		onSuccess?: (data: TData, props: TParams) => void
		onError?: (error: AxiosError, props: TParams) => void
		onCancel?: (error: AxiosError, props: TParams) => void
		getNextFetchParams?: (prevParams: TParams, response: TResponse) => TParams
		isCanNextFetch?: (data: TResponse, prevParams: TParams) => boolean
		transformData?: (nextData: TResponse, prevData: TData, params: TParams) => TData
	}

	interface TUseRequestData<T> {
		data: T
		error: AxiosError
		fetching: boolean
		fetched: boolean
		canNextFetch: boolean
		fetch: () => void
		cancel: () => void
		canceled: boolean
	}

	export const useRequest: <T, P>(options: TUseRequestOptions<T, P>, deps?: any[]) => TUseRequestData<T>
	export const AxiosProvider: any
	export const AxiosContext: any
}