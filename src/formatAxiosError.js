import axios from 'axios'

export default function formatAxiosError(error) {
  const data = error.response ? error.response.data : null
  return {
    data,
    message: error.message,
    code: (data && data.code) || error.code || (error.response && error.response.status),
    cancelled: axios.isCancel(error)
  }
}
