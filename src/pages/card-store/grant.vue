<template>
  <div class="grant-add">
    <!-- v-loading不能放在最外层的节点，不然是全屏loading -->
    <p class="grant-add-title">卡劵发放</p>
    <el-form
      label-width="120px"
      :rules="rules"
      ref="cardForm"
      :model="upInfoForm"
    >
      <el-form-item label="选择卡券" prop="card">
        <el-select
          v-model="upInfoForm.cardType"
          @change="changeCoupon2"
          placeholder="请选择"
        >
          <el-option label="礼品卡" value="礼品卡"></el-option>
          <el-option label="储值卡" value="储值卡"></el-option>
        </el-select>
        <el-select
          v-model="upInfoForm.cardItem"
          @change="changeCoupon3"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in optiom"
            :key="index"
            :label="item.couponName"
            :value="item.couponID"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="发放门店" prop="sendStore">
        <el-select
          v-model="upInfoForm.sendStore"
          @change="storeChange"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item, index) in storeOptions"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="发放门店">
        <!-- <el-input style="margin-right:20px;" v-model="upInfoForm.grantStore"></el-input> -->
        <el-select
          v-model="upInfoForm.grantStore"
          multiple
          placeholder="请选择门店"
        >
          <el-option
            v-for="item in couponObj.applyStore"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架卡段号" prop="upCardNumber">
        <span v-if="upInfoForm.dimensionType == '实体卡'">{{
          segmentObj.startByCard
        }}</span>
        <span v-else>{{ segmentObj.starCardNumber }}</span
        >~
        <el-input
          style="margin-right:20px;"
          v-model="upInfoForm.upCardNumber"
        ></el-input
        >(<span v-if="upInfoForm.dimensionType == '实体卡'">{{
          upInfoForm.upCardNumber + '/' + upInfoForm.usedSolidNum
        }}</span>
        <span v-else>{{
          upInfoForm.upCardNumber + '/' + segmentObj.segmentsNum
        }}</span
        >张)
        <el-button
          v-if="upInfoForm.dimensionType == '实体卡'"
          type="primary"
          style="margin-left:20px;"
          @click="searchCard2"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-data-table style="width: 80%; margin-left: 10%;" ref="customTable" v-bind="customTagConfig"></el-data-table> -->
    <div class="box" style="width: 80%; margin-left: 50px;margin-bottom:50px;">
      <el-editable
        v-loading="loading"
        border
        ref="cardTable"
        :data="cardTable"
        :columns="cardShareColums"
      ></el-editable>
      <el-pagination
        align="right"
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.index"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
      <el-form label-width="0px">
        <el-form-item v-if="!isView">
          <el-button type="primary" @click="save" :loading="loading"
            >确认发放</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  segmentList,
  tagList,
  tagTypeList,
  ruleList,
  commonAddOne
} from '@/const/api'
import {cardShareColums} from '@/const/card'
import UploadToAli from '@femessage/upload-to-ali'
import ElEditable from '@/components/el-editable'

const RULE = {
  0: '≥',
  1: '>',
  2: '<',
  3: '≤',
  4: '=',
  5: '!='
}
const stored_TYPE = 1
const RADIO = 'radio-group'
const storeOptions = [
  {
    label: '小程序',
    value: '小程序'
  },
  {
    label: '商城',
    value: '商城'
  }
]

