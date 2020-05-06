<template>
  <div class="standard-container">
    <div v-for="(item, index) in dataList" :key="index">
      <div class="standard-title">
        <div class="label">规格名:</div>
        <div class="input">
          <el-input v-model="item.name" disabled=""></el-input>
        </div>
        <div class="check-box" v-if="hasImage">
          <el-checkbox
            :disabled="disabled"
            :checked="item.hasImage"
            @change="setComponentData(item, $event)"
            >添加规格图片</el-checkbox
          >
        </div>
        <el-button
          class="deleteBtn"
          type="text"
          icon="el-icon-error"
          :disabled="disabled"
          @click="deleteItem(index)"
        ></el-button>
      </div>
      <div class="standard-value">
        <div class="label">规格值:</div>
        <div class="value-list">
          <div
            class="input"
            v-for="(inner, innerIndex) in item.standardValues"
            :key="innerIndex"
          >
            <i
              v-if="!disabled"
              type="text"
              @click="deleteStandardValue(item, index, innerIndex)"
              icon="el-icon-error"
              class="del-icon"
            ></i>
            <el-input
              v-model="inner.values"
              size="small"
              @change="changeInputValue"
            />
            <div class="img-container" v-if="item.hasImage">
              <upload-to-ali v-model="inner.image" :disabled="disabled" />
            </div>
          </div>
          <div class="input">
            <el-button type="text" @click="addValue(item)"
              >添加规格值</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="standard-title" style="display: none;">
      <el-button
        size="small"
        v-if="dataList.length < 3"
        type="primary"
        @click="addStandardItem"
        >添加规格项目</el-button
      >
      <el-button type="text">自定义排序</el-button>
    </div>
  </div>
</template>

<script>
import UploadToAli from '@femessage/upload-to-ali'
import AutocompleteInput from '@/components/autocomplete-input/index'

// {
//           name: '',
//           hasImage: false,
//           standardValues: [{values: '', image: ''}]
//         }
export default {
  name: 'StandardItem',
  components: {
    UploadToAli,
    AutocompleteInput
  },
  props: {
    disabled: Boolean,
    list: {}
  },
  data() {
    return {
      hasImage: false, // 暂时先隐藏图片数据
      dataList: [] // 默认选中值
    }
  },
  watch: {
    list(val) {
      this.$set(this, 'dataList', val)
      this.emitChange()
    }
  },
  methods: {
    // 设置当前选中取消
    setComponentData(item, val) {
      // 强制刷新视图
      this.$set(item, 'hasImage', val)
    },
    // 添加规格值
    addValue(item) {
      const emptyValue = [{values: '', image: ''}]
      const newList = item.standardValues.concat(emptyValue)
      this.$set(item, 'standardValues', newList)
    },
    // 添加规格项
    addStandardItem() {
      const emptyItem = [
        {
          name: '',
          hasImage: false,
          standardValues: [{values: '', image: ''}]
        }
      ]
      this.dataList = this.dataList.concat(emptyItem)
    },
    // 删除某一项
    deleteItem(index) {
      this.dataList.splice(index, 1)
      this.emitChange()
    },
    // 获取所有的设值
    getTotalValue() {
      return this.dataList
    },
    // 删除具体的某一项
    deleteStandardValue(item, parentIndex, standardIndex) {
      // 获取原来的某一项
      const parentItem = this.dataList[parentIndex]
      // 将某一项删除，生成新的项
      let standardValues = parentItem.standardValues
      standardValues.splice(standardIndex, 1)
      this.$set(item, 'standardValues', standardValues)
      this.emitChange()
    },
    // 设置form表单的值
    setFormValue(dataList) {
      this.dataList = dataList
    },
    // 获取form表单的值
    getFormValue() {
      return this.dataList
    },
    // 重置form表单的值
    resetFormValue() {
      this.dataList = []
    },
    // 更改规格名
    changeInputValue() {
      this.emitChange()
    },
    emitChange() {
      this.$nextTick(() => {
        this.$emit('change', this.dataList)
      })
    },
    // 更改输入值
    changeInput(index, item) {
      const {inputValues} = item || {}
      const initStandardValues = inputValues
        .toString()
        .split(',')
        .map(info => {
          return {
            values: info,
            image: ''
          }
        })
      this.$set(this.dataList[index], 'standardValues', initStandardValues)
      this.emitChange()
    }
  }
}
</script>

<style lang="less">
.standard-container {
  .standard-title {
    position: relative;
    display: flex;
    background-color: @--background-color-base;
    padding: 8px 15px;

    .label {
      width: 60px;
    }

    .input {
      margin: 0 10px;
    }

    .deleteBtn {
      position: absolute;
      right: 20px;
      color: #e24156;
    }
  }

  .standard-value {
    display: flex;
    padding: 20px 15px 5px;

    .label {
      width: 90px;
    }

    .value-list {
      display: flex;
      flex-wrap: wrap;

      .input {
        position: relative;
        padding-bottom: 10px;
        margin: 0 10px;

        .del-icon {
          position: absolute;
          right: -8px;
          top: -8px;
          width: 16px;
          height: 16px;
          background-color: #cad1e8;
          border-radius: 50%;
          line-height: 16px;
          transform: rotate(45deg);
          z-index: 1;
          cursor: pointer;

          &::before {
            width: 1px;
            height: 8px;
            background: #fff;
          }

          &::after {
            width: 8px;
            height: 1px;
            background: #fff;
          }

          &::before,
          &::after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    .img-container {
      padding-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
