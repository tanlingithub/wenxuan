import {cellPhone, email as regEmail} from '@levy9527/pattern-js'
import {regInt} from '@/const/regexp.js'
import {formatDate} from '@/const/filter'
import {InputNumber} from 'element-ui'
import ElSelectArea from '@femessage/el-select-area'

const phone = (rule, value, callback) => {
  if (!cellPhone.test(value)) {
    callback(new Error('请输入正确的手机格式'))
  } else {
    callback()
  }
}

const sex = {
  0: '未知',
  1: '男',
  2: '女'
}

// 计算某个生日(时间戳格式)，计算出年龄
export const calcAgeByBirthday = ageTime => {
  let birthdayYear = new Date(ageTime).getFullYear()
  let nowYear = new Date().getFullYear()
  return nowYear - birthdayYear
}

// 会员列表查询form
export const memberSearchForm = [
  {
    $type: 'input',
    $id: 'account',
    label: '会员账号',
    $el: {placeholder: '请输入'}
  },
  {
    $type: 'select',
    $id: 'groupId',
    label: '所属分组',
    $el: {placeholder: '请输入'}
  },
  {
    $type: 'select',
    $id: 'state',
    label: '状态',
    $el: {placeholder: '请输入'},
    $options: [{label: '启用', value: '1'}, {label: '禁用', value: '0'}]
  },
  {
    $type: 'input',
    $id: 'mobile',
    label: '会员手机号',
    $el: {placeholder: '请输入'}
  }
]
/* 其他信息 */
export const otherInfoContent = [
  {
    $type: 'input',
    $id: 'des1',
    label: '扩展字段1',
    $el: {placeholder: '请输入'}
  },
  {
    $type: 'input',
    $id: 'des2',
    label: '扩展字段2',
    $el: {placeholder: '请输入'}
  },
  {
    $type: 'input',
    $id: 'des3',
    label: '扩展字段3',
    $el: {placeholder: '请输入'}
  },
  {
    $type: 'input',
    $id: 'des4',
    label: '扩展字段4',
    $el: {placeholder: '请输入'}
  }
]

/* 地址信息 */
export const addressContent = [
  {
    $type: 'input',
    $id: 'recive',
    label: '收货人',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请输入收货人', trigger: 'blur'}]
  },
  {
    $type: 'input',
    $id: 'contact',
    label: '联系方式',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请输入联系方式', trigger: 'blur'}]
  }
]

export const userContent = [
  {
    $type: 'input',
    $id: 'name',
    label: '姓名',
    $el: {placeholder: '请输入', maxlength: 15}
  },
  {
    $type: 'radio-group',
    $id: 'sex',
    label: '性别',
    $el: {placeholder: '请输入'},
    $default: '1',
    $options: [{label: '男', value: '1'}, {label: '女', value: '2'}]
  },
  {
    $id: 'birth',
    $type: 'date-picker',
    label: '生日',
    $el: {
      // type: 'daterange',   // 如果 type 为 daterange，则获取到的是一个数组
      placeholder: '请选择',
      valueFormat: 'timestamp',
      pickerOptions: {
        disabledDate: val => {
          console.val
          return val > new Date().getTime()
        }
      }
    },
    atChange: (id, val) => {
      let age = calcAgeByBirthday(val)
      this.$refs.userForm.updateForm({age: age})
    }
  },
  {
    $type: 'input-number',
    component: InputNumber,
    $id: 'age',
    label: '年龄',
    $el: {placeholder: '请输入', max: 999, min: 0, precision: 0}
  },
  {
    $type: 'input',
    $id: 'job',
    label: '职业',
    $el: {placeholder: '请输入', maxlength: 15}
  },
  {
    $type: 'input',
    $id: 'wechat',
    label: '微信',
    $el: {placeholder: '请输入', maxlength: 20}
  },
  {
    $type: 'input',
    $id: 'email',
    label: '邮箱',
    $el: {placeholder: '请输入', maxlength: 20},
    rules: [
      {
        trigger: 'blur',
        validator: validEmail
      }
    ]
  },
  {
    $type: 'input',
    $id: 'qq',
    label: 'QQ',
    $el: {placeholder: '请输入', maxlength: 20},
    rules: [
      {
        trigger: 'blur',
        validator: validQQ
      }
    ]
  },
  {
    label: '所在地区',
    $id: 'area',
    $type: 'ElSelectArea',
    $default: [],
    component: ElSelectArea,
    outputFormat: val => {
      if (!val) return {}

      return {
        provinces: val[0],
        city: val[1],
        district: val[2]
      }
    }
  },
  {
    label: '详细地址',
    $id: 'location',
    $type: 'input',
    $el: {
      type: 'textarea',
      maxlength: 30
    }
  }
]

