<template>
  <div class="commodity-detail-container">
    <form-item labelName="所属类目" required v-model="categoryId">
      <div v-if="ifEdit">
        <el-cascader
          v-model="parentIdArr"
          @change="handleItemChange"
          :options="parentIdOptions"
          v-bind="cascaderBind"
        ></el-cascader>
        <el-button
          type="text"
          style="margin-left: 10px;"
          v-show="parentIdArr.length"
          size="small"
          @click="emptyParentIdArr"
          >清空</el-button
        >
        <el-button
          type="text"
          style="margin-left: 10px;"
          v-show="categoryId !== null"
          size="small"
          @click="resetParentIdArr"
          >取消</el-button
        >
      </div>

      <div v-else>
        <span>{{ categoryName }}</span>
        <el-button
          v-if="!disabled"
          type="text"
          size="small"
          @click="changeParent"
          >修改</el-button
        >
      </div>
    </form-item>
    <basic-info
      ref="basicInfo"
      :disabled="disabled"
      :propertyList="propertyList"
    />
    <detail-info ref="detailInfo" :disabled="disabled" />
    <price-info
      ref="priceInfo"
      :disabled="disabled"
      :initList="sizePropertyList"
    />
    <div class="foot-container" v-if="!disabled">
      <el-button class="save-btn" type="primary" @click="addNewCommodity">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import BasicInfo from './components/form/basic-info'
import DetailInfo from './components/form/detail-info'
import PriceInfo from './components/form/price-info'
import {
  getCommodityGoods,
  getCategoryProperty,
  putCommodityGoods,
  getAfterCategorysList
} from '@/service/spaas-commodity-center'
import FormItem from './components/form/form-item'
import {treeToArray, arrayToTree} from '@/utils/tree-utils'

export default {
  components: {
    BasicInfo,
    DetailInfo,
    PriceInfo,
    FormItem
  },
  props: {
    disabled: Boolean
  },
  data() {
    const {commodityId} = this.$route.query
    return {
      commodityId,
      goodData: null, // 商品信息
      categoryId: null, //
      categoryName: null,
      commodityDetail: null, // 商品详情信息
      ifEdit: false, // 是否要编辑父属性
      parentIdOptions: [], // 父属性ID
      parentIdArr: [], // 选中的节点ID
      cascaderBind: {
        'show-all-levels': false,
        placeholder: '请选择',
        props: {
          label: 'name',
          value: 'id',
          children: 'children'
        }
      },
      propertyList: null, // 自定义属性列表
      sizePropertyList: null // 销售商品规格
    }
  },
  async created() {
    // 请求商品详情
    this.getCategoryList()
    await this.getCommodityDetail()
  },
  watch: {
    parentIdArr(val) {
      if (val && val.length) {
        this.categoryId = val[val.length - 1]
      }
    },
    categoryId(val, oldVal) {
      if (val !== oldVal) {
        this.$nextTick(async () => {
          await this.fetchPropertyTree()
          this.$refs.priceInfo.setFormValue(this.goodData)
        })
      }
    }
  },
  methods: {
    getCommodityDetail() {
      getCommodityGoods({id: this.commodityId}).then(res => {
        const {payload, code} = res.data
        if (payload && code === '0') {
          this.commodityDetail = payload
          const {name, subName, category} = payload
          this.categoryId = category.id
          this.categoryName = category.name
          this.goodData = payload
          // 将对应的form设值
          this.$refs.basicInfo.setFormValue(payload)
          this.$refs.detailInfo.setFormValue(payload)
        }
      })
    },
    // 新建商品
    async addNewCommodity() {
      // this.$refs.basicInfo.resetFormValue();
      const basicInfoValue = await this.$refs.basicInfo.getFormValue()
      const detailInfoValue = await this.$refs.detailInfo.getFormValue()
      const priceInfoValue = await this.$refs.priceInfo.getFormValue()
      // 因为都很快拿到数据，所以就不用Promise.all写了
      if (basicInfoValue && detailInfoValue) {
        const {goodsPropertyValue = []} = basicInfoValue
        const {extGoodsPropertyValue = []} = priceInfoValue
        const newList = goodsPropertyValue.concat(extGoodsPropertyValue)
        const res = await putCommodityGoods(this.commodityId, {
          ...this.goodData,
          categoryId: this.categoryId,
          ...basicInfoValue,
          ...detailInfoValue,
          ...priceInfoValue,
          goodsPropertyValue: newList
        })
        const {payload, code} = res.data
        if (payload && code === '0') {
          this.$notify.success('修改成功')
          this.$router.back()
        } else {
          this.$notify.error('修改失败，请重试')
        }
      } else {
        this.$notify.error('请填写完整信息')
      }
    },
    // 编辑属性
    changeParent() {
      this.ifEdit = true
    },
    // 清空选中的值
    emptyParentIdArr() {
      this.parentIdArr = []
    },
    // 恢复选中的值
    resetParentIdArr() {
      this.parentIdArr = []
      // 取消编辑
      this.ifEdit = false
    },
    getCategoryList() {
      this.categoryLoading = true
      getAfterCategorysList()
        .then(res => {
          const {code, payload} = res.data
          if (code === '0') {
            const arrayTree = treeToArray(
              payload,
              {
                parentId: null,
                level: 0,
                path: '',
                children: 'children'
              },
              true
            )
            const emptyChildArr = arrayTree.map(info => {
              return {
                ...info,
                children: info.leaf ? null : []
              }
            })
            const treeArray = arrayToTree(emptyChildArr)
            // 将树扁平化，然后再构建树（如果是子节点，则不再显示children）
            this.parentIdOptions = treeArray
          }
        })
        .catch(() => {})
        .finally(() => {
          this.categoryLoading = false
        })
    },
    // 选中节点，按需加载下一级。目前限制住两级
    handleItemChange(idList) {
      return
      // 目前限制住两级
      if (idList.length > 2) return
      const firstId = idList[0]
      getCommodityPropertyParents({id: firstId}).then(res => {
        const {payload} = res
        if (payload) {
          const newPayload = payload.map(info => {
            delete info.children
            return info
          })
          // 将当前的数据添加到父节点中
          this.parentIdOptions = this.parentIdOptions.map(info => {
            if (info.id === firstId) {
              return {
                ...info,
                children: newPayload
              }
            }
            return info
          })
        }
      })
    },
    // 请求属性列表树
    fetchPropertyTree() {
      const params = {
        size: 999,
        relation: true,
        page: 1
      }
      return getCategoryProperty({id: this.categoryId}, params).then(res => {
        const {code, payload} = res.data
        if (code === '0' && payload) {
          // 将树扁平化
          const propertyList = treeToArray(
            payload,
            {parentId: 'parentId', level: 0, children: 'children'},
            true
          )
          this.$set(this, 'propertyList', propertyList)
          // 设置默认值列表
          // const sizePropertyList = propertyList.filter(info => info.propertyTypes)
          // this.$set(this, 'sizePropertyList', sizePropertyList)
        }
      })
    }
  }
}
</script>

<style lang="less">
.commodity-detail-container {
  padding: 20px;

  .el-textarea {
    width: 35%;
  }

  .foot-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;

    .save-btn {
      width: 200px;
    }
  }
}
</style>
