<template>
  <div class="native-list">
    <el-data-table ref="table" v-bind="tableConfig"></el-data-table>
  </div>
</template>

<script>
import {findAll, deleteOneByCondition} from '@/const/api'
import {formatDate} from '@/const/filter'

import {
  TAG_TYPE_MAP,
  TAG_TYPE_LIST,
  COLLECTION,
  STATUS_MAP,
  STATUS_LIST
} from '@/const/common.js'

export default {
  page: {
    title: '原生标签'
  },
  data() {
    return {
      tableConfig: {
        url: `${findAll}?collection=${COLLECTION.NATIVE}`,
        dataPath: 'payload',
        hasNew: false,
        hasDelete: true,
        extraBody: {
          collection: COLLECTION.NATIVE
        },
        onDelete(row) {
          return this.$axios.$post(
            `${deleteOneByCondition}?collection=${COLLECTION.NATIVE}`,
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
            $id: 'tagType',
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
              this.$router.push('add-native')
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
              this.$router.push(`edit-native?id=${row.id}`)
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {prop: 'tagName', label: '标签名称'},
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
          // {prop: 'description', label: '标签描述'},
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
.native-list {
}
</style>
