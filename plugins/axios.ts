export default defineNuxtPlugin((nuxtApp) => {
  // 使用Nuxt内置的$fetch替代axios
  const api = {
    get: (url: string, options?: any) => $fetch(url, { method: 'GET', ...options }),
    post: (url: string, body?: any, options?: any) => $fetch(url, { method: 'POST', body, ...options }),
    put: (url: string, body?: any, options?: any) => $fetch(url, { method: 'PUT', body, ...options }),
    delete: (url: string, options?: any) => $fetch(url, { method: 'DELETE', ...options })
  }
  
  nuxtApp.provide('api', api)
})