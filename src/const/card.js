/* 卡券详情字段 */
export const cardDetail = {
  cardMedium: '卡类型',
  couponName: '卡券名称',
  upperTiem: '发放日期',
  cardValue: '卡面额',
  cardPrice: '售价',
  applyStore: '通用门店',
  shopScope: '可用商品范围',
  useRestrictions: '使用条件',
  notes: '折扣'
}
/* 卡券发放门店搜索colums */
export const cardShareColums = [
  {prop: 'cardNumber', label: '卡券号'},
  {prop: 'grantStore', label: '发放门店'}
]

/* 卡券商城分发渠道 */
export const cardShareStoreColums = [
  {prop: 'cardNumber', label: '卡券号'},
  {prop: 'channel', label: '发放渠道'}
]

/* 卡券发放门店详情colums */
export const storeDetailColums = [
  {
    type: 'index',
    label: '序号',
    width: 100
  },
  {
    prop: 'cardNumber',
    label: '卡号'
  },
  {
    prop: 'availBalance',
    label: '当前可用余额'
  },
  {
    prop: 'status',
    label: '状态'
  },
  {
    prop: 'consumptionNumber',
    label: '消费次数'
  },
  {
    prop: 'validTime',
    label: '有效日期'
  },
  {
    prop: 'lastConsumptionTime',
    label: '最后一次消费时间'
  }
]
