
declare module 'react-axios-helpers' {
	import React from 'react'
	import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

	interface AxiosContextInterface {
		instance: AxiosInstance
	}

	interface TUseRequestOptions<TData, TProps> {
		request: (props: TProps, data: TData) => AxiosRequestConfig | undefined | null
		cancelOnUnmount?: boolean
		onRequest?: (props: TProps) => void
		onSuccess?: (data: TData, props: TProps) => void
		onError?: (error: AxiosError, props: TProps) => void
		onCancel?: (error: AxiosError, props: TProps) => void
	}

	interface TUseRequestData<TData, TProps> {
		data: TData
		error: AxiosError
		fetching: boolean
		fetched: boolean
		fetch: (props: TProps) => Promise<void>
		cancel: () => void
		canceled: boolean
	}

	export const useRequest: <T, P>(options: TUseRequestOptions<T, P>, deps?: any[]) => TUseRequestData<T, P>
	export const AxiosContext: React.Context<AxiosContextInterface>
	export const AxiosProvider: React.FC<AxiosContextInterface>
}