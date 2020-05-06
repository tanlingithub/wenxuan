<template>
  <type-container title="价格库存">
    <div v-if="!disabled" class="form-item form-item--medium clearfix">
      <label for="customProperty" class="form-item__label" style="width: 90px;"
        >商品规格</label
      >
      <div class="form-item__content" style="margin-left: 90px;">
        <standard-item
          style="width:85%;"
          :list="standardList"
          @change="changeStandardItem"
        />
      </div>
    </div>
    <div class="form-item form-item--medium clearfix">
      <label
        for="customProperty"
        :class="{'form-item__label': true, required: sizeNameList.length}"
        style="width: 90px;"
        >规格明细</label
      >
      <div class="form-item__content" style="margin-left: 90px;">
        <standard-detail
          ref="standardDetail"
          style="width:85%;"
          :sizeNameList="sizeNameList"
          :defaultValue="goodsSku"
          :disabled="disabled"
        />
      </div>
    </div>
    <form-item labelName="商品编码" required>
      <el-input
        v-model="code"
        placeholder="请输入商品编码"
        :disabled="disabled"
      ></el-input>
    </form-item>
  </type-container>
</template>

<script>
import TypeContainer from './type-container'
import StandardItem from './standard-item'
import StandardDetail from './standard-detail'
import {perm2DArray} from '@/utils/index.js'
import FormItem from './form-item'

export default {
  components: {
    TypeContainer,
    StandardItem,
    StandardDetail,
    FormItem
  },
  props: {
    initList: {},
    disabled: Boolean
  },
  data() {
    return {
      sizeNameList: [], // 规格值列表
      code: '', // 商品编码
      standardList: null, // 默认的规格列表
      standardDataList: [], // 更改的规格数据列表
      goodsSku: null // 商品SKU
    }
  },
  watch: {
    initList(val) {
      // {
      //           name: '',
      //           hasImage: false,
      //           standardValues: [{values: '', image: ''}]
      //         }
      // 销售属性 ATTRIBUTE_TYPES 2
      if (val && val.length) {
        const standardList = val.reduce((arr, info) => {
          const {propertyTypes, inputValues} = info
          if (propertyTypes != '2') {
            return arr
          }
          const standardValues = inputValues
            .split(',')
            .filter(info => info)
            .map(info => {
              return {
                values: info
              }
            })
          arr.push({
            ...info,
            name: info.propertyName,
            standardValues
          })
          return arr
        }, [])
        this.standardList = standardList
      } else {
        this.standardList = val
      }
    }
  },
  methods: {
    // 设置form的值
    setFormValue(params) {
      const {code, goodsSku, goodsPropertyValue} = params
      this.code = code
      this.goodsSku = goodsSku.map(info => {
        const {skuSalePropertyValues} = info
        const name = skuSalePropertyValues
          .map(inner => inner.salePropertyValue)
          .join('+')
        return {
          ...info,
          name
        }
      })
      const standardList = goodsPropertyValue.reduce((arr, info) => {
        const {type, propertyValue} = info
        if (type != '2') {
          return arr
        }
        const standardValues = propertyValue
          .split(',')
          .filter(info => info)
          .map(info => {
            return {
              values: info
            }
          })
        arr.push({
          ...info,
          name: info.propertyName,
          standardValues
        })
        return arr
      }, [])
      this.standardList = standardList
    },
    // 去除form的值
    getFormValue() {
      return new Promise((resolve, rejects) => {
        if (!this.code) {
          this.$notify.error('请填写商品编码')
          return
        }
        const standardDetailValue = this.$refs.standardDetail.getValue()
        const targetVal = standardDetailValue.map((info, index) => {
          const {marketPrice, skuCode, salePrice, purchasePrice} = info || {}
          let skuSalePropertyValues = []
          let sizeNameListItem = this.sizeNameList[index]
          if (sizeNameListItem) {
            skuSalePropertyValues = sizeNameListItem.map(inner => {
              const {parent, values} = inner || {}
              const salePropertyName = parent && parent.name ? parent.name : ''
              if (parent && parent.id !== undefined) {
                return {
                  ...inner,
                  goodsPropertyId: parent.id,
                  salePropertyValue: values,
                  salePropertyName
                }
              }
              return {
                ...inner,
                salePropertyValue: values,
                salePropertyName
              }
            })
          }

          return {
            ...info,
            skuCode,
            marketPrice,
            salePrice,
            purchasePrice,
            saleStatus: true,
            skuSalePropertyValues
          }
        })
        if (
          targetVal.some(
            info =>
              !info.marketPrice ||
              !info.salePrice ||
              !info.purchasePrice ||
              !info.skuCode
          )
        ) {
          this.$notify.error('请填写完整的规格明细信息！')
          return
        }

        const goodsPropertyValue = this.standardDataList.map((info, index) => {
          const propertyValue = info.standardValues
            .map(info => info.values)
            .join(',')
          const propertyCode = info.propertyCode || new Date().getTime() + index
          return {
            ...info,
            propertyCode,
            type: 2, // 属性类型，1：关键属性，2：销售属性，3：非关键属性'
            relationId: info.id,
            propertyName: info.name,
            propertyValue: propertyValue || '',
            sort: 0
          }
        })
        resolve({
          goodsSku: targetVal,
          code: this.code,
          extGoodsPropertyValue: goodsPropertyValue
        })
      })
    },
    // 重置form表单的值
    resetFormValue() {
      this.$refs.priceInfo.resetFields()
    },
    // 更改商品规格的值
    changeStandardItem(dataList) {
      // 联动更改规格明细
      // 获取value列表
      // 应该将父也塞进去
      const list2D = dataList.map(info => {
        return info.standardValues.map(inner => {
          return {
            ...inner,
            parent: info
          }
        })
      })
      this.standardDataList = dataList
      this.sizeNameList = perm2DArray(list2D)
    }
  }
}
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 22px;

  &::before {
    display: table;
    content: '';
  }

  .form-item__label {
    vertical-align: middle;
    line-height: 36px;
    text-align: right;
    float: left;
    font-size: 14px;
    color: #2d303b;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  .required {
    &::before {
      content: '*';
      color: #e24156;
      margin-right: 4px;
    }
  }

  .form-item__content {
    line-height: 36px;
    position: relative;
    font-size: 14px;

    &::before {
      display: table;
      content: '';
    }
  }
}
</style>
