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
        <el-form-item label="卡券状态">
          <el-select v-model="formInline.state" placeholder="请选择卡券状态">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
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
      <el-button type="primary" @click="goRoute(1)">创建储值卡</el-button>
      <el-button type="primary" @click="goRoute(2)">创建礼品卡</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column type="index" label="序号"> </el-table-column> -->
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
          width="130"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作" width="220" fixed="right">
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
            @click="handleEdit(scope.$index, scope.row)"
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
import {segmentList, bigTagType, deleteBigTag} from '@/const/api'
import {formatDate} from '@/const/filter'

const COUPONS_TYPE = {
  储值卡: '储值卡',
  礼品卡: '礼品卡'
}
const COUPONS_STATE = {
  已发放: '已发放',
  未发放: '未发放'
}
export default {
  name: 'segment-list',
  data() {
    return {
      formInline: {
        cardType: '',
        state: '',
        keyWord: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      columns: [
        {prop: 'couponID', label: '卡卷ID'},
        {prop: 'couponName', label: '卡券名称'},
        {prop: 'cardType', label: '卡券类型'},
        {prop: 'cardValue', label: '卡面额'},
        {prop: 'applyStore', label: '适用门店'},
        {prop: 'shopScope', label: '可用商品范围'},
        {prop: 'grantNum', label: '已发放数量'},
        {
          prop: 'createdAt',
          label: '设置日期',
          formatter: row => formatDate(row.couponID, 'YYYY-MM-DD')
        },
        {prop: 'couponState', label: '状态'}
      ]
    }
  },
  mounted() {
    this.loadData(this.pageIndex, this.pageSize, this.formInline)
  },
  methods: {
    handleEdit() {
      return
    },
    resetForm(formName) {
      this.formInline = {
        cardType: '',
        state: '',
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
    goRoute(type) {
      if (type == 1) {
        this.$router.push('add-stored-card')
        return Promise.resolve(false)
      } else if (type == 2) {
        this.$router.push('add-gift-card')
        return Promise.resolve(false)
      }
    },
    loadData(ind, size, searchForm) {
      let data = this.$store.state.couponData
      let starInd = (ind - 1) * size
      let endInd = ind * size - 1
      let data2 = []
      let data3 = []
      let cardType = searchForm.cardType
      let state = searchForm.state
      let keyWord = searchForm.keyWord
      data.filter(item => {
        if (cardType == '' && state == '' && keyWord == '') {
          data3.push(item)
        } else if (cardType != '' && state != '' && keyWord != '') {
          if (
            item.cardType == cardType &&
            item.couponState == state &&
            item.couponID == keyWord
          ) {
            data3.push(item)
          } else if (
            item.cardType == cardType &&
            item.couponState == state &&
            item.couponName == keyWord
          ) {
            data3.push(item)
          }
        } else if (cardType != '' && state != '' && keyWord == '') {
          if (item.cardType == cardType && item.couponState == state) {
            data3.push(item)
          }
        } else if (cardType != '' && keyWord != '' && state == '') {
          if (item.cardType == cardType && item.couponID == keyWord) {
            data3.push(item)
          } else if (item.cardType == cardType && item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (state != '' && keyWord != '' && cardType == '') {
          if (item.couponState == state && item.couponID == keyWord) {
            data3.push(item)
          } else if (item.couponState == state && item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (state != '' && keyWord == '' && cardType == '') {
          if (item.couponState == state) {
            data3.push(item)
          }
        } else if (state == '' && keyWord != '' && cardType == '') {
          if (item.couponID == keyWord) {
            data3.push(item)
          } else if (item.couponName == keyWord) {
            data3.push(item)
          }
        } else if (state == '' && keyWord == '' && cardType != '') {
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