// 账号信息form项
export const accountContent = [
  {
    $type: 'input',
    $id: 'account',
    label: '会员账号',
    $el: {placeholder: '请输入', maxlength: 15},
    rules: [{required: true, message: '请输入会员账号', trigger: 'blur'}]
  },
  {
    $type: 'input',
    $id: 'mobile',
    label: '手机号',
    $el: {placeholder: '请输入'},
    rules: [
      {
        message: '请输入正确的手机号码',
        trigger: 'blur',
        required: true
      },
      {validator: phone, trigger: 'blur'}
    ]
  },
  {
    $type: 'radio-group',
    $id: 'state',
    label: '状态',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请选择状态', trigger: 'blur'}],
    $default: '0',
    $options: [{label: '启用', value: '1'}, {label: '禁用', value: '0'}]
  },
  {
    $type: 'input',
    $id: 'nickName',
    label: '昵称',
    $el: {placeholder: '请输入', maxlength: 15}
  }
]

/* 会员证件信息证件类型 */
export const CARDTYPE = [
  {
    label: '身份证',
    value: '0'
  },
  {
    label: '护照',
    value: '1'
  },
  {
    label: '港澳台通行证',
    value: '2'
  },
  {
    label: '驾驶证',
    value: '3'
  },
  {
    label: '其他证件',
    value: '4'
  }
]
/* 会有证件列表 */
export const cardContent = [
  {
    $type: 'select',
    $id: 'state',
    label: '证件类型',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请选择状态', trigger: 'blur'}],
    $options: CARDTYPE
  },
  {
    $type: 'input',
    $id: 'mobile',
    label: '证件号码',
    $el: {placeholder: '请输入'},
    rules: [
      {
        message: '请输入正确的证件号码',
        trigger: 'blur',
        required: true,
        max: 21
      }
    ]
  }
]

// 个人信息form项 (因this指向问题，弃用 ,0190329)
// export const userContent = [
//   {
//     $type: 'input',
//     $id: 'name',
//     label: '姓名',
//     $el: {placeholder: '请输入', maxlength: 15}
//   },
//   {
//     $type: 'radio-group',
//     $id: 'sex',
//     label: '性别',
//     $el: {placeholder: '请输入'},
//     $default: '0',
//     $options: [{label: '男', value: '0'}, {label: '女', value: '1'}]
//   },
//   {
//     $id: 'birth',
//     $type: 'date-picker',
//     label: '生日',
//     $el: {
//       // type: 'daterange',   // 如果 type 为 daterange，则获取到的是一个数组
//       placeholder: '请选择',
//       valueFormat: 'timestamp'
//     }
//   },
//   {
//     $type: 'input-number',
//     component: InputNumber,
//     $id: 'age',
//     label: '年龄',
//     $el: {placeholder: '请输入', max: 999, min: 1, precision: 0}
//   },
//   {
//     $type: 'input',
//     $id: 'job',
//     label: '职业',
//     $el: {placeholder: '请输入', maxlength: 15}
//   },
//   {
//     $type: 'input',
//     $id: 'wechat',
//     label: '微信',
//     $el: {placeholder: '请输入', maxlength: 20}
//   },
//   {
//     $type: 'input',
//     $id: 'email',
//     label: '邮箱',
//     $el: {placeholder: '请输入', maxlength: 20}
//   },
//   {
//     $type: 'input',
//     $id: 'qq',
//     label: 'QQ',
//     $el: {placeholder: '请输入', maxlength: 20}
//   }
// ]
// 会员excel模版
export const excelStencil = [
  {prop: 'account', label: '会员账号'},
  {prop: 'mobile', label: '会员手机号'},
  {prop: 'state', label: '状态(启用,禁用)'}
]

