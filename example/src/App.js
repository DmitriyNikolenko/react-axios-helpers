import React from 'react'
import axios from 'axios'
import { AxiosProvider } from 'react-axios-helpers'
import Example from './Example'

function App() {
  return (
    <AxiosProvider instance={axios}>
      <Example />
    </AxiosProvider>
  );
}

export default App;