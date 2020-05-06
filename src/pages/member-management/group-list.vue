<template>
  <el-data-table ref="groupTable" v-bind="tableConfig"></el-data-table>
</template>
<script>
import {groupColumns} from '@/const/member'
import {
  memberGroupList,
  enableGroup,
  disabledGroup,
  commonFindList,
  commonUpdateOne,
  commonDeleteOne
} from '@/const/api'
import {Tag} from 'element-ui'
import {formatDate} from '@/const/filter'

const ENABLE = 1
const DISABLE = 0

export default {
  name: 'group-list',
  data() {
    return {
      tableConfig: {
        url: commonFindList('memberGroup'),
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        operationAttrs: {
          width: '180px'
        },
        dataPath: 'payload',
        headerButtons: [
          {
            text: '新增',
            type: 'primary',
            atClick: row => {
              this.$router.push({
                path: 'group-add'
              })
              return Promise.resolve(false)
            }
          }
        ],
        tableAttrs: {border: true},
        extraButtons: [
          {
            text: '查看',
            type: 'primary',
            atClick: row => {
              this.$router.push({
                path: 'group-detail',
                query: {
                  id: row.id
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '编辑',
            atClick: row => {
              this.$router.push({
                path: 'group-add',
                query: {
                  id: row.id
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '启用',
            type: 'primary',
            show: row => row.memberGroup.status === DISABLE,
            atClick: row => {
              let obj = Object.assign({}, row.memberGroup)
              this.confirm(commonUpdateOne('memberGroup'), 'post', {
                update: {
                  memberGroup: Object.assign(obj, {
                    status: ENABLE
                  })
                },
                args: {
                  id: row.id
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '禁用',
            show: row => row.memberGroup.status === ENABLE,
            atClick: row => {
              let obj = Object.assign({}, row.memberGroup)
              this.confirm(commonUpdateOne('memberGroup'), 'post', {
                update: {
                  memberGroup: Object.assign(obj, {
                    status: DISABLE
                  })
                },
                args: {
                  id: row.id
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '删除',
            type: 'danger',
            show: row => row.memberGroup.status === DISABLE,
            atClick: row => {
              this.confirm(`${commonDeleteOne('memberGroup')}`, 'post', {
                id: parseInt(row.id)
              })
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {prop: 'memberGroup.name', label: '分组名称'},
          {
            prop: 'tagNames',
            label: '标签',
            width: '350',
            formatter: row => (
              <div>
                {row.memberGroupRuleList &&
                  row.memberGroupRuleList.logicRule
                    .filter((val, index) => index < 3)
                    .map((val, i) => {
                      return (
                        <el-tag key={i} class="mg-1" style="margin-right:5px;">
                          {val.label}
                        </el-tag>
                      )
                    })}
                {(() => {
                  if (
                    row.memberGroupRuleList &&
                    row.memberGroupRuleList.logicRule.length > 3
                  )
                    return (
                      <el-popover trigger="hover">
                        {row.memberGroupRuleList &&
                          row.memberGroupRuleList.logicRule
                            .filter((val, index) => index > 3)
                            .map((val, i) => {
                              return (
                                <el-tag
                                  key={i}
                                  class="mg-1"
                                  style="margin-right:5px;"
                                >
                                  {val.label}
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
          {
            prop: 'state',
            label: '状态',
            formatter: row => (row.memberGroup.status === 1 ? '启用' : '禁用')
          },
          {
            prop: 'creatTime',
            label: '创建时间',
            formatter: row => formatDate(row._id.time, 'YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
    }
  },
  methods: {
    confirm(id, method, data) {
      this.$confirm('确认当前操作吗', '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action == 'confirm') {
            instance.confirmButtonLoading = true
            this.$axios[method || '$post'](id, data)
              .then(resp => {
                if (resp.code !== '0') {
                  this.$message.warning(resp.msg)
                  return
                }
                this.$refs.groupTable.getList()
              })
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(er => {
        /*取消*/
      })
    }
  },
  components: {
    'el-tag': Tag
  }
}
</script>
