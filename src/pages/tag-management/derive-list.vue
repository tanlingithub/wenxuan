<template>
  <div class="derive-list">
    <el-data-table ref="table" v-bind="tableConfig"></el-data-table>
  </div>
</template>

<script>
import {findAll, deleteOneByCondition} from '@/const/api'
import {
  CONDITION_SYMBOL_MAP,
  COLLECTION,
  STATUS_MAP,
  STATUS_LIST,
  TAG_TYPE_MAP,
  TAG_TYPE_LIST
} from '@/const/common.js'
import {formatDate} from '@/const/filter'

export default {
  page: {
    title: '派生标签'
  },
  data() {
    return {
      CONDITION_SYMBOL_MAP,
      tableConfig: {
        url: `${findAll}?collection=${COLLECTION.DERIVE}`,
        dataPath: 'payload',
        hasNew: false,
        hasDelete: true,
        onDelete(row) {
          return this.$axios.$post(
            `${deleteOneByCondition}?collection=${COLLECTION.DERIVE}`,
            {
              id: row.id
            }
          )
        },
        hasEdit: false,
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '标签名称',
            $el: {placeholder: '请输入标签名称'}
          },
          {
            $type: 'select',
            $id: 'type',
            label: '标签分类',
            $options: TAG_TYPE_LIST,
            $el: {placeholder: '请输入选择标签分类'}
          },
          {
            $type: 'select',
            $id: 'status',
            label: '标签状态',
            $options: STATUS_LIST,
            $el: {placeholder: '请输入选择标签分类'}
          }
        ],
        headerButtons: [
          {
            text: '新增',
            type: 'primary',
            atClick: () => {
              this.$router.push('add-derive')
              return Promise.resolve(false)
            }
          }
        ],
        tableAttrs: {border: true},
        extraButtons: [
          {
            text: '编辑',
            type: 'primary',
            atClick: row => {
              this.$router.push(`edit-derive?id=${row.id}`)
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {prop: 'tagName', label: '派生标签名称', minWidth: 100},
          {
            prop: 'tagType',
            label: '标签分类',
            formatter: row => TAG_TYPE_MAP[row.tagType]
          },
          {
            prop: 'status',
            label: '状态',
            formatter: row => STATUS_MAP[row.status] || '运行中'
          },
          {prop: 'mean', label: '关联原生标签', minWidth: 100},
          {
            prop: 'deriveRules',
            label: '派生规则',
            formatter: row => {
              return (row.deriveRules || [])
                .map(i => {
                  return `${CONDITION_SYMBOL_MAP[i.leftCondition]} ${
                    i.leftValue
                  },${i.rightValue} ${CONDITION_SYMBOL_MAP[i.rightCondition]}`
                })
                .join()
            }
          },
          {prop: 'createdBy', label: '创建人'},
          {
            prop: 'createdAt',
            label: '更新时间',
            formatter: row => formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss')
          }
        ]
      }
    }
  }
}
</script>
<style lang="less">
.derive-list {
}
</style>
