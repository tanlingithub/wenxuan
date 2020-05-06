<template>
  <div class="card-shop-detail">
    <el-row class="card-row">
      <el-col :span="6" v-for="(item, index) in cardKyes" :key="index">
        <div class="grid-content bg-purple">
          <span class="card-prop">{{ cardDetail[item] }} :</span>
          <span class="card-value">{{ cardDes[item] }}</span>
        </div>
      </el-col>
    </el-row>
    <!-- <el-data-table v-bind="tableConfig" ref="dataTable"></el-data-table> -->
    <el-editable
      v-loading="loading"
      border
      ref="cardTable"
      :data="cardTable"
      :columns="storeDetailColums"
    ></el-editable>
    <el-pagination
      align="right"
      style="margin-top:10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
  </div>
</template>

<script>
import ElEditable from '@/components/el-editable'
import {formatDate} from '@/const/filter'
import {cardDetail} from '@/const/card'
import {commonFindOne} from '@/const/api'
import {storeDetailColums} from '@/const/card'
export default {
  name: 'card-shop-detail',
  components: {
    ElEditable
  },
  data() {
    return {
      cardDetail,
      cardKyes: [],
      storeDetailColums,
      loading: false,
      cardDes: {
        cardMedium: '',
        couponName: '',
        upperTiem: '2019-06-01',
        cardValue: '400',
        cardPrice: '100',
        applyStore: '通用门店',
        shopScope: '所有电器商品',
        useRestrictions: '满300',
        notes: '9.7'
      },
      page: {
        page: 1,
        size: 10,
        total: 4
      },
      cardTable: [
        {
          cardNumber: 'HYKST000001',
          availBalance: 1000,
          status: '侍售',
          consumptionNumber: 0,
          validTime: '永久有效',
          lastConsumptionTime: '2019/7/3'
        },
        {
          cardNumber: 'HYKST000002',
          availBalance: 1600,
          status: '已售',
          consumptionNumber: 12,
          validTime: '永久有效',
          lastConsumptionTime: '2019/7/3'
        },
        {
          cardNumber: 'HYKST000003',
          availBalance: 300,
          status: '已绑定会员',
          consumptionNumber: 2,
          validTime: '永久有效',
          lastConsumptionTime: '2019/7/3'
        },
        {
          cardNumber: 'HYKST000004',
          availBalance: 1000,
          status: '侍售',
          consumptionNumber: 0,
          validTime: '永久有效',
          lastConsumptionTime: '2019/7/3'
        }
      ]
    }
  },
  mounted() {
    // this.getList()
    this.cardKyes = Object.keys(this.cardDes)
    let id = this.$route.query.id
    let data = this.$store.state.couponData
    data.map(item => {
      if (item.couponID == id) {
        console.log('item', item)
        Object.keys(this.cardDes).forEach(k => {
          if (item[k].constructor === Array) {
            this.cardDes[k] = item[k].join('')
          } else if (k == 'upperTiem') {
            this.cardDes[k] = formatDate(item[k], 'YYYY-MM-DD')
          } else {
            this.cardDes[k] = item[k]
          }
        })
        // this.cardKyes = Object.keys(item)
        console.log('this.cardKyes', this.cardKyes)
      }
    })
  },
  methods: {
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    getList() {
      this.loading = true
      this.$axios
        .post(commonFindOne('cardSendStore'), {id: this.$route.query.id})
        .then(res => {
          this.cardTable = res.data.payload.cardTable
          let cardInfo = res.data.payload.cardInfo
          for (let key in cardInfo) {
            this.cardDes[key] = cardInfo[key]
          }
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
.card-shop-detail {
  .card-row {
    line-height: 40px;
    .card-prop {
      color: #333;
      font-size: 18px;
      margin-right: 5px;
    }
    .card-value {
      color: #545353;
    }
  }
}
</style>
