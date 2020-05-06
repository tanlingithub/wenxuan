<template>
  <div class="brand-management">
    <el-data-table ref="table" v-bind="tableconfig"> </el-data-table>
  </div>
</template>

<script>
import {BRAND_LIST} from '@/service/spaas-commodity-center.js'
export default {
  data() {
    return {
      tableconfig: {
        url: BRAND_LIST,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: true,
        extraButtons: [
          {
            type: 'primary',
            text: '编辑',
            atClick: row => {
              this.routerLink(row.id)
              return Promise.resolve()
            }
          }
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '新增品牌',
            atClick: row => {
              this.routerLink()
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {
            prop: 'id',
            label: 'ID'
          },
          {
            prop: 'code',
            label: '编码'
          },
          {
            prop: 'chineseName',
            label: '品牌中文名称'
          },
          {
            prop: 'englishName',
            label: '品牌英文名称'
          },
          {
            prop: 'attachmentPath',
            label: 'LOGO',
            formatter: row => {
              let srcUrl = row.attachmentPath
              return !!srcUrl ? <img class="srcUrl" src={srcUrl} /> : ''
            }
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '品牌名称',
            $el: {
              placeholder: '请输入'
            }
          }
        ]
      }
    }
  },
  methods: {
    routerLink(ele) {
      this.$router.push({
        path: '/brand-management/brandInfo',
        query: {
          id: ele
        }
      })
    }
  }
}
</script>
<style scoped>
.srcUrl {
  width: 60px;
  height: 60px;
}

.brand-management {
  background: #fff;
  padding: 10px;
}
</style>
