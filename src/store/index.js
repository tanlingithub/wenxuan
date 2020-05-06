import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'
import {userInfoApi, mockServer} from '@/const/api'

import {loginByUsername} from '@/service/spaas-enterprise-contact'

import {formatData} from '@/utils/breadcrumb'
import {commonList} from '@/const/api'

const cookiePath = process.env.COOKIE_PATH

const BASE_PAGE = [
  {
    name: '首页',
    url: '/'
  }
]

export const state = () => ({
  userId: '',
  token: '',
  tenantId: '',
  username: '',
  user: {
    userId: '16e577069ac44399b73d45e2acbf3b66',
    id: '16e577069ac44399b73d45e2acbf3b66',
    tenantId: '620e80bfd862423d9299620038f94a45',
    createdBy: null,
    createdAt: 946656000000,
    updatedBy: 'mifei',
    updatedAt: 1548300528000,
    dr: 0,
    accountId: '798b9812d3f4408e83b9399d09d1758c',
    password: null,
    token: null,
    username: 'miffy',
    usernumber: null,
    nickname: '米肥',
    email: 'mi_ffy@yeah.net',
    avatar:
      '//deepexi-moby.oss-cn-shenzhen.aliyuncs.com/me的副本-1545201407351.jpg',
    gender: null,
    phone: '15521198999',
    status: '1',
    type: '1',
    ext1: null,
    ext2: null,
    ext3: null,
    ext4: null,
    ext5: null,
    extJson: null,
    roles: []
  },
  menuList: [
    {
      id: 91939,
      parentId: null,
      name: '会员管理',
      nameEn: 'member-list',
      url: '',
      remark: null,
      icon:
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
      sort: 149,
      tag: 'system'
    },
    {
      id: 91940,
      parentId: null,
      name: '订单管理',
      nameEn: 'order-list',
      url: '',
      remark: null,
      icon:
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
      sort: 150,
      tag: 'system'
    },
    {
      id: 91942,
      parentId: null,
      name: '周年庆',
      nameEn: 'anniversary',
      url: '',
      remark: null,
      icon:
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
      sort: 152,
      tag: 'system'
    },
    {
      id: 91943,
      parentId: null,
      name: '资讯管理',
      nameEn: 'article',
      url: '',
      remark: null,
      icon: '',
      sort: 153,
      tag: 'system',
      children: [
        {
          id: 919431,
          parentId: 91943,
          name: '文章列表',
          nameEn: 'articleList',
          url: '',
          remark: null,
          icon: '',
          sort: 0,
          tag: 'system',
          children: null,
          operators: ['GET'],
          projectNo: null
        },
        {
          id: 919432,
          parentId: 91943,
          name: '分类管理',
          nameEn: 'articleCategory',
          url: '',
          remark: null,
          icon: '',
          sort: 0,
          tag: 'system',
          children: null,
          operators: ['GET'],
          projectNo: null
        },
        {
          id: 919433,
          parentId: 91944,
          name: '奖励规则',
          nameEn: 'articleRewardList',
          url: '',
          remark: null,
          icon: '',
          sort: 0,
          tag: 'system',
          children: null,
          operators: ['GET'],
          projectNo: null
        }
      ],
      operators: ['GET']
    },
    {
      id: 91946,
      parentId: null,
      name: '数据中心',
      nameEn: 'data-center',
      url: '',
      remark: null,
      icon:
        'https://bucket-showyu.oss-cn-beijing.aliyuncs.com/console/icon/data.svg',
      sort: 150,
      tag: 'system'
    }
  ],
  permission: {},
  segmentInfo: [
    {
      _id: {
        timestamp: 1562744178,
        machineIdentifier: 10855233,
        processIdentifier: 1012,
        counter: 11643469,
        date: 1562744178000,
        time: 1562744178000,
        timeSecond: 1562744178
      },
      usedSegment: 4,
      usedSolidNum: 7,
      segementID: 1562733511416,
      segmentsNum: 99999970,
      cardType: '礼品卡',
      cardMedium: '电子卡',
      starCardNumber: 'LPKST00104',
      updataAt: 1562758761733,
      cardNumFirst: 104,
      createdAt: 1562744178174,
      cardSegmentNumber: 'LPKDZ0000000000010-LPKDZ9999999999999',
      id: 1562744178000,
      cardNumLength: 18,
      cardNumFront: 'LPKDZ',
      lastCardNumber: 'LPKST00103',
      firstCardNumber: 'LPKST00100',
      solidCardScope: 'LPKST00100-LPKST00103',
      startByCard: 'LPKST00100'
    },
    {
      _id: {
        timestamp: 1562744273,
        machineIdentifier: 10855233,
        processIdentifier: 1012,
        counter: 11643470,
        date: 1562744273000,
        time: 1562744273000,
        timeSecond: 1562744273
      },
      usedSegment: 4,
      usedSolidNum: 7,
      segementID: 1562733511416,
      segmentsNum: 99999970,
      cardType: '礼品卡',
      cardMedium: '实体卡',
      starCardNumber: 'LPKST00104',
      updataAt: 1562758761733,
      cardNumFirst: 104,
      createdAt: 1562744273622,
      cardSegmentNumber: 'LPKST00100-LPKST99999',
      id: 1562744273000,
      cardNumLength: 10,
      cardNumFront: 'LPKST',
      lastCardNumber: 'LPKST00103',
      firstCardNumber: 'LPKST00100',
      solidCardScope: 'LPKST00100-LPKST00103',
      startByCard: 'LPKST00100'
    },
    {
      _id: {
        timestamp: 1562749035,
        machineIdentifier: 10855233,
        processIdentifier: 1012,
        counter: 11643475,
        date: 1562749035000,
        time: 1562749035000,
        timeSecond: 1562749035
      },
      usedSegment: 0,
      usedSolidNum: 0,
      segementID: 1562749034850,
      segmentsNum: 99989,
      cardType: '储值卡',
      cardMedium: '电子卡',
      starCardNumber: 'CZKDZ00010',
      updataAt: 1562749034845,
      cardNumFirst: '10',
      createdAt: 1562749034845,
      cardSegmentNumber: 'CZKDZ00010-CZKDZ99999',
      id: 1562749034000,
      cardNumLength: 10,
      cardNumFront: 'CZKDZ'
    },
    {
      _id: {
        timestamp: 1562758095,
        machineIdentifier: 3100372,
        processIdentifier: 22197,
        counter: 2698005,
        date: 1562758095000,
        time: 1562758095000,
        timeSecond: 1562758095
      },
      usedSegment: 4,
      usedSolidNum: 4,
      segementID: 1562758095498,
      segmentsNum: 99995,
      cardType: '储值卡',
      cardMedium: '实体卡',
      starCardNumber: 'CZKST00004',
      updataAt: 1562758753531,
      cardNumFirst: 4,
      createdAt: 1562758095498,
      cardSegmentNumber: 'CZKST00000-CZKST99999',
      id: 1562758095000,
      cardNumLength: 10,
      cardNumFront: 'CZKST',
      lastCardNumber: 'CZKST00003',
      firstCardNumber: 'CZKST00000',
      solidCardScope: 'CZKST00000-CZKST00003',
      startByCard: 'CZKST00000'
    }
  ],
  cardData: [
    {
      cardType: '储值卡',
      cardMedium: '实体卡',
      cardNumber: 'CZKST00000',
      createdAt: 1562758753527,
      cardID: 1562758753527,
      cardState: '付印'
    },
    {
      cardType: '储值卡',
      cardMedium: '实体卡',
      cardNumber: 'CZKST00001',
      createdAt: 1562758753528,
      cardID: 1562758753529,
      cardState: '付印'
    },
    {
      cardType: '储值卡',
      cardMedium: '实体卡',
      cardNumber: 'CZKST00002',
      createdAt: 1562758753529,
      cardID: 1562758753531,
      cardState: '备用'
    },
    {
      cardType: '储值卡',
      cardMedium: '实体卡',
      cardNumber: 'CZKST00003',
      createdAt: 1562758753530,
      cardID: 1562758753533,
      cardState: '备用'
    },
    {
      cardType: '礼品卡',
      cardMedium: '实体卡',
      cardNumber: 'LPKST00100',
      createdAt: 1562758761728,
      cardID: 1562758761828,
      cardState: '付印'
    },
    {
      cardType: '礼品卡',
      cardMedium: '实体卡',
      cardNumber: 'LPKST00101',
      createdAt: 1562758761729,
      cardID: 1562758761830,
      cardState: '付印'
    },
    {
      cardType: '礼品卡',
      cardMedium: '实体卡',
      cardNumber: 'LPKST00102',
      createdAt: 1562758761730,
      cardID: 1562758761832,
      cardState: '备用'
    },
    {
      cardType: '礼品卡',
      cardMedium: '实体卡',
      cardNumber: 'LPKST00103',
      createdAt: 1562758761732,
      cardID: 1562758761835,
      cardState: '备用'
    }
  ],
  couponData: [
    {
      couponID: 1562757617917,
      validityTerm: 3,
      writeOffMethod: 3,
      effectTiem: '',
      effectiveTiem: '',
      value4: '',
      cardType: '礼品卡',
      couponState: '启用',
      grantNum: 0,
      notes: '200元礼品卡',
      instructions: '200元礼品卡',
      useRestrictions: '无门槛',
      stockNum: 0,
      headImg: '',
      logoImg: '',
      applyStore: ['门店一'],
      shopScope: ['雾都孤儿'],
      couponName: '200元礼品卡',
      cardValue: '200',
      cardPrice: '190'
    }
  ],
  routePath: '/',
  breadCrumbList: [],
  routerTree: null
})

