<template>
  <div class="brand-management">
    <el-data-table
      ref="onShelvesTable"
      v-bind="tableconfig"
      :url="setCommodityUrl"
    >
    </el-data-table>
  </div>
</template>

<script>
const addDate = (date, value = 1, type = 'day') => dayjs(date).add(value, type)

const judgeDateiSEqual = ([start, last]) => {
  return {
    startTime: new Date(dayjs(start).format('YYYY-MM-DD HH:mm:ss')),
    endTime: new Date(
      dayjs(start === last ? addDate(last) : last).format('YYYY-MM-DD HH:mm:ss')
    )
  }
}

import dayjs from 'dayjs'
import {
  getCommodityList,
  putCommodityList,
  deleteCommodityList,
  CommodityList
} from '@/service/spaas-commodity-center.js'

const setTitle = function(params) {
  return !/commodity-list-onshelves/.test(location.href) ? '上架' : '下架'
}

export default {
  data() {
    return {
      status: 0,
      checkoutUrl: /commodity-list-onshelves/.test(this.$route.path),
      tableconfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        hasOperation: true,
        hasPagination: true,
        extraButtons: [
          {
            text: `${setTitle()}`,
            atClick: row => {
              putCommodityList({
                id: row.id,
                commodityStatus: {status: !this.checkoutUrl ? 4 : 5}
              }).then(res => {
                let {data} = res
                if (data.code == '0' && data.payload) {
                  this.$message.success('修改成功')
                  this.$refs.onShelvesTable.getList()
                } else {
                  this.$message.error('修改失败')
                }
              })
              return Promise.resolve()
            }
          },
          {
            text: '查看',
            atClick: row => {
              this.jumpShowPage(row)
              return Promise.resolve()
            }
          },
          {
            text: '编辑',
            atClick: row => {
              this.jumpEditPage(row)
              return Promise.resolve()
            }
          },
          {
            text: '删除',
            class: 'text-danger-button',
            atClick: row => {
              deleteCommodityList({id: row.id}).then(res => {
                let {data} = res
                if (data.code == '0' && data.payload) {
                  this.$message.success('删除成功')
                  this.$refs.onShelvesTable.getList()
                } else {
                  this.$message.error('删除失败')
                }
              })
              return Promise.resolve()
            }
          }
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '发布商品',
            show: selected => {
              return this.status == 4
            },
            atClick: row => {
              this.$router.push('/new-commodity')
              return Promise.resolve(false)
            }
          },
          {
            type: 'warning',
            text: `批量${setTitle()}`,
            disabled: selected => selected.length < 1,
            atClick: row => {
              putCommodityList({
                id: row.map(v => v.id),
                commodityStatus: {status: !this.checkoutUrl ? 4 : 5}
              }).then(res => {
                let {data} = res
                if (data.code == '0' && data.payload) {
                  this.$message.success('修改成功')
                  this.$refs.onShelvesTable.getList()
                } else {
                  this.$message.error('修改失败')
                }
              })
              return Promise.resolve()
            }
          },
          {
            type: 'danger',
            text: '批量删除',
            disabled: selected => selected.length < 1,
            atClick: row => {
              deleteCommodityList({id: row.map(v => v.id)}).then(res => {
                let {data} = res
                if (data.code == '0' && data.payload) {
                  this.$message.success('删除成功')
                  this.$refs.onShelvesTable.getList()
                } else {
                  this.$message.error('删除失败')
                }
              })
              return Promise.resolve()
            }
          }
        ],
        columns: [
          {
            type: 'selection'
          },
          {
            prop: 'name',
            label: '商品'
          },
          {
            prop: 'category.name',
            label: '基础类目'
          },
          {
            prop: 'status',
            label: '销售状态',
            formatter: row => {
              let saleStatus = this.status == 4 ? '上架中' : '下架中'
              return <span>{saleStatus}</span>
            }
          },
          {
            prop: 'updatedTime',
            label: '更新时间',
            formatter: (v, k, val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '商品名称',
            $el: {
              placeholder: '请输入内容'
            }
          },
          {
            $type: 'date-picker',
            $id: 'updatedAt',
            label: '创建时间',
            $el: {
              placeholder: '请选择',
              valueFormat: 'yyyy-MM-dd',
              type: 'daterange',
              'range-separator': '至',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期'
            },
            outputFormat: val => {
              if (!val || val.length < 2) {
                return {startTime: '', endTime: ''}
              }
              return judgeDateiSEqual(val)
            }
          }
        ]
      }
    }
  },
  created() {
    this.status = this.checkoutUrl ? 4 : 5 //4 上架 5 下架
  },
  computed: {
    setCommodityUrl() {
      return `${CommodityList}?status=${this.status}`
    }
  },
  methods: {
    jumpEditPage({id, ...row}) {
      this.$router.push({
        path: '/edit-commodity',
        query: {
          commodityId: id
        }
      })
    },
    jumpShowPage({id, ...row}) {
      this.$router.push({
        path: '/commodity-detail',
        query: {
          commodityId: id
        }
      })
    }
  }
}
</script>
<style lang="less">
.brand-management {
  .el-date-editor .el-range-separator {
    margin-right: 4px;
  }

  .text-danger-button {
    color: @--color-danger;
  }
}
</style>
