<template>
  <div class="native-list">
    <el-data-table ref="table" v-bind="tableConfig"></el-data-table>
  </div>
</template>

<script>
import {findAll, deleteOneByCondition} from '@/const/api'
import {formatDate} from '@/const/filter'

import {TAG_TYPE_MAP, TAG_TYPE_LIST, COLLECTION} from '@/const/common.js'

const COMPOUND_DETAIL = 'compound-detail'

export default {
  page: {
    title: '复合标签'
  },
  data() {
    return {
      tableConfig: {
        url: `${findAll}?collection=${COLLECTION.COMPOUND}`,
        dataPath: 'payload',
        hasNew: false,
        hasDelete: true,
        onDelete(row) {
          return this.$axios.$post(
            `${deleteOneByCondition}?collection=${COLLECTION.COMPOUND}`,
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
          }
        ],
        headerButtons: [
          {
            text: '新增',
            type: 'primary',
            atClick: () => {
              this.$router.push(COMPOUND_DETAIL)
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
              this.$router.push(`${COMPOUND_DETAIL}?id=${row.id}&readOnly=true`)
              return Promise.resolve(false)
            }
          },
          {
            text: '编辑',
            type: 'primary',
            atClick: row => {
              this.$router.push(`${COMPOUND_DETAIL}?id=${row.id}`)
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {prop: 'id', label: '标签编号'},
          {prop: 'tagName', label: '标签名称'},
          {
            prop: 'tagType',
            label: '标签分类',
            formatter: row => TAG_TYPE_MAP[row.tagType]
          },
          {
            prop: 'count',
            label: '打标次数',
            formatter: row => row.count || 0
          },
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
