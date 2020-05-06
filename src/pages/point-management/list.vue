<template>
  <div class="channel-list">
    <el-data-table
      ref="dataTable"
      v-bind="tableConfig"
      data-path="payload.content"
      :customQuery="customQuery"
    ></el-data-table>
  </div>
</template>
<script>
import {formatDate} from '@/const/filter'
import {preComfirm} from '@/const/point-management'
import {pointList} from '@/const/api'
export default {
  name: 'channel-list',
  components: {},
  data() {
    return {
      customQuery: {},
      tableConfig: {
        url: pointList,
        hasNew: false,
        hasView: false,
        hasEdit: false,
        hasDelete: false,
        operationAttrs: {
          width: '120px',
          fixed: 'right'
        },
        tableAttrs: {border: true},
        headerButtons: [],
        extraButtons: [
          {
            text: '查看',
            type: 'text',
            show: row => true,
            atClick: row => this.editAndLook('view', row.id)
          }
        ],
        columns: [
          {
            prop: 'account',
            label: '会员账号'
          },
          {
            prop: 'residuePoint',
            label: '当前剩余积分'
          },
          {
            prop: 'availablePoint',
            label: '可用积分'
          },
          {
            prop: 'lockPont',
            label: '已锁定积分'
          },
          {
            prop: 'missPoint',
            label: '已失效积分'
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'account',
            label: '会员账号',
            $el: {
              placeholder: '请输入'
            }
          }
        ]
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    editAndLook(type = 'view', id = null) {
      const obj = {
        path: 'rule-detail',
        query: {type, id}
      }
      !id && delete obj.query['id']
      this.$router.push(obj)
      return Promise.resolve()
    }
  }
}
</script>
