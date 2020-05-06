import {version} from '../common'

// 配置管理
const mockSecurity =
  'http://39.98.50.163:3000/mock/1275/afiona-poc-console/security' + version

// 基本配置
export const config =
  process.env.buildEnv === 'prod'
    ? '//bucket-showyu.oss-cn-beijing.aliyuncs.com/console/config.json'
    : `${mockSecurity}/configs`

// 菜单栏
export const menuResource = userId =>
  process.env.buildEnv === 'prod'
    ? `//bucket-showyu.oss-cn-beijing.aliyuncs.com/console/menuResources.json`
    : `${mockSecurity}/users/${userId}/menuResources`

// 用户详情
export const userDetail = userId =>
  process.env.buildEnv === 'prod'
    ? '//bucket-showyu.oss-cn-beijing.aliyuncs.com/console/userDetail.json'
    : `${mockSecurity}/users/${userId}`
