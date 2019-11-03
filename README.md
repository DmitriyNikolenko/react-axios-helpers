# react-axios-helpers

> Axios helpers for React.

## Install

```bash
npm install react-axios-helpers
```
or
```bash
yarn add react-axios-helpers
```

## Usage

### AxiosProvider

Wrap your app to with a provider.
```jsx
	const customAxiosInstance = axios.create()

	return (
		<AxiosProvider instance={customAxiosInstance}>
			<App />
		</AxiosProvider>
	);
```

### useRequest

Use hook to API request.

#### Full example.
```jsx
const { data, error, fetching, fetched, fetch, cancel, canceled, canFetchNext } = useRequest({
    // Request setup
    request: (filters = {}, page = 1) => ({ // axios config
      method: 'get',
      url: `https://reqres.in/api/users?page=1&delay=3ms`,
      params: { page, ...filters }
    }),
    // Result handlers
    onRequest: (params) => console.log('onRequest', params),
    onSuccess: (data, params) => console.log('onSuccess', data, params),
    onError: (error, params) => console.log('onError', error, params),
    onCancel: (error, params) => console.log('onCancel', error, params),
    // Pagination
    isCanNextFetch: (data, params) => params.page < data.total_pages,
    getNextFetchParams: (prevParams) => ({ ...prevParams, page: prevParams.page + 1 }),
    transformData: (response, prevData, params) => ({ ...response, data: [...prevData, ...response.data] })  
  }, [filters])
```

#### Manual call.
```jsx
const { data, fetch } = useRequest({ request: () => ({ url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms` }) })

fetch(200) // will fetch after call fetch()
```
#### Automatic call.

```jsx
const { data } = useRequest({
    request: (delay = 100) => ({
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
  }, [delay]) // Will fetch on mount and change delay value
```

#### Both call methods.

```jsx
const { data, fetch } = useRequest({
    request: (delay = 100) => ({
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
}, []) // will fetch on mount

fetch(200) // will fetch after call fetch()
```

#### Avoid call.

For avoiding call you will return null (or undefined) from request.

```jsx
const { data, error } = useRequest({
    request: (delay, authorized) => authorized ? {
      method: 'get',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    } : null, // will fetch if authorized
  }, [delay, authorized]) // try fetch on mount and change delay value
```

#### Typescript support.

```tsx
useRequest<TData, TParams, TResponse = TData>()
```

## License

MIT © [DmitriyNikolenko](https://github.com/DmitriyNikolenko)
