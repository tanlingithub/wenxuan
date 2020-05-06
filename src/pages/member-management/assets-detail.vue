<template>
  <div class="assets-detail">
    <div class="title">
      业务信息
    </div>
    <div>
      <el-button
        type="primary"
        v-for="(item, index) in detailArr"
        :key="index"
        @click="changeDetailType(item)"
        >{{ item.label }}</el-button
      >
    </div>
    <div class="title">
      <p class="prop" v-show="activeDetailType === 0">
        <span>当前会员: {{ userInfo.name }}</span
        ><span>积分总值: {{ userInfo.totalScore }}</span>
      </p>
      <p class="prop" v-show="activeDetailType === 1">
        <span>当前会员: {{ userInfo.name }}</span
        ><span>消费总金额: {{ userInfo.totalConsumption }}</span>
      </p>
      <p class="prop" v-show="activeDetailType === 2">
        <span>当前会员: {{ userInfo.name }}</span>
      </p>
    </div>
    <div v-for="(item, index) in detailArr" :key="index">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        v-show="item.value === activeDetailType"
      >
        <el-tab-pane
          :label="sec.label"
          :name="sec.name"
          v-for="(sec, index) in item.panes"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <el-data-table
      v-bind="tableConfig"
      :customQuery="customQuery"
      :columns="columsObj[activeDetailType]"
      :url="tableUrl"
      ref="dataTable"
    ></el-data-table>
  </div>
</template>

<script>
import {Tabs, TabPane} from 'element-ui'
import {getAssetsDetail, commonFindList} from '@/const/api'
import {
  pointsDetailsColoums,
  expensesRecordColoums,
  couponDetailsColoums
} from '@/const/member'
export default {
  components: {
    'el-tab-pane': TabPane,
    'el-tabs': Tabs
  },
  data() {
    const detailArr = [
      {
        label: '积分明细',
        value: 0,
        panes: [
          {
            label: '全部',
            name: 'all'
          },
          {
            label: '收入',
            name: 'come'
          },
          {
            label: '支出',
            name: 'use'
          },
          {
            label: '失效',
            name: 'invalid'
          }
        ]
      },
      {
        label: '消费记录',
        value: 1,
        panes: [
          {
            label: '消费记录',
            name: 'useReport'
          }
        ]
      },
      {
        label: '卡券明细',
        value: 2,
        panes: [
          {
            label: '全部',
            name: 'all'
          },
          {
            label: '已使用',
            name: 'use'
          },
          {
            label: '未使用',
            name: 'unuse'
          },
          {
            label: '已失效',
            name: 'invalid'
          }
        ]
      }
    ]
    return {
      detailArr,
      activeDetailType: 0,
      activeName: 'all',
      columsObj: {},
      customQuery: {
        detailType: 0,
        type: 'all'
      },
      userInfo: {},
      tableUrl: commonFindList('memberAssets'),
      tableConfig: {
        dataPath: 'payload',
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        hasOperation: false,
        tableAttrs: {border: true},
        extraButtons: []
      }
    }
  },
  methods: {
    /* 获取列表数据 */
    getList() {
      this.$refs.dataTable.getList()
      this.userInfo = this.$refs.dataTable.data[0].userInfo || {}
    },
    /* 修改明细类型 */
    changeDetailType(item) {
      this.activeDetailType = item.value
      this.customQuery.detailType = item.value
      this.activeName = this.detailArr[this.activeDetailType].panes[0].name
      this.customQuery.type = this.activeName
      this.getList()
    },
    /* tab表格状态流转 */
    handleClick(tab, event) {
      this.customQuery.type = tab.name
      this.getList()
    },
    init() {
      this.columsObj = {
        0: pointsDetailsColoums,
        1: expensesRecordColoums,
        2: couponDetailsColoums
      }
      this.$axios.get(commonFindList('memberAssets')).then(res => {
        this.userInfo = res.data.payload[0].userInfo || {}
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less">
.assets-detail {
  .title {
    line-height: 30px;
    margin: 10px 0;
    border-bottom: 1px solid #efefef;
    .prop {
      span {
        margin-right: 30px;
      }
    }
  }
}
</style>
