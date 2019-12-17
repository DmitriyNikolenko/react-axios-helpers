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
const customAxiosInstance = axios.create();

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
const { data, error, fetching, fetched, fetch, cancel, canceled } = useRequest(
  {
    request: () => ({
      // axios config
      method: "put",
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=200ms`
    }),
    onRequest: params => console.log("onRequest", params),
    onSuccess: (data, params) => console.log("onSuccess", data, params),
    onError: (error, params) => console.log("onError", error, params),
    onCancel: (error, params) => console.log("onCancel", error, params)
  },
  [delay]
);
```

#### Manual call.

```jsx
const { data, fetch } = useRequest({
  request: delay => ({
    url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
  })
});

fetch(200); // will fetch after call fetch()
```

#### Automatic call.

Will request after mount and every change delay.

```jsx
const { data, error, fetch } = useRequest(
  {
    request: (delay = 200) => ({
      method: "put",
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    })
  },
  [delay]
);
```

#### Both call methods.

```jsx
const { data, fetch } = useRequest(
  {
    request: (delay = 100) => ({
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    })
  },
  []
); // will fetch on mount

fetch(200); // will fetch after call fetch()
```

#### Avoid call.

For avoiding call you will return null (or undefined) from request.

```jsx
const { data, error } = useRequest(
  {
    request: () =>
      authorized
        ? {
            method: "get",
            url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=2000ms`
          }
        : null // will fetch if authorized
  },
  [authorized]
); // try fetch on mount and change delay value
```

#### Full typescript support.

```ts
useRequest<TData, TParams>();
```

## License

MIT © [DmitriyNikolenko](https://github.com/DmitriyNikolenko)
