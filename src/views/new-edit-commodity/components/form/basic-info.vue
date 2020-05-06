<!-- 基本信息 -->
<template>
  <div class="basic-info-container">
    <type-container title="基本信息">
      <el-form-renderer
        :content="nameContent"
        label-width="90px"
        ref="topForm"
        :disabled="disabled"
      >
      </el-form-renderer>
      <div class="item-info">
        在商品详情页标题下面展示卖点信息，建议60字以内
      </div>
      <div class="dot-line"></div>
      <div v-if="propertyList">
        <form-item
          v-for="(item, index) in list"
          :key="index"
          :labelName="item.propertyName"
        >
          <el-select
            :disabled="disabled"
            v-if="item.inputType == '1'"
            v-model="item.propertyValue"
            class="form-item"
          >
            <el-option
              v-for="(inner, index) in item.inputList"
              :key="index"
              :label="inner.value"
              :value="inner.value"
            >
            </el-option>
          </el-select>
          <AutocompleteInput
            class="form-item"
            v-else
            :disabled="disabled"
            v-model="item.propertyValue"
            :list="item.inputList"
          />
        </form-item>
      </div>
      <form-item labelName="自定义属性">
        <key-value-group
          v-model="customProperty"
          :disabled="disabled"
          :props="defaultProps"
        />
      </form-item>
    </type-container>
  </div>
</template>

<script>
import TypeContainer from './type-container'
import KeyValueGroup from './key-value-group'
import FormItem from './form-item'
import AutocompleteInput from '@/components/autocomplete-input/index.vue'
export default {
  name: 'BasicInfo',
  components: {
    TypeContainer,
    KeyValueGroup,
    FormItem,
    AutocompleteInput
  },
  props: {
    disabled: Boolean,
    propertyList: {}
  },
  data() {
    return {
      nameContent: [
        {
          $id: 'name',
          $type: 'input',
          label: '商品名称',
          $el: {
            style: 'width:35%',
            placeholder: '请输入'
          },
          rules: [{required: true, message: '请输入商品名称', trigger: 'blur'}]
        },
        {
          $id: 'subName',
          $type: 'input',
          label: '副标题',
          $el: {
            type: 'textarea',
            maxlength: 60,
            style: 'width:35%',
            placeholder: '请输入'
          },
          rules: [{required: true, message: '请输入副标题', trigger: 'blur'}]
        }
      ],
      defaultProps: {
        key: 'propertyName',
        value: 'propertyValue'
      },
      list: null,
      customProperty: null, // 自定义属性
      newList: null // 商品属性信息
    }
  },
  watch: {
    propertyList(val) {
      if (val) {
        this.list = val.reduce((arr, info) => {
          const {propertyTypes} = info
          // 销售属性 ATTRIBUTE_TYPES 2
          if (propertyTypes == '2') {
            return arr
          }
          const inputValues = info.inputValues || ''
          const inputList = inputValues
            .split(',')
            .filter(info => info)
            .map(info => ({value: info}))
          // 输入方式，1：多选，2：输入
          let targeItem = {}
          if (this.newList) {
            for (let item of this.newList) {
              if (item.relationId == info.id) {
                targeItem = item
                break
              }
            }
          }
          const propertyValue = targeItem.propertyValue || ''
          arr.push({
            ...info,
            propertyName: info.propertyName,
            propertyValue,
            relationId: info.id,
            inputList,
            inputType: info.inputType
          })
          return arr
        }, [])
      } else {
        this.list = null
      }
    }
  },
  methods: {
    // 设置form的值
    setFormValue(params) {
      const {name, subName, goodsPropertyValue} = params
      this.$refs.topForm.updateForm({
        name,
        subName
      })
      // 获取原来的属性数组，去重，优先保存修改前的数据
      let newList = []
      let customProperty = []
      goodsPropertyValue &&
        goodsPropertyValue.forEach(info => {
          const {type} = info
          if (type == 1) {
            newList.push({
              ...info,
              propertyName: info.propertyName,
              propertyValue: info.propertyValue,
              relationId: info.relationId
            })
          } else if (type != '2') {
            customProperty.push({
              ...info,
              propertyName: info.propertyName || '',
              propertyValue: info.propertyValue || ''
            })
          }
        })
      this.customProperty = customProperty
      this.newList = newList
    },
    // 去除form的值
    async getFormValue() {
      const $topForm = this.$refs.topForm
      try {
        const valiTopForm = await $topForm.validate()
        if (valiTopForm) {
          // 将返回form表单的值
          const {name, subName} = $topForm.getFormValue()
          const bottomFormValue = this.list
          let goodsPropertyValue = []
          const defaultValue = {
            type: 4, // 1：类目直接关联的属性的值；2：类目与属性组关联的属性的值；3：类目与品牌关联的值；4：商品SPU自定义扩展的属性值
            relationId: 0,
            sort: 0
          }
          bottomFormValue &&
            bottomFormValue.forEach((info, index) => {
              const propertyCode =
                info.propertyCode || new Date().getTime() + index
              goodsPropertyValue.push({
                ...info,
                ...defaultValue,
                type: 1,
                propertyCode,
                relationId: info.relationId,
                propertyName: info.propertyName,
                propertyValue: info.propertyValue || ''
              })
            })
          this.customProperty &&
            this.customProperty.forEach((info, index) => {
              const propertyCode =
                info.propertyCode || new Date().getTime() + index
              goodsPropertyValue.push({
                ...info,
                ...defaultValue,
                propertyCode,
                propertyName: info.propertyName,
                propertyValue: info.propertyValue || ''
              })
            })
          return {
            name,
            subName,
            goodsPropertyValue
          }
        } else {
          this.$notify.error('请填写完整信息')
          return null
        }
      } catch (err) {}
    },
    // 重置form表单的值
    resetFormValue() {
      this.$refs.topForm.resetFields()
      this.$refs.bottomForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.basic-info-container {
  .item-info {
    margin-left: 90px;
    margin-top: -20px;
    padding: 10px 0 0 10px;
    font-size: 12px;
    color: @--color-text-secondary;
  }

  .dot-line {
    margin: 20px 0;
    border-bottom: 2px dotted @--border-color-base;
  }

  .form-item {
    width: 100%;
  }
}
</style>
