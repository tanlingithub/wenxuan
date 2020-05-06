<template>
  <!-- <el-data-table ref="customTable" v-bind="customTagConfig"></el-data-table> -->
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="卡劵类型">
          <el-select v-model="formInline.cardType" placeholder="请选择卡劵类型">
            <el-option label="储值卡" value="储值卡"></el-option>
            <el-option label="礼品卡" value="礼品卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.keyWord"
            placeholder="搜索卡券名称、卡券ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="goRoute">卡发放</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <template v-for="(columnItem, index) in columns">
        <el-table-column
          v-if="columnItem.prop == 'upperTiem'"
          :prop="columnItem.prop"
          :label="columnItem.label"
          :formatter="columnItem.formatter"
        >
        </el-table-column>
        <el-table-column
          v-else
          :prop="columnItem.prop"
          :label="columnItem.label"
          width="130"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="toRoute(scope.row.couponID)"
            >查看</el-button
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
import {segmentList, bigTagType, deleteBigTag} from '@/const/api'
import {formatDate} from '@/const/filter'
export default {
  name: 'segment-list',
  data() {
    return {
      formInline: {
        cardType: '',
        keyWord: '',
        cardMedium: '实体卡'
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      columns: [
        {prop: 'couponID', label: '卡卷ID'},
        {prop: 'couponName', label: '卡券名称'},
        {prop: 'cardType', label: '卡券类型'},
        {prop: 'grantStore', label: '发放门店'},
        {prop: 'upperSegment', label: '发放卡券段号'},
        {prop: 'grantNum', label: '发放数量'},
        {prop: 'sellNum', label: '已售'},
        {prop: 'stockNum', label: '库存数量'},
        {
          prop: 'upperTiem',
          label: '发放日期',
          formatter: row => formatDate(row.upperTiem, 'YYYY-MM-DD')
        }
      ]
    }
  },
  mounted() {
    this.loadData(this.pageIndex, this.pageSize, this.formInline)
  },
  methods: {
    toRoute(id) {
      this.$router.push(`detail?id=${id}`)
    },
    resetForm(formName) {
      this.formInline = {
        cardType: '',
        keyWord: ''
      }
      this.loadData(this.pageIndex, this.pageSize, this.formInline)
    },
    onSubmit() {
      this.loadData(this.pageIndex, this.pageSize, this.formInline)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.loadData(this.pageIndex, this.pageSize, this.formInline)
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.loadData(this.pageIndex, this.pageSize, this.formInline)
    },
    goRoute() {
      this.$router.push('grant')
      return Promise.resolve(false)
    },
    loadData(ind, size, searchForm) {
      let data = this.$store.state.couponData
      let starInd = (ind - 1) * size
      let endInd = ind * size - 1
      let data2 = []
      let data3 = []
      let cardType = searchForm.cardType
      let keyWord = searchForm.keyWord
      let channel = '门店'
      data.filter(item => {
        if (cardType == '' && channel == '' && keyWord == '') {
          data3.push(item)
        } else if (cardType != '' && channel != '' && keyWord != '') {
          if (
            item.cardType == cardType &&
            item.channel == channel &&
            item.couponID == keyWord
          ) {
            data3.push(item)
          } else if (
            item.cardType == cardType &&
            item.channel == channel &&
            item.couponName == keyWord
          ) {
            data3.push(item)
          }
        } else if (cardType != '' && channel != '' && keyWord == '') {
          if (item.cardType == cardType && item.channel == channel) {
            data3.push(item)
          }
        } else if (cardType != '' && keyWord != '' && channel == '') {
          if (item.cardType == cardType && item.couponID == keyWord) {
            data3.push(item)
          } else if (item.cardType == cardType && item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (channel != '' && keyWord != '' && cardType == '') {
          if (item.channel == channel && item.couponID == keyWord) {
            data3.push(item)
          } else if (item.channel == channel && item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (channel != '' && keyWord == '' && cardType == '') {
          if (item.channel == channel) {
            data3.push(item)
          }
        } else if (channel == '' && keyWord != '' && cardType == '') {
          if (item.couponID == keyWord) {
            data3.push(item)
          } else if (item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (channel == '' && keyWord == '' && cardType != '') {
          if (item.cardType == cardType) {
            data3.push(item)
          }
        }
      })
      data3.map((item, index) => {
        if (index >= starInd && index <= endInd) {
          data2.push(item)
        }
      })

      this.pageTotal = data3.length
      // console.log('data2',data2)
      this.tableData = data2
    }
  }
}
</script>

<style></style>
