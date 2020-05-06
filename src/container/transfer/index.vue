<template>
  <div class="transfer">
    <div class="transfer-head">
      <div class="transfer-left">
        <TreeTransfer
          :dataList="treeDataList"
          ref="transferLeft"
          :title="titles[0]"
          :defaultSelect="leftDefaultChecked"
          @checked-change="onSourceCheckedChange"
          @selectAllNodeList="toRightselectAllNodeList"
        >
        </TreeTransfer>
      </div>
      <div class="transfer-center">
        <el-button
          type="primary"
          @click.native="addToLeft"
          :disabled="leftDefaultChecked.length === 0"
          :class="{setButtonBack: leftDefaultChecked.length}"
        >
          <i class="el-icon-arrow-left"></i>
        </el-button>

        <el-button
          type="primary"
          @click.native="addToRight"
          :disabled="rightDefaultChecked.length === 0"
          :class="{setButtonBack: rightDefaultChecked.length}"
        >
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
      <div class="transfer-right">
        <TreeTransfer
          :dataList="ToRightSelectList"
          ref="transferRight"
          :title="titles[1]"
          :defaultSelect="rightDefaultChecked"
          @checked-change="onTargetCheckedChange"
          @selectAllNodeList="toLeftSelectAllNodeList"
        >
        </TreeTransfer>
      </div>
    </div>
    <div class="transfer-footer">
      <el-button>取消</el-button>
      <el-button type="primary" @click="selectNodeList">确认</el-button>
    </div>
  </div>
</template>

<script>
import TreeTransfer from '@/container/transfer/src/tree-transfer.vue'
import {treeToArray} from '@/utils/index.js'
export default {
  data() {
    return {
      leftDefaultChecked: [],
      rightDefaultChecked: [],
      getCheckAll: [],
      titles: ['基础类目', '已关联'],
      ToRightSelectList: []
    }
  },
  components: {
    TreeTransfer
  },
  props: {
    treeDataList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toRightselectAllNodeList(data) {
      this.rightDefaultChecked = data
    },
    toLeftSelectAllNodeList(data) {
      this.leftDefaultChecked = data
    },
    onSourceCheckedChange(val) {
      this.rightDefaultChecked = val
      this.$emit('right-check-change', val)
    },
    onTargetCheckedChange(val) {
      this.leftDefaultChecked = JSON.parse(JSON.stringify(val))
      this.$emit('left-check-change', val)
    },
    addToLeft() {
      let transferRightRefs = this.$refs.transferRight.$refs.treeTransfer
      let transferLeftRefs = this.$refs.transferLeft.$refs.treeTransfer
      let getselectList = transferRightRefs.getCheckedNodes() //获取右边选中数据
      if (!!getselectList) {
        let setSelectList = this.getallHandleNode(
          this.rightDefaultChecked
        ).filter(item => !getselectList.some(ele => ele.id === item.id)) //过滤出不取消的节点
        //下边2行不应该这么写--待优化
        transferLeftRefs.setCheckedKeys(setSelectList.map(v => v.id))
        transferRightRefs.data = setSelectList
      }
      this.leftDefaultChecked = []
    },
    addToRight() {
      this.ToRightSelectList = this.rightDefaultChecked.slice(0)
      this.rightDefaultChecked = []
    },
    getallHandleNode(data) {
      let arr = []
      data.forEach((v, i) => {
        arr.push(v)
        if (v.children && v.children.length > 0) {
          let children = this.getallHandleNode(v.children)
          arr = arr.concat(children)
        }
      })
      return arr
    },
    selectNodeList() {
      this.$emit('selectNodeList', this.ToRightSelectList)
    }
  }
}
</script>

<style scoped lang="less">
.transfer {
  &-head {
    display: flex;
    flex-direction: row;

    .transfer-left {
      flex: 45%;
      width: 200px;
      overflow: hidden;
      display: inline-block;
      box-sizing: border-box;
    }

    .transfer-center {
      flex: 10%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      button {
        border: 1px solid #dcdfe6;
        color: #c0c4cc;
        display: block;
        margin: 0 auto;
        padding: 10px;
        background: #f5f7fa;
        border-radius: 50%;
      }

      button:first-child {
        margin-bottom: 10px;
      }
    }

    .transfer-right {
      flex: 45%;
    }
  }

  &-footer {
    margin-top: 10px;
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.setButtonBack {
  background-color: #409eff !important;
  color: #fff !important;
}
</style>