export const mutations = {
  login(state, payload) {
    cookieKeys.forEach(key => {
      state[key] = payload[key]
      cookie.set(key, payload[key], {
        path: cookiePath
      })
    })
  },
  logout(state) {
    cookieKeys.forEach(key => {
      state[key] = ''
      cookie.remove(key, {
        path: cookiePath
      })
    })
    this.$router.replace('/login')
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  },
  addSegment(state, data) {
    state.segmentInfo.push(data)
  },
  initSegment(state, data) {
    state.segmentInfo = data
  },
  updateSegment(state, data) {
    state.segmentInfo.map(item => {
      if (item.segementID == data.segementID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  },
  addCardData(state, data) {
    state.cardData.push.apply(state.cardData, data)
  },
  updateCardData(state, data) {
    state.cardData.map(item => {
      if (item.cardID == data.cardID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  },
  changeCardState(state, ids) {
    state.cardData.map(item => {
      if (ids.indexOf(item.cardID) > -1) {
        item.cardState = '付印'
      }
    })
  },
  addcouponData(state, data) {
    state.couponData.push(data)
  },
  updateCouponData(state, data) {
    state.couponData.map(item => {
      if (item.couponID == data.couponID) {
        Object.keys(data).forEach(k => {
          item[k] = data[k]
        })
      }
    })
  }
}

export const actions = {
  async fetchUserAndMenuList({commit, dispatch}, {userId}) {
    let user = await this.$axios.$get(`${userInfoApi}?id=${userId}`)

    commit('update', {user: user.payload || {}})

    let menuResources = await this.$axios.$get(
      `${mockServer}/users/${userId}/menuResources`
    )
    if (!menuResources.payload)
      menuResources.payload = {
        menu: [],
        permission: {}
      }

    commit('update', {
      menuList: menuResources.payload.menu,
      permission: menuResources.payload.permission
    })

    dispatch('updateBreadcrumd', menuResources.payload.menu)
  },
  // 用户名账号登录
  async loginByUsername({commit, dispatch}, userInfo) {
    try {
      // const res = await loginByUsername(userInfo)
      const res = await this.$axios.$post(
        `/spaas-console-api/api/v1/users/login`,
        userInfo
      )

      const data = res.payload

      commit('login', data)

      // commit('update', {user: data})
      // dispatch('permission/fetchThirdId', {tenantId: data.tenantId}
      dispatch('fetchUserAndMenuList', {userId: data.userId})
      return data
    } catch (err) {
      return err
    }
  },
  updateBreadcrumd({commit, route, state}) {
    if (!state.routerTree && state.menuList.length > 0) {
      // 处理一次 缓存起来
      commit('update', {
        routerTree: formatData(state.menuList)
      })
    }

    try {
      commit('update', {
        breadCrumbList: [
          ...BASE_PAGE,
          ...(state.routerTree[state.routePath] || [])
        ]
      })
    } catch (e) {
      commit('update', {
        breadCrumbList: [...BASE_PAGE]
      })
    }
  },
  getSegmentList({commit}, data) {
    this.$axios.get(`${commonList}?collection=segments`).then(res => {
      // commit('initSegment', res.data.payload || [])
    })
  }
}
