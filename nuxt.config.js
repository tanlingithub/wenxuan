require('dotenv').config()

const metaJson = require('./meta.json')
const materialJson = require('../../material.json')
const outputDir = `dist${metaJson.hash}`
const ossPath = `http://serverless-platform.deepexi.top/materials/${
  materialJson.materialId
}/${outputDir}`

const publicPath = process.env.NODE_ENV === 'production' ? ossPath : ''

const env = process.env
const isProd = env.MODE == 'prod'

let mockServer = 'http://39.98.50.163:3000/mock/1647'
// 不能以斜杠结尾
let apiServer = process.env.API_SERVER
// 必须以斜杠结尾

const commodityCenter = 'http://spaas-prd.deepexi.top'

const config = {
  aliIconFont: '',
  env: {
    mock: {
      '/security': mockServer,
      '/spaas-enterprise-contact': commodityCenter,
      '/spaas-console-api': commodityCenter, //
      '/spaas-staff-center': commodityCenter,
      '/deepexi-dashboard': commodityCenter, // 'http://39.98.50.163:3000/mock/995'
      '/meta-program': commodityCenter,
      '/spaas-resource-center': commodityCenter,
      '/spaas-commodity-center': commodityCenter
    },
    dev: {
      '/spaas-enterprise-contact': commodityCenter,
      '/spaas-console-api': commodityCenter, //
      '/spaas-staff-center': commodityCenter,
      '/deepexi-dashboard': commodityCenter, // 'http://39.98.50.163:3000/mock/995'
      '/meta-program': commodityCenter,
      '/spaas-resource-center': commodityCenter,
      '/spaas-commodity-center': commodityCenter,
      '/poc': 'http://47.92.95.20:18080',
      '/poctest': 'http://47.92.95.20:18080/poctest/poc'
    }
  }
}
let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  mode: 'spa',
  env: {
    NO_LOGIN: process.env.NO_LOGIN,
    OSS_KEY: process.env.OSS_KEY,
    OSS_SECRET: process.env.OSS_SECRET,
    OSS_BUCKET: process.env.OSS_BUCKET,
    OSS_REGION: process.env.OSS_REGION,
    COOKIE_PATH: process.env.COOKIE_PATH || '/'
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta', 'breadcrumb'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  generate: {
    dir: outputDir
  },
  build: {
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '~node_modules/element-ui/lib/theme-chalk'
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Optimus',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        'http-equiv': 'x-ua-compatible',
        content: 'IE=edge, chrome=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '开发平台'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png'
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less'
    }
  ],
  srcDir: 'src/',
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/components'
    },
    {
      src: '~/plugins/element'
    }
  ],
  modules: [
    '@nuxtjs/style-resources',
    ['@nuxtjs/axios'],
    [
      '@nuxtjs/dotenv',
      {
        path: './'
      }
    ]
  ],
  styleResources: {
    less: '~styles/variables.less'
  },
  axios
}