/* 积分明细 */
export const pointsDetailsColoums = [
  {prop: 'changeTime', label: '积分变动时间'},
  {prop: 'changeType', label: '积分变动类型'},
  {prop: 'changeNumber', label: '积分变动数值'},
  {prop: 'changeReason', label: '变动原因'},
  {prop: 'remainingPoints', label: '剩余积分'}
]

/* 消费记录 */
export const expensesRecordColoums = [
  {prop: 'consumptionTime', label: '消费时间'},
  {prop: 'productNumber', label: '商品编号'},
  {prop: 'productName', label: '商品名称'},
  {prop: 'amountGoods', label: '商品金额'}
]

/* 卡券明细 */
export const couponDetailsColoums = [
  {prop: 'validityPeriod', label: '有效期'},
  {prop: 'cardType', label: '卡券类型'},
  {prop: 'cardName', label: '卡券名称'},
  {prop: 'cardNumber', label: '卡券面额'},
  {prop: 'cardOrigin', label: '卡券来源'},
  {prop: 'pickTime', label: '领取时间'}
]

// 导出模版
export const exportExcelStencil = [
  {prop: 'account', label: '会员账号'},
  {prop: 'mobile', label: '会员手机号'},
  {prop: 'state', label: '状态(启用,禁用)'},
  {prop: 'nickName', label: '昵称'},
  {prop: 'name', label: '姓名'},
  {prop: 'sex', label: '性别'},
  {prop: 'age', label: '年龄'},
  {prop: 'birth', label: '生日'},
  {prop: 'job', label: '工作'},
  {prop: 'wechat', label: '微信'},
  {prop: 'email', label: '邮箱'},
  {prop: 'qq', label: 'QQ'},
  {prop: 'provinces', label: '省份'},
  {prop: 'city', label: '城市'},
  {prop: 'district', label: '地区'},
  {prop: 'location', label: '详细地址'}
]
// 会员分组列
export const groupColumns = [
  {prop: 'name', label: '分组名称'},
  {
    prop: 'tagNames',
    label: '标签',
    width: '350',
    formatter: row => (
      <div>
        {row.tagNames
          .filter((val, index) => index < 3)
          .map((val, i) => {
            return (
              <el-tag key={i} class="mg-1" style="margin-right:5px;">
                {val}
              </el-tag>
            )
          })}
        {(() => {
          if (row.tagNames.length > 3)
            return (
              <el-popover trigger="hover">
                {row.tagNames
                  .filter((val, index) => index > 3)
                  .map((val, i) => {
                    return (
                      <el-tag key={i} class="mg-1">
                        {val}
                      </el-tag>
                    )
                  })}
                <span slot="reference">···</span>
              </el-popover>
            )
        })()}
      </div>
    )
  },
  {prop: 'state', label: '状态'},
  {
    prop: 'creatTime',
    label: '创建时间',
    formatter: row => formatDate(row.creatTime, 'YYYY-MM-DD HH:mm:ss')
  }
]
// 新增分组content
export const addGroupContent = [
  {
    $type: 'input',
    $id: 'name',
    label: '分组名称',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请输入分组名称', trigger: 'blur'}]
  },
  {
    $type: 'input',
    $id: 'name',
    label: '分组描述',
    $el: {placeholder: '请输入', type: 'textarea'}
  },
  {
    $type: 'radio-group',
    $id: 'state',
    label: '状态',
    $el: {placeholder: '请输入'},
    rules: [{required: true, message: '请选择状态', trigger: 'blur'}],
    $default: '0',
    $options: [{label: '启用', value: '0'}, {label: '禁用', value: '1'}]
  }
]

