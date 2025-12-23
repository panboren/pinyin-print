import * as THREE from 'three'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('three', THREE)
  
  // 确保THREE在全局可用
  if (process.client) {
    window.THREE = THREE
  }
})