<template>
  <div class="user-list">
    <el-upload
      ref="upload"
      hidden
      :before-upload="handleUpload"
      action="default"
    >
      <button ref="button" slot="trigger"></button>
    </el-upload>
    <el-data-table ref="memberTable" v-bind="tableConfig"> </el-data-table>
    <el-dialog
      :visible.sync="importVisible"
      title="批量导入会员"
      @close="getList"
    >
      <!-- <h3>恭喜您，成功导入{{ importExcelObj.successNum }}条数据</h3> -->
      <h3>恭喜您，成功导入数据</h3>
      <!-- <p>
        导入失败{{ importExcelObj.failNum }}条数据，<span
          class="text-blue"
          @click="exportExcel(importExcelObj.vos)"
          >下载错误数据</span
        >
      </p> -->
    </el-dialog>
    <el-dialog :visible.sync="exportVisible" title="请输入导出的数据范围">
      <div class="content-pd">
        <label>日期：</label>
        <el-date-picker
          v-model="exportTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <template slot="footer">
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="exportExcel()"
          :loading="exportLoading"
          >确定</el-button
        >
      </template>
    </el-dialog>
    <el-dialog :visible.sync="importMethodVisible" title="批量导入会员">
      <el-button @click="downloadExcel">下载excel模版</el-button>
      <el-button type="primary" @click="$refs.button.click()"
        >直接导入</el-button
      >
    </el-dialog>
  </div>
</template>
<script>
import {
  memberSearchForm,
  importExcelKey,
  excelStencil,
  exportExcelStencil
} from '@/const/member'
import ExportExcel from '@/components/export-excel'
import {importExcel} from '@/components/import-excel'
import {
  memberList,
  disabledMember,
  enableMember,
  memberGroupList,
  importMember,
  exportMember,
  commonFindList,
  commonUpdateOne,
  commonDeleteOne,
  commonAddMany
} from '@/const/api'
import {formatDate} from '@/const/filter'
import {Tag, Upload, DatePicker, Popover} from 'element-ui'

const ENABLE = '1'
const DISABLE = '0'

export default {
  name: 'member-list',
  components: {
    'el-tag': Tag,
    'el-upload': Upload,
    'el-date-picker': DatePicker,
    'el-popover': Popover
  },
  data() {
    return {
      importVisible: false,
      importMethodVisible: false,
      importExcelObj: {},
      exportTime: '',
      exportVisible: false,
      exportLoading: false,
      tableConfig: {
        url: commonFindList('menberInfo'),
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        dataPath: 'payload',
        operationAttrs: {
          width: '250px',
          fixed: 'right'
        },
        headerButtons: [
          {
            text: '新增',
            type: 'primary',
            atClick: () => {
              this.$router.push({
                path: '/member-management/add'
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '批量导入会员信息',
            atClick: () => {
              this.importMethodVisible = true
              return Promise.resolve(false)
            }
          },
          {
            text: '批量导出',
            atClick: () => {
              this.exportVisible = true
              return Promise.resolve(false)
            }
          }
        ],
        tableAttrs: {border: true},
        extraButtons: [
          {
            text: '详情',
            type: 'primary',
            atClick: row => {
              this.$router.push({
                path: '/member-management/detail',
                query: {
                  id: row.id
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '资产',
            type: 'primary',
            atClick: row => {
              this.$router.push({
                path: '/member-management/assets-detail',
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
                path: '/member-management/add',
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
            show: row => row.hspMember.state === DISABLE,
            atClick: row => {
              let obj = Object.assign({}, row.hspMember)
              this.confirm(commonUpdateOne('menberInfo'), 'post', {
                update: {
                  hspMember: Object.assign(obj, {
                    state: ENABLE
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
            show: row => row.hspMember.state === ENABLE,
            atClick: row => {
              let obj = Object.assign({}, row.hspMember)
              this.confirm(commonUpdateOne('menberInfo'), 'post', {
                update: {
                  hspMember: Object.assign(obj, {
                    state: DISABLE
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
            show: row => row.hspMember.state === DISABLE,
            atClick: row => {
              this.confirm(`${commonDeleteOne('menberInfo')}`, 'post', {
                id: parseInt(row.id)
              })
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {prop: 'hspMember.account', label: '会员账号'},
          {prop: 'hspMember.mobile', label: '会员手机号', width: '150'},
          {
            prop: 'dto.groupIdList',
            label: '所属分组',
            'min-width': '150',
            formatter: row => (
              <div>
                {row.dto &&
                  row.dto.groupIdList
                    .filter((val, index) => index < 3)
                    .map((val, i) => {
                      return (
                        <el-tag key={i} class="mg-1">
                          {val.memberGroup.name}
                        </el-tag>
                      )
                    })}
                {(() => {
                  if (row.dto && row.dto.groupIdList.length > 3)
                    return (
                      <el-popover trigger="hover">
                        {row.dto.groupIdList
                          .filter((val, index) => index > 3)
                          .map((val, i) => {
                            return (
                              <el-tag key={i} class="mg-1">
                                {val.memberGroup.name}
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
            prop: 'state1',
            label: '来源渠道',
            width: '100',
            formatter: (row, index) => {
              return row.id == '1562668986524' ? '文轩网' : '新华文轩(西南书城)'
            }
          },
          {
            prop: 'state',
            label: '状态',
            width: '100',
            formatter: row => {
              return row.hspMember.state === '1' ? '启用' : '禁用'
            }
          },
          {
            prop: 'createdAt',
            width: '150',
            label: '注册时间',
            formatter: row => formatDate(row._id.time, 'YYYY-MM-DD HH:mm:ss')
          }
        ],
        searchForm: memberSearchForm
      }
    }
  },
  mounted() {
    this.getMemberGroupList()
  },
  methods: {
    // 下载excel模版
    downloadExcel() {
      ExportExcel({
        columns: excelStencil,
        data: [],
        fileName: '会员模版'
      }).then(() => {
        this.$message.success('下载模版成功')
        this.importMethodVisible = false
      })
    },
    // 获取分组列表
    getMemberGroupList() {
      this.$axios.$get(`${memberGroupList}?size=999`).then(resp => {
        let groupData = resp.payload.content.map(val => {
          return {
            label: val.name,
            value: val.id
          }
        })

        this.$refs.memberTable.$refs.searchForm.setOptions('groupId', groupData)
      })
    },
    // 导出excel
    async exportExcel(list) {
      if (!this.exportTime && !list) {
        this.$message.warning('请选择时间区间')
        return
      }
      this.exportLoading = true
      try {
        if (!list) {
          var resp = await this.$axios.$get(
            `${exportMember}?beginDate=${this.exportTime[0].getTime()}&endDate=${this.exportTime[1].getTime()}`
          )
        }
        let list = this.$refs.memberTable.data.map(item => {
          if (
            item._id.date >= this.exportTime[0].getTime() &&
            item._id.date <= this.exportTime[1].getTime()
          ) {
            return item.hspMember
          }
        })
        ExportExcel({
          columns: exportExcelStencil,
          data: list || resp.payload,
          fileName: '会员列表'
        }).then(() => {
          this.$message.success('导出成功')
          this.exportVisible = false
        })
      } catch (e) {
        this.$message.warning('操作失败')
      } finally {
        this.exportLoading = false
      }
    },
    // 导入excel
    handleUpload(file) {
      importExcel(file).then(({header, results}) => {
        let importList = results.map(val => {
          return Object.keys(importExcelKey).reduce((pred, cur) => {
            if (importExcelKey[cur].startsWith('状态')) {
              val[importExcelKey[cur]] === '启用'
                ? (pred[cur] = ENABLE)
                : (pred[cur] = DISABLE)
            } else {
              pred[cur] = val[importExcelKey[cur]]
            }
            return pred
          }, {})
        })
        let commitList = importList.map(item => {
          return Object.assign(
            {hspMember: item},
            {id: new Date().getTime() + parseInt(Math.random() * 100)}
          )
        })
        this.$axios
          .$post(commonAddMany('menberInfo'), commitList)
          .then(resp => {
            this.importExcelObj = resp.payload
            this.importVisible = true
          })
      })
      return false
    },
    getList() {
      this.$refs.memberTable.getList()
    },
    confirm(id, method, data) {
      this.$confirm('确认当前操作吗', '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action == 'confirm') {
            instance.confirmButtonLoading = true
            this.$axios[method || 'post'](id, data)
              .then(() => {
                this.$refs.memberTable.getList()
                done()
              })
              .finally(() => {
                instance.confirmButtonLoading = false
              })
          } else done()
        }
      }).catch(er => {
        /*取消*/
      })
    }
  }
}
</script>
<style lang="less">
.user-list {
  .mg-1 {
    margin: 4px;
  }

  .text-blue {
    color: #409eff;
    cursor: pointer;
  }

  .content-pd {
    padding: 20px;
  }
}
</style>
