/**
 * 动态路由信息
 * @author barret
 * @date 2019/05/02
 */
import {getAdminUser} from '@/service/spaas-enterprise-contact'
import {SPA_NAME} from '@/const/const'
import {getXpaasTag} from '@/service/deepexi-dashboard'
import {getUserMenuTree} from '@/const/api'
// import {getUserMenuTree} from '@/service/spaas-console-api'

export const state = () => ({
  thirdId: '',
  menuList: [],
  // 面包屑组件占位符
  breadcrumbPlaceholder: {}
})

export const mutations = {
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  },

  // 设置面包屑组件占位符
  // index 占位符位置
  // replaceTxt 占位符替换文本
  setBreadcrumbPlaces(state, payload) {
    if (!Array.isArray(payload)) {
      throw new Error('参数有误，请输入数组')
      return
    }

    // 临时保存占位符变量
    const placeholderTemp = state.breadcrumbPlaceholder

    payload.forEach(({index, replaceTxt}) => {
      if (!(+index >= 0)) {
        throw new Error('请输入正常的位置参数')
        return
      }
      placeholderTemp[`p${index}`] = replaceTxt
    })

    // 重新更新 breadcrumbPlaceholder
    Vue.set(state, 'breadcrumbPlaceholder', Object.assign({}, placeholderTemp))
  }
}

export const actions = {
  // 获取头部列表的thirdId
  async fetchThirdId({commit, dispatch}, {tenantId}) {
    let {payload} = await getAdminUser()
    const {thirdId} = payload || {}

    commit('update', {
      thirdId
    })

    try {
      const headMenu = await dispatch('fetchHeadMenu', {thirdId})

      // 根据当前的项目名称来请求左侧菜单
      for (let item of headMenu) {
        if (item.name === SPA_NAME) {
          dispatch('fetchUserMenuTree', {appId: item.id})
          break
        }
      }
    } catch (e) {
      console.error('fetchHeadMenu error: ', e)
    }
  },
  // 根据thirdId获取头部导航栏列表
  async fetchHeadMenu({commit, dispatch}, {thirdId}) {
    let headMenuListRes = await getXpaasTag({thirdId})
    const payload = headMenuListRes.payload || []
    commit('update', {
      headMenuList: payload
    })
    return payload
  },
  // 根据appId获取左侧菜单, 并设置当前的mainHead值
  async fetchUserMenuTree({commit}, {appId}) {
    let userMenuTreeRes = await getUserMenuTree({appId})
    const payload = userMenuTreeRes.payload || []
    // 获取路由对应的页面名

    commit('update', {
      menuList: payload
    })
  }
}

export const getters = {
  // 获取面包屑组件占位符
  getBreadcrumbPlaceholder: state => index => {
    if (!(+index >= 0)) {
      throw new Error('请输入正常的位置参数')
      return
    }
    return state.breadcrumbPlaceholder[`p${index}`]
  }
}
