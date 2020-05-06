<template>
  <!-- <el-data-table ref="customTable" v-bind="customTagConfig"></el-data-table> -->
  <div>
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="addSegment">创建卡号段</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <template v-for="(columnItem, index) in columns">
        <el-table-column
          v-if="columnItem.prop == 'createdAt'"
          :prop="columnItem.prop"
          :label="columnItem.label"
          :formatter="columnItem.formatter"
        >
        </el-table-column>
        <el-table-column
          v-else
          :prop="columnItem.prop"
          :label="columnItem.label"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px;text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import {
  segmentList,
  bigTagType,
  deleteBigTag,
  commonList,
  commonDelete
} from '@/const/api'
import {formatDate} from '@/const/filter'
export default {
  name: 'segment-list',
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      columns: [
        {prop: 'cardType', label: '卡卷类型'},
        {prop: 'cardMedium', label: '卡介质'},
        {prop: 'cardSegmentNumber', label: '卡段号'},
        {prop: 'segmentsNum', label: '段号数量'},
        {prop: 'usedSegment', label: '已使用段号'},
        {
          prop: 'createdAt',
          label: '设置日期',
          formatter: row => formatDate(row.createdAt, 'YYYY-MM-DD')
        }
      ],
      customTagConfig: {
        url: segmentList,
        dataPath: 'payload.content',
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        headerButtons: [
          {
            text: '创建卡号段',
            type: 'primary',
            atClick: () => {
              this.$router.push('add-segment')
              return Promise.resolve(false)
            }
          }
        ],
        customQuery: {
          type: 1
        },
        tableAttrs: {border: true},
        extraButtons: [
          {
            text: '查看',
            type: 'primary',
            atClick: row => {
              this.$router.push(`big-edit?id=${row.tagId}&isView=0`)
              return Promise.resolve(false)
            }
          },
          {
            text: '编辑',
            atClick: row => {
              this.$router.push(`big-edit?id=${row.tagId}`)
              return Promise.resolve(false)
            }
          },
          {
            text: '删除',
            type: 'danger',
            atClick: row => {
              this.$confirm('确认当前操作吗', '提示', {
                type: 'warning',
                beforeClose: (action, instance, done) => {
                  if (action == 'confirm') {
                    instance.confirmButtonLoading = true
                    this.$axios
                      .$delete(`${deleteBigTag}?mixedTagId=${row.tagId}`)
                      .then(resp => {
                        if (resp.code === '0') {
                          this.$refs.customTable.getList()
                          this.$message.success('删除成功')
                        }
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
              return Promise.resolve(false)
            }
          }
        ],
        operationAttrs: {
          width: '280px'
        },
        columns: [
          {prop: 'cardType', label: '卡卷类型'},
          {prop: 'cardMedium', label: '卡介质'},
          {prop: 'cardSegmentNumber', label: '卡段号'},
          {prop: 'segmentsNum', label: '段号数量'},
          {prop: 'usedSegment', label: '已使用段号'},
          {
            prop: 'createdAt',
            label: '设置日期',
            formatter: row => formatDate(row.createdAt, 'YYYY-MM-DD')
          }
        ],
        searchForm: []
      }
    }
  },
  mounted() {
    // this.tableData = this.$store.state.segmentInfo
    this.loadData(this.pageIndex, this.pageSize)
    // console.log('this.$store.state.segmentInfo', this.$store.state.segmentInfo)
  },
  methods: {
    handleEdit(index, data) {},
    handleDelete(index, data) {
      this.$axios
        .$post(commonDelete + `?collection=segments`, {id: data.id})
        .then(() => {
          this.loadData()
        })
    },
    addSegment() {
      this.$router.push('add-segment')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.loadData(this.pageIndex, this.pageSize)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
      this.loadData(this.pageIndex, this.pageSize)
    },
    loadData(ind, size) {
      // this.$axios.get(`${commonList}?collection=segments`).then(res => {
      // let resArr = res.data.payload.content
      // console.info(res.data)

      let data = this.$store.state.segmentInfo
      // let data = res.data.payload || []
      // this.$store.commit('initSegment', data)

      this.pageTotal = data.length
      let starInd = (ind - 1) * size
      let endInd = ind * size - 1
      let data2 = []
      data.map((item, index) => {
        if (index >= starInd && index <= endInd) {
          data2.push(item)
        }
      })
      this.tableData = data2
      // })
    }
  }
}
</script>

<style></style>
