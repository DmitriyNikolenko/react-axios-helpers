import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export const AxiosContext = createContext({ instance: axios })
export const AxiosConsumer = AxiosContext.Consumer

export const AxiosProvider = ({ instance = axios, children }) => (
  <AxiosContext.Provider value={{ instance }}>
    {children}
  </AxiosContext.Provider>
)

AxiosProvider.propTypes = {
  instance: PropTypes.func,
  children: PropTypes.node.isRequired
}
