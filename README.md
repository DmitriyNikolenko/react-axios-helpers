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
const { data, error, fetching, fetched, fetch, cancel, canceled } = useRequest({
    request: delay => ({ // axios config
      method: 'put',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
    onRequest: (params) => console.log('onRequest', params),
    onSuccess: (data, params) => console.log('onSuccess', data, params),
    onError: (error, params) => console.log('onError', error, params),
  }, [delay])
```

#### Manual call.
```jsx
const { data, fetch } = useRequest({ request: () => ({  method: 'put', url: '/v2/5185415ba171ea3a00704eed' }) })
```
#### Automatic call.

Will request after ever delay change?

```jsx
const { data, error, fetch } = useRequest({
    request: delay => ({
      method: 'put',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
  }, [delay])
```

#### Avoid call.

For avoiding call you will return null (or undefined) from request.

```jsx
const { data, error, fetch } = useRequest({
    request: delay => delay < 1000 ? null : ({
      method: 'put',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
  }, [delay])
```

## License

MIT © [DmitriyNikolenko](https://github.com/DmitriyNikolenko)
