import {activityGoodsPageApi} from '@/const/api'
import {regInt} from '@/const/regexp.js'

export const discountVaild = (rule, value, callback) => {
  if (!/^[1-9]{1}(\.[0-9])?$/.test(value)) {
    callback(new Error('折扣券格式不正确，正确格式为1~9.9'))
  } else {
    callback()
  }
}

export const faceVaild = (rule, value, callback) => {
  if (!/^[1-9][0-9]{0,4}(\.[0-9])?$/.test(value)) {
    callback(new Error('代金券面值格式不正确，正确格式为1~99999.9'))
  } else {
    callback()
  }
}

export const amountVaild = regInt(1, 5)
export const suitAbleConfig = {
  url: activityGoodsPageApi,
  hasOperation: false,
  hasNew: false,
  hasDelete: false,
  searchForm: [
    {
      $type: 'input',
      $id: 'name',
      label: '商品名称',
      $el: {placeholder: '请输入'}
    }
  ]
}

const ORDER_STATUS_SEARCH = {
  ACTIVITY_COMPLETED: '已成团',
  'ACTIVITY_TOBEPAID_TO_COMPLETE,ACTIVITY_PAID_TO_COMPLETE': '待成团',
  ACTIVITY_CANNELLED: '已取消',
  '': '全部'
}

const ORDER_STATUS = {
  ACTIVITY_COMPLETED: '已成团',
  ACTIVITY_TOBEPAID_TO_COMPLETE: '待成团', // 未支付待成团
  ACTIVITY_PAID_TO_COMPLETE: '待成团', // 已支付待成团
  ACTIVITY_CANNELLED: '已取消',
  '': '全部'
}

/* 活动订单columns */
export const ACTIVITYORDERCOLOUMS = [
  {
    prop: 'shopDetail',
    label: '商品',
    width: 300
  },
  {
    prop: 'productLineNmae',
    label: '单价/数量'
  },
  {
    prop: 'productLineCode',
    label: '收货信息',
    width: 150
  },
  {
    prop: 'bigType',
    label: '实付金额'
  },
  {
    prop: 'middleType',
    label: '下单时间'
  },
  {
    prop: 'payOrderId',
    label: '支付单号'
  },
  {
    prop: 'hspTradeOrderId',
    label: '订单编号'
  },
  {
    prop: 'hspTradeOrderActivityId',
    label: '团活动编号',
    width: 110
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    formatter: row => ORDER_STATUS[row.hspTradeOrder.activityStatus]
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right'
  }
]

/* 活动订单搜索form */
export const ACTIVITYORDERFORM = [
  {
    $type: 'input',
    $id: 'id',
    label: '订单编号',
    $el: {
      placeholder: '请输入'
    }
  },
  {
    $type: 'input',
    $id: 'memberPhone',
    label: '手机号',
    $el: {
      placeholder: '请手机号'
    }
  },
  {
    $type: 'select',
    $id: 'activityStatus',
    label: '订单状态',
    $el: {
      placeholder: '请选择'
    },
    $options: Object.keys(ORDER_STATUS_SEARCH).map(el => {
      return {
        label: ORDER_STATUS_SEARCH[el],
        value: `${el}`
      }
    })
  }
]