export default {
  name: 'grant-edit',
  components: {
    UploadToAli,
    ElEditable
  },
  data() {
    const checkPlatType = (rule, value, callback) => {
      // if (!this.productForm.platformPrimaryCategoryId || !this.productForm.platformSecondCategoryId || !this.productForm.platformThirdCategoryId) {
      if (
        !this.upInfoForm.dimensionType ||
        !this.upInfoForm.cardType ||
        !this.upInfoForm.cardItem
      ) {
        // callback('平台类型不可为空')
        return callback(new Error(false))
      }
      return callback()
    }
    var checkUpCardNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入卡劵数量'))
      } else {
        if (
          value > this.segmentObj.usedSolidNum &&
          value > this.segmentObj.segmentsNum
        ) {
          callback(new Error('卡劵剩余数量不足'))
        }
        callback()
      }
    }
    return {
      optiom: [],
      couponObj: {
        cardPrice: '',
        applyStore: []
      },
      segmentObj: {
        cardType: '',
        cardMedium: '',
        cardNumLength: '',
        cardNumFront: '',
        starCardNumber: '000-000-000',
        cardNumFirst: '',
        cardSegmentNumber: '',
        segmentsNum: 0,
        usedSegment: 0,
        createdAt: 0,
        updataAt: 0,
        segementID: 0,
        usedSolidNum: 0
      },
      storeOptions,
      flag: true,
      upInfoForm: {
        upCardNumber: 0,
        dimensionType: '实体卡',
        cardType: '',
        cardItem: '',
        upTime: [],
        channel: '门店',
        newCardPrice: '',
        purchaseLimit: '',
        upperTiemCheck: '1',
        grantStore: [],
        sellNum: 0,
        usedSolidNum: 0
      },
      page: {
        index: 1,
        size: 10,
        total: 0
      },
      cardShareColums,
      cardTable: [],
      conditionVisible: false,
      loading: false,
      storedLoading: false,
      rules: {
        card: [
          {
            required: true,
            message: '请输入具体卡券',
            trigger: 'change',
            validator: checkPlatType
          }
        ],
        sendStore: [{required: true, message: '请选择门店', trigger: 'change'}],
        upCardNumber: [{validator: checkUpCardNumber, trigger: 'blur'}]
      },
      tagRule: RULE,
      tagTypeList: [],
      conditionList: [],
      detailInfo: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    isView() {
      return !!this.$route.query.isView
    }
  },
  mounted() {},
  methods: {
    changeCoupon2() {
      this.optiom = []
      this.segmentObj = {}
      let data = this.$store.state.couponData
      let data2 = this.$store.state.segmentInfo
      data.map(item => {
        if (item.cardType == this.upInfoForm.cardType) {
          this.optiom.push(item)
        }
      })
      console.log('this.optiom', this.optiom)
      data2.map(item => {
        console.log('item111', item)
        if (
          item.cardType == this.upInfoForm.cardType &&
          item.cardMedium == this.upInfoForm.dimensionType
        ) {
          this.segmentObj = item
        }
        console.log('this.segmentObj', this.segmentObj)
      })
    },
    changeCoupon3() {
      this.couponObj = {}
      this.optiom.map(item => {
        if (item.cardType == this.upInfoForm.cardType) {
          this.couponObj = item
        }
      })
      let data4 = []
      this.$store.state.cardData.map(item => {
        if (
          item.cardState == '付印' &&
          item.cardType == this.upInfoForm.cardType
        ) {
          data4.push(item)
        }
      })
      this.upInfoForm.usedSolidNum = data4.length
    },
    storeChange(v) {
      this.$refs.cardTable.data.forEach(item => {
        item.store = v
      })
    },
    editableMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex == 1) {
        return {
          $type: 'el-select',
          $options: storeOptions
        }
      }
    },
    handleSizeChange(val) {
      this.page.size = val
      this.page.index = 1
      this.loadData(this.page.index, this.page.size, this.upInfoForm.cardItem)
    },
    handleCurrentChange(val) {
      this.page.index = val
      this.loadData(this.page.index, this.page.size, this.upInfoForm.cardItem)
    },
    searchCard() {
      let newStarCardNumber = ''
      let cardData = []
      let lastCardNumber = ''
      let firstCardNumber = ''
      let cardNumFrontLen = String(this.segmentObj.cardNumFront).length
      for (
        let i = Number(this.segmentObj.cardNumFirst);
        i <=
        Number(this.segmentObj.cardNumFirst) +
          Number(this.upInfoForm.upCardNumber);
        i++
      ) {
        if (
          i <
          Number(this.segmentObj.cardNumFirst) +
            Number(this.upInfoForm.upCardNumber)
        ) {
          let cardNumber =
            this.segmentObj.cardNumFront +
            (Array(this.segmentObj.cardNumLength).join('0') + String(i)).slice(
              -(this.segmentObj.cardNumLength - cardNumFrontLen)
            )
          if (
            i == Number(this.segmentObj.cardNumFirst) &&
            this.segmentObj.firstCardNumber == ''
          ) {
            firstCardNumber = cardNumber
          } else {
            firstCardNumber = this.segmentObj.firstCardNumber
          }
          lastCardNumber = cardNumber
          let obj = {
            cardType: this.segmentObj.cardType,
            cardMedium: this.segmentObj.cardMedium,
            cardNumber: cardNumber,
            createdAt: new Date().getTime(),
            cardID: new Date().getTime(),
            channel: this.upInfoForm.channel,
            couponID: this.upInfoForm.cardItem
          }
          console.log('obj', obj)
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
          Number(this.upInfoForm.upCardNumber),
        updataAt: new Date().getTime(),
        starCardNumber: newStarCardNumber,
        cardNumFirst:
          Number(this.segmentObj.cardNumFirst) +
          Number(this.upInfoForm.upCardNumber),
        lastCardNumber: lastCardNumber,
        firstCardNumber: firstCardNumber,
        upperSegment: firstCardNumber + '-' + lastCardNumber,
        upperNum:
          Number(this.segmentObj.segmentsNum) +
          Number(this.upInfoForm.upCardNumber)
      }
      console.log('updateSegment', obj2)
      this.$store.commit('addCardData', cardData)
      this.$store.commit('updateSegment', obj2)
      console.log('updateSegment.segmentInfo', this.$store.state.segmentInfo)
      this.dialogVisible = false
      this.loadData(this.page.index, this.page.size, this.upInfoForm.cardItem)
      //cardTable
    },
    searchCard2() {
      let data = this.$store.state.cardData
      let data2 = []
      let lastCardNumber = ''
      let firstCardNumber = ''
      data.filter((item, index) => {
        if (
          this.upInfoForm.dimensionType == '实体卡' &&
          index < this.segmentObj.usedSolidNum
        ) {
          if (
            item.cardType == this.upInfoForm.cardType &&
            item.cardMedium == this.upInfoForm.dimensionType &&
            item.cardState == '付印'
          ) {
            if (
              this.segmentObj.firstUsedCardNumber == '' ||
              (this.segmentObj.firstUsedCardNumber == null &&
                this.segmentObj.firstUsedCardNumber == undefined)
            ) {
              firstCardNumber = item.cardNumber
            } else {
              firstCardNumber = this.segmentObj.firstUsedCardNumber
            }
            console.log(
              'item.cardNumber > lastCardNumber',
              item.cardNumber,
              lastCardNumber,
              item.cardNumber > lastCardNumber
            )
            if (item.cardNumber > lastCardNumber) {
              lastCardNumber = item.cardNumber
            }
            let obj = {
              updateAt: new Date().getTime(),
              channel: this.upInfoForm.channel,
              couponID: this.upInfoForm.cardItem,
              cardID: item.cardID,
              grantStore: this.upInfoForm.grantStore
            }
            console.log('obj', obj)
            this.$store.commit('updateCardData', obj)
          }
        }
      })
      let obj2 = {
        segementID: this.segmentObj.segementID,
        usedSegment:
          Number(this.segmentObj.usedSegment) +
          Number(this.upInfoForm.upCardNumber),
        segmentsNum: this.segmentObj.segmentsNum - this.upInfoForm.upCardNumber,
        updataAt: new Date().getTime(),
        // starCardNumber: newStarCardNumber,
        cardNumFirst:
          Number(this.segmentObj.cardNumFirst) +
          Number(this.upInfoForm.upCardNumber),
        lastUsedCardNumber: lastCardNumber,
        firstUsedCardNumber: firstCardNumber,
        // firstCardNumber:
        upperSegment: firstCardNumber + '-' + lastCardNumber,
        upperNum:
          Number(this.segmentObj.segmentsNum) +
          Number(this.upInfoForm.upCardNumber)
      }
      this.$store.commit('updateSegment', obj2)
      this.dialogVisible = false
      this.loadData(this.page.index, this.page.size, this.upInfoForm.cardItem)
      //cardTable
    },
    loadData(ind, size, showType) {
      console.log('ind, size, showType', ind, size, showType)
      let data = this.$store.state.cardData
      let starInd = (ind - 1) * size
      let endInd = ind * size - 1
      let data2 = []
      let data3 = []
      data.filter(item => {
        if (this.upInfoForm.dimensionType != '实体卡') {
          if (
            item.cardType == this.upInfoForm.cardType &&
            item.cardMedium == this.upInfoForm.dimensionType
          ) {
            data3.push(item)
          }
        } else {
          if (
            item.cardType == this.upInfoForm.cardType &&
            item.cardMedium == this.upInfoForm.dimensionType &&
            item.cardState == '付印'
          ) {
            data3.push(item)
          }
        }
      })
      data3.map((item, index) => {
        if (this.upInfoForm.dimensionType != '实体卡') {
          if (
            index >= starInd &&
            index <= endInd &&
            index < this.segmentObj.segmentsNum
          ) {
            data2.push(item)
          }
        } else {
          if (
            index >= starInd &&
            index <= endInd &&
            index < this.upInfoForm.usedSolidNum &&
            index < this.upInfoForm.upCardNumber
          ) {
            data2.push(item)
          }
        }
      })

      this.page.total = data3.length
      console.log('data2', data2, data3)
      this.cardTable = data2
    },
    save() {
      this.$refs.cardForm.validate(valid => {
        if (valid) {
          //     upInfoForm: {
          //   upCardNumber: '',
          //   dimensionType: '',
          //   cardType: '',
          //   cardItem: '',
          //   upTime: [],
          //   channel: '商城',
          //   newCardPrice: '',
          //   purchaseLimit: '',
          //   upperTiemCheck: '1'
          // },
          if (this.upInfoForm.upperTiemCheck == '1') {
            this.upInfoForm.upTime = [new Date().getTime()]
          }
          let obj2 = {}
          if (this.upInfoForm.dimensionType == '实体卡') {
            obj2 = {
              segementID: this.segmentObj.segementID,
              usedSolidNum:
                Number(this.segmentObj.usedSolidNum) -
                Number(this.upInfoForm.upCardNumber),
              segmentsNum:
                this.segmentObj.segmentsNum - this.upInfoForm.upCardNumber
            }
            this.cardTable.map(item => {
              let obj = {
                updateAt: new Date().getTime(),
                cardID: item.cardID,
                cardState: '已发放'
              }
              this.$store.commit('updateCardData', obj)
            })
          } else {
            obj2 = {
              segementID: this.segmentObj.segementID,
              segmentsNum:
                this.segmentObj.segmentsNum - this.upInfoForm.upCardNumber
            }
          }
          console.log('obj2上架', obj2, this.$store.state.segmentInfo)
          this.$store.commit('updateSegment', obj2)

          let stockNum =
            Number(this.couponObj.stockNum) +
            Number(this.upInfoForm.upCardNumber)
          let upperTiem = new Date().getTime()
          console.log('stockNum', stockNum)
          let data = Object.assign(
            {},
            this.segmentObj,
            this.couponObj,
            this.upInfoForm,
            {
              upperState: '上架',
              upperTiem: upperTiem,
              stockNum: stockNum,
              sellNum: 0,
              grantNum:
                Number(this.couponObj.grantNum) +
                Number(this.upInfoForm.upCardNumber)
            }
          )
          console.log('测试数据', data)
          this.$store.commit('updateCouponData', data)
          this.$message.success('操作成功')
          this.updateStartSolidCard()
          this.$router.push('list')
          console.log(
            'this.$store.state.couponData',
            this.$store.state.couponData
          )
        }
      })
    },
    updateStartSolidCard() {
      let data = this.$store.state.cardData
      let data2 = this.$store.state.segmentInfo
      let data3 = {}
      let isOne = true
      data.filter((item, index) => {
        console.log('item=', item, index)
        if (isOne && item.cardState == '付印') {
          isOne = false
          data3 = item
          console.log('data3', data3)
          data2.map(item2 => {
            if (
              item2.cardType == item.cardType &&
              item2.cardMedium == item.cardMedium
            ) {
              let obj = {
                startByCard: data3.cardNumber,
                segementID: item2.segementID
              }
              this.$store.commit('updateSegment', obj)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.grant-add {
  border: 1px solid #ebebeb;
  &-label {
    width: 120px;
    text-align: right;
  }
  .el-input {
    width: auto;
  }
  .el-select {
    width: auto;
  }
  .el-form-item {
    &-label {
      width: 120px;
      text-align: right;
    }
  }
  &-title {
    position: relative;
    padding-left: 10px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
  }
}
</style>
