/**
 * 这个文件主要存储字典数据。如性别的字典，命名方式为全大写下划线分割单词
 * @author barret
 * @date 2019/05/01
 */
// 性别
export const SEX_LIST = [
  {
    label: '未知',
    value: 0
  },
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  }
]

//状态
export const STATUS_LIST = [
  {
    label: '无效',
    value: '0'
  },
  {
    label: '有效',
    value: '1'
  }
]

//是否
export const WHETTHER = [
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
]

//商品属性类型
export const ATTRIBUTE_TYPES = [
  {
    label: '无',
    value: '0'
  },
  {
    label: '关键属性',
    value: '1'
  },
  {
    label: '销售属性',
    value: '2'
  },
  {
    label: '非关键属性',
    value: '3'
  }
]

// 输入方式
export const INPUT_TYPE = [
  {
    label: '枚举选择',
    value: 1
  },
  {
    label: '填写',
    value: 2
  }
]
