
declare module 'react-axios-helpers' {
	import React from 'react'
	import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

	interface AxiosContextInterface {
		instance: AxiosInstance
	}

	interface TUseRequestOptions<T, P = any> {
		request: (props: P) => AxiosRequestConfig | undefined
		cancelOnUnmount?: boolean
		onRequest?: (props: P) => void
		onSuccess?: (data: T, props: P) => void
		onError?: (error: AxiosError, props: P) => void
	}

	interface TUseRequestData<T> {
		data: T
		error: AxiosError
		fetching: boolean
		fetched: boolean
		fetch: () => void
		cancel: () => void
		canceled: boolean
	}

	export const useRequest: <T, P>(options: TUseRequestOptions<T, P>, deps?: any[]) => TUseRequestData<T>
	export const AxiosProvider: any
	export const AxiosContext: any
}