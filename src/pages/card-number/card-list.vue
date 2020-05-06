<template>
  <div class="cardList">
    <!-- <el-data-table ref="customTable" v-bind="customTagConfig"></el-data-table> -->
    <el-row style="margin-bottom:15px;">
      <strong>卡劵类型：</strong>
      <el-button
        :class="[cardType == '' ? 'selectBtn' : '']"
        @click="changeType('')"
        >全部</el-button
      >
      <el-button
        :class="[cardType == '储值卡' ? 'selectBtn' : '']"
        @click="changeType('储值卡')"
        >储值卡</el-button
      >
      <el-button
        :class="[cardType == '礼品卡' ? 'selectBtn' : '']"
        @click="changeType('礼品卡')"
        >礼品卡</el-button
      >
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleCardType('b')">备用卡</el-button>
      <el-button type="primary" @click="handleCardType('f')">付印卡</el-button>
      <el-button type="primary" @click="dialogVisible = true"
        >生成卡号</el-button
      >
      <el-button
        type="primary"
        @click="changCardType"
        :disabled="multipleSelection.length == 0"
        >导出付印</el-button
      >
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="show"
        type="selection"
        width="55"
      ></el-table-column>
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
    <el-dialog
      title="生成卡号"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="creatCard">
        <el-form-item label="卡券类型">
          <!-- <el-input placeholder="请选择" v-model="creatCard.cardType"></el-input> -->
          <el-select
            v-model="creatCard.cardType"
            @change="cardTypeChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cardTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始值">
          <span>{{ creatCard.starCardNumber }}</span>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input
            width="180"
            placeholder="请输入数值"
            v-model="creatCard.creatCardNum"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="creatNewCard">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {segmentList, bigTagType, deleteBigTag} from '@/const/api'
import {formatDate} from '@/const/filter'
export default {
  name: 'segment-list',
  data() {
    return {
      cardType: '',
      dialogVisible: false,
      show: true,
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      showType: '备用',
      multipleSelection: [],
      columns: [
        {prop: 'cardType', label: '卡券类型'},
        {prop: 'cardNumber', label: '卡号'},
        {prop: 'cardState', label: '状态'},
        {
          prop: 'createdAt',
          label: '生成日期',
          formatter: row => formatDate(row.createdAt, 'YYYY-MM-DD')
        }
      ],
      cardTypeOpt: [
        {
          value: '储值卡',
          label: '储值卡'
        },
        {
          value: '礼品卡',
          label: '礼品卡'
        }
      ],
      creatCard: {
        cardType: '',
        starCardNumber: '',
        creatCardNum: '',
        cardNumFirst: 0
      },
      segmentObj: {},
      tableData: []
    }
  },
  mounted() {
    this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
  },
  methods: {
    changeType(type) {
      this.cardType = type
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cardTypeChange() {
      // console.log('creatCard.cardType',this.creatCard.cardType)
      let data = this.$store.state.segmentInfo
      data.map((item, index) => {
        if (
          item.cardType == this.creatCard.cardType &&
          item.cardMedium == '实体卡'
        ) {
          this.creatCard.starCardNumber = item.starCardNumber
          this.creatCard.cardNumFirst = item.cardNumFirst
          this.segmentObj = item
        }
      })
    },
    creatNewCard() {
      this.cardTypeChange()
      let newStarCardNumber = ''
      let cardData = []
      let lastCardNumber = ''
      let firstCardNumber = ''
      let cardNumFrontLen = this.segmentObj.cardNumFront.length
      for (
        let i = Number(this.creatCard.cardNumFirst);
        i <=
        Number(this.creatCard.cardNumFirst) +
          Number(this.creatCard.creatCardNum);
        i++
      ) {
        if (
          i <
          Number(this.creatCard.cardNumFirst) +
            Number(this.creatCard.creatCardNum)
        ) {
          let cardNumber =
            this.segmentObj.cardNumFront +
            (Array(this.segmentObj.cardNumLength).join('0') + String(i)).slice(
              -(this.segmentObj.cardNumLength - cardNumFrontLen)
            )
          console.log(
            '7777',
            i,
            Number(this.creatCard.cardNumFirst),
            this.segmentObj.firstCardNumber,
            i == Number(this.creatCard.cardNumFirst) &&
              this.segmentObj.firstCardNumber == '',
            i == Number(this.creatCard.cardNumFirst) &&
              !!this.segmentObj.firstCardNumber,
            i == Number(this.creatCard.cardNumFirst) &&
              !!!this.segmentObj.firstCardNumber,
            !!this.segmentObj.firstCardNumber,
            !!!this.segmentObj.firstCardNumber
          )
          if (
            i == Number(this.creatCard.cardNumFirst) &&
            !!!this.segmentObj.firstCardNumber
          ) {
            firstCardNumber = cardNumber
          } else if (
            i == Number(this.creatCard.cardNumFirst) &&
            !!this.segmentObj.firstCardNumber
          ) {
            firstCardNumber = this.segmentObj.firstCardNumber
          }
          lastCardNumber = cardNumber
          let obj = {
            cardType: this.segmentObj.cardType,
            cardMedium: this.segmentObj.cardMedium,
            cardNumber: cardNumber,
            createdAt: new Date().getTime(),
            cardID: new Date().getTime() + i,
            cardState: '备用'
          }
          console.log('obj', obj, firstCardNumber)
          cardData.push(obj)
        } else {
          newStarCardNumber =
            this.segmentObj.cardNumFront +
            (Array(this.segmentObj.cardNumLength).join('0') + String(i)).slice(
              -(this.segmentObj.cardNumLength - cardNumFrontLen)
            )
        }
      }
      let obj2 = {
        segementID: this.segmentObj.segementID,
        usedSegment:
          Number(this.segmentObj.usedSegment) +
          Number(this.creatCard.creatCardNum),
        segmentsNum:
          Number(this.segmentObj.segmentsNum) -
          Number(this.creatCard.creatCardNum),
        updataAt: new Date().getTime(),
        starCardNumber: newStarCardNumber,
        lastCardNumber: lastCardNumber,
        firstCardNumber: firstCardNumber,
        usedSolidNum:
          Number(this.segmentObj.usedSolidNum) +
          Number(this.creatCard.creatCardNum),
        solidCardScope: firstCardNumber + '-' + lastCardNumber,
        cardNumFirst:
          Number(this.segmentObj.cardNumFirst) +
          Number(this.creatCard.creatCardNum)
      }
      if (
        this.segmentObj.startByCard == '' ||
        this.segmentObj.startByCard == null ||
        this.segmentObj.startByCard == undefined
      ) {
        obj2.startByCard = firstCardNumber
      } else {
        obj2.startByCard = this.segmentObj.startByCard
      }

      // console.log('updateSegment',obj2)
      this.$store.commit('addCardData', cardData)
      this.$store.commit('updateSegment', obj2)
      console.log('updateSegment.segmentInfo', this.$store.state.segmentInfo)
      this.dialogVisible = false
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    },
    handleCardType(type) {
      if (type == 'b') {
        this.show = true
        this.showType = '备用'
      } else if (type == 'f') {
        this.show = false
        this.showType = '付印'
      }
      this.pageIndex = 1
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    },
    loadData(ind, size, showType, cardType) {
      let data = this.$store.state.cardData
      let starInd = (ind - 1) * size
      let endInd = ind * size - 1
      let data2 = []
      let data3 = []
      data.filter(item => {
        if (cardType != '') {
          if (item.cardState == showType && item.cardType == cardType) {
            data3.push(item)
          }
        } else {
          if (item.cardState == showType) {
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('val', val)
    },
    changCardType() {
      let ids = []
      this.multipleSelection.map(item => {
        ids.push(item.cardID)
      })
      this.$store.commit('changeCardState', ids)
      this.$message({
        message: '导出成功',
        type: 'success'
      })
      this.loadData(this.pageIndex, this.pageSize, this.showType, this.cardType)
    }
  }
}
</script>

<style lang="less">
.selectBtn {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.custom-edit {
  &-restrictions {
    margin-top: 10px;

    .el-input {
      width: auto;
    }
  }
}
.cardList {
  // border: 1px solid #ebebeb;

  .el-form {
    margin-right: 20px;
    .el-input {
      width: 200px;
    }
  }

  &-group {
    line-height: 36px;
    margin-bottom: 20px;

    .button {
      margin-right: 10px;
    }
  }

  &-label {
    width: 100px;
    text-align: right;
  }

  &-title {
    position: relative;
    padding-left: 10px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
  }

  &-button {
    margin: 20px;
  }

  .group-list {
    .el-tag {
      margin: 10px 10px 0 0;
    }
  }

  /deep/.el-input-number {
    width: 200px;
  }
  .removeImg {
    position: absolute;
    left: 190px;
    top: 5px;
  }
}
</style>