// 会员详情信息
export const infoCell = [
  {key: 'name', label: '姓名'},
  {
    key: 'sex',
    label: '性别',
    formatter: row => sex[row.sex]
  },
  {
    key: 'birth',
    label: '生日',
    formatter: row => formatDate(row.createdAt, 'YYYY-MM-DD')
  },
  {key: 'age', label: '年龄'},
  {key: 'job', label: '职业'},
  {key: 'wechat', label: '微信'},
  {key: 'qq', label: 'QQ'},
  {key: 'email', label: '邮箱'},
  {key: 'location', label: '联系地址'}
]

// 导入key/value
export const importExcelKey = {
  account: '会员账号',
  mobile: '会员手机号',
  state: '状态(启用,禁用)'
}

export const chartModule = (type, rows) => {
  return {
    type,
    settings: {type: 'histogram'},
    columns: ['key', 'value'],
    rows
  }
}

// 会员分组画像
export const groupDataColumns = [
  {
    type: 'sex',
    settings: {type: 'histogram'},
    columns: ['key', 'value'],
    rows: [
      {
        key: '男',
        value: 1393
      },
      {
        key: '女',
        value: 3900
      }
    ]
  },
  {
    type: 'age',
    settings: {type: 'histogram'},
    columns: ['key', 'value'],
    rows: [
      {
        key: '18岁以下',
        value: 1393
      },
      {
        key: '19-23',
        value: 100
      },
      {
        key: '24-28',
        value: 1230
      },
      {
        key: '29-33',
        value: 750
      },
      {
        key: '34-38',
        value: 1750
      },
      {
        key: '39-48',
        value: 2750
      },
      {
        key: '48岁以上',
        value: 1750
      }
    ]
  },
  {
    type: 'ageInterval',
    settings: {type: 'histogram'},
    columns: ['key', 'value'],
    rows: [
      {
        key: '60后',
        value: 1393
      },
      {
        key: '70后',
        value: 3900
      },
      {
        key: '80后',
        value: 1693
      },
      {
        key: '90后',
        value: 4393
      },
      {
        key: '00后',
        value: 3393
      }
    ]
  },
  {
    type: 'constellation',
    settings: {type: 'histogram'},
    columns: ['key', 'value'],
    rows: [
      {
        key: '白羊座',
        value: 1393
      },
      {
        key: '金牛座',
        value: 3900
      },
      {
        key: '双子座',
        value: 1693
      },
      {
        key: '巨蟹座',
        value: 4393
      },
      {
        key: '狮子座',
        value: 2393
      },
      {
        key: '处女座',
        value: 7393
      },
      {
        key: '天秤座',
        value: 2293
      },
      {
        key: '天蝎座',
        value: 9393
      },
      {
        key: '射手座',
        value: 2113
      },
      {
        key: '摩羯座',
        value: 3393
      },
      {
        key: '水瓶座',
        value: 5393
      },
      {
        key: '双鱼座',
        value: 3793
      }
    ]
  }
]

// 表单校验-邮箱-非必填
export const validEmail = (rule, value, callback) => {
  if (value && !regEmail.test(value)) {
    return callback(new Error('请输入正确的邮箱'))
  }
  callback()
}

// 表单校验-QQ-非必填
export const validQQ = (rule, value, callback) => {
  if (value && !regInt(5, 20).test(value)) {
    return callback(new Error('请输入正确的QQ(5-20位数字)'))
  }
  callback()
}
