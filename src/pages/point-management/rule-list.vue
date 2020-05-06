<template>
  <div class="channel-list">
    <el-data-table
      ref="dataTable"
      v-bind="tableConfig"
      data-path="payload"
      :customQuery="customQuery"
    ></el-data-table>
  </div>
</template>
<script>
const STATUS_EUM = {
  true: '开启',
  false: '关闭'
}

const DISABLED_TEXT = {
  enable: '启用',
  disable: '禁用'
}

import {formatDate} from '@/const/filter'
import {preComfirm, noVoidMsg} from '@/const/point-management'
import {
  pointRulesList,
  pointRulesDisabled,
  commonList,
  commonDelete
} from '@/const/api'
export default {
  name: 'channel-list',
  components: {},
  data() {
    return {
      customQuery: {},
      tableConfig: {
        // dataTable配置
        url: commonList + '?collection=ruleDetail',
        hasNew: false,
        hasView: false,
        hasEdit: false,
        hasDelete: false,
        operationAttrs: {
          width: '240px',
          fixed: 'right'
        },
        tableAttrs: {border: true},
        headerButtons: [
          {
            text: '新增',
            type: 'primary',
            show: row => true,
            atClick: () => this.editAndLook('new', null),
            icon: 'el-icon-plus'
          }
        ],
        extraButtons: [
          {
            text: '查看',
            type: 'text',
            show: row => true,
            atClick: row => this.editAndLook('view', row.id)
          },
          {
            text: '编辑',
            type: 'text',
            show: row => true,
            atClick: row => this.editAndLook('eidt', row.id)
          },
          {
            text: '启用',
            type: 'text',
            atClick: async row => {
              const res = this.handleIsEnable('enable', row.id)
              return Promise.resolve(res)
            }
          },
          {
            text: '禁用',
            type: 'text',
            atClick: async row => {
              const res = this.handleIsEnable('disable', row.id)
              return Promise.resolve(res)
            }
          },
          {
            text: '删除',
            type: 'text',
            atClick: async row => {
              const res = await this.handleDelete(row.id)
              return Promise.resolve(res)
            }
          }
        ],
        columns: [
          {
            prop: 'ruleName',
            label: '规则名称',
            minWidth: 130
          },
          {
            prop: 'ruleDescrip',
            label: '关联基础任务',
            minWidth: 80
          },
          {
            prop: 'pointValue',
            label: '积分值',
            width: 75
          },
          {
            prop: 'isLock',
            label: '是否锁定',
            formatter: row => (row.isLock ? '是' : '否'),
            width: 80
          },
          {
            prop: 'lockPoint',
            label: '状态',
            formatter: row => STATUS_EUM[row.lockPoint],
            width: 60
          },
          {
            prop: 'creatTime',
            label: '创建时间',
            formatter: row => formatDate(row.createdAt),
            minWidth: 110
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'rulName',
            label: '规则名称',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'select',
            $id: 'status',
            label: '状态',
            $default: '',
            $el: {
              placeholder: '请选择'
            },
            $options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '开启',
                value: '1'
              },
              {
                label: '关闭',
                value: '0'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    async handleDelete(id) {
      const pramas = {
        content: '确认删除吗',
        successMsg: '删除成功',
        errorMsg: '删除失败'
      }
      pramas.callFunc = () => {
        // return this.$axios.$delete(`${pointRulesList}?${id}`)
        return this.$axios.$post(commonDelete + `?collection=ruleDetail`, {id})
      }
      return noVoidMsg.call(this, pramas)
    },
    async handleIsEnable(type, id) {
      const text = DISABLED_TEXT[type]
      const pramas = {
        content: `确认${text}吗`,
        successMsg: `${text}成功`,
        errorMsg: `${text}失败`
      }
      pramas.callFunc = () => {
        return this.$axios.$post(pointRulesDisabled, {
          type: type == 'enable' ? 0 : 1,
          id: 0
        })
      }
      return noVoidMsg.call(this, pramas)
    },
    editAndLook(type = 'new', id = null) {
      const obj = {
        path: 'rule-detail',
        query: {type, id}
      }
      !id && delete obj.query['id']
      this.$router.push(obj)
      return Promise.resolve(false)
    }
  }
}
</script>
