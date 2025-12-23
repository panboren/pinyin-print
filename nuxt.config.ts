// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 开发/生产环境配置
  devtools: { enabled: true },
  
  // 应用配置
  app: {
    head: {
      title: '拼音打印工具',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '拼音打印工具 - 支持多种打印格式' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS配置
  css: [
    '~/assets/css/reset.min.css',
    '~/assets/css/element-global.css',
    '~/assets/css/theme.scss'
  ],

  // 构建配置
  build: {
    transpile: ['vant', 'three', 'gsap']
  },

  // Vite配置
  vite: {
    resolve: {
      alias: {
        '@': '.',
        '@assets': './assets',
        '@components': './components',
        '@stores': './stores',
        '@utils': './utils',
        '@api': './api',
        '@config': './config'
      }
    }
  },

  // 服务器配置
  server: {
    port: 8080,
    host: '0.0.0.0'
  },

  // 模块配置
  modules: [
    // '@nuxtjs/axios' // 暂时注释掉，使用Nuxt内置的$fetch
  ],

  // 运行时配置
  runtimeConfig: {
    // 私有配置 (服务端)
    public: {
      // 公共配置 (客户端和服务端)
      appTitle: process.env.NUXT_PUBLIC_APP_TITLE || '拼音打印工具',
      httpUrl: process.env.NUXT_PUBLIC_HTTP_URL || ''
    }
  },

  // 兼容性配置
  nitro: {
    experimental: {
      wasm: true // 支持WebAssembly (如果需要)
    }
  },

  // 自动导入配置
  imports: {
    dirs: [
      'composables',
      'utils'
    ]
  },

  // 组件自动导入
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ]
})