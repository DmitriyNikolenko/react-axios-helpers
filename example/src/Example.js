import React, { useState, useEffect } from 'react'
import { useRequest } from 'react-axios-helpers'

function Example() {
  const [delay, setDelay] = useState(5000)

  const { data, error, fetching, fetched, fetch, cancel, canceled } = useRequest({
    config: delay => ({
      method: 'put',
      url: `https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=${delay}ms`
    }),
    onRequest: (...args) => console.info('onRequest', ...args),
    onSuccess: (...args) => console.info('onSuccess', ...args),
    onError: (...args) => console.info('onError', ...args),
  }, [delay])
  console.log('useRequest', { data, error, fetching, fetched, fetch, cancel, canceled })

  useEffect(() => {
    fetch(5000)
    setTimeout(() => cancel('asdasdsadsad'), 1000)
  }, [])

  return (
      <div>
          <button onClick={() => setDelay(delay => delay + 1)}>new delay </button>
      </div>
  );
}

export default Example;