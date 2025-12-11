import axios from 'axios'
class Http {
  constructor() {
    this.timeout = 100000
    this.baseURL = import.meta.env.VITE_APP_HTTP_URL
  }

  mergeOptions(obj = {}) {
    return {
      timeout: this.timeout,
      baseURL: this.baseURL,
      ...obj
    }
  }

  setInterceptor(instance) {
    instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    instance.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            return response.data
          }
          if (response.data.err === 1) {
            return Promise.reject(response.message)
          }
          if (response.data && response.data.code === 200) {
            if (response.data.data || response.data.dataInfo) {
              return response.data.data || response.data.dataInfo
            }
          }
          return response.data
        }
        if (response.status === 404) {
          return Promise.reject(response.message, '404')
        }
        return response.data
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  require(options) {
    const config = this.mergeOptions(options)
    const instance = axios.create()
    this.setInterceptor(instance)
    return instance(config)
  }

  get(url, params, config = {}) {
    return this.require({
      url,
      method: 'get',
      ...config,
      params
    })
  }

  post(url, data) {
    return this.require({
      url,
      method: 'post',
      data
    })
  }
}
export default new Http()
