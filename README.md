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

```jsx
const { data, error, fetching, fetched, fetch, cancel, canceled } = useRequest({
    config: delay => ({
      method: 'put',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
    onRequest: (...args) => console.info('onRequest', ...args),
    onSuccess: (...args) => console.info('onSuccess', ...args),
    onError: (...args) => console.info('onError', ...args),
  }, [delay])
```

## License

MIT © [DmitriyNikolenko](https://github.com/DmitriyNikolenko)
