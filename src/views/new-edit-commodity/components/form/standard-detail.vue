<template>
  <div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column label="规格组合" width="180">
        <template slot="default" slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="市场价" width="180">
        <template slot="default" slot-scope="scope">
          <el-input :disabled="disabled" v-model="scope.row.marketPrice" />
        </template>
      </el-table-column>
      <el-table-column label="销售价">
        <template slot="default" slot-scope="scope">
          <el-input :disabled="disabled" v-model="scope.row.salePrice" />
        </template>
      </el-table-column>
      <el-table-column label="采购价">
        <template slot="default" slot-scope="scope">
          <el-input :disabled="disabled" v-model="scope.row.purchasePrice" />
        </template>
      </el-table-column>
      <el-table-column label="规格编码">
        <template slot="default" slot-scope="scope">
          <el-input :disabled="disabled" v-model="scope.row.skuCode" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    sizeNameList: Array,
    disabled: Boolean,
    defaultValue: {}
  },
  data() {
    const emptyItem = {
      name: '',
      marketPrice: '',
      salePrice: '',
      purchasePrice: '',
      skuCode: ''
    }
    return {
      emptyItem,
      tableData: []
    }
  },
  watch: {
    sizeNameList(newList) {
      // 根据传过来的props生成tableData
      const newDataList = newList.map(info => {
        const name = info.map(inner => inner.values).join('+')
        for (let item of this.tableData) {
          if (item.name === name) {
            return item
          }
        }
        return {
          ...this.emptyItem,
          ...info,
          name,
          skuSalePropertyValues: info
        }
      })
      this.tableData = newDataList
    },
    defaultValue(val) {
      if (val) {
        this.$set(this, 'tableData', val)
      } else {
        this.tableData = []
      }
    }
  },
  methods: {
    // 获取当前的dataTable值
    getValue() {
      return this.tableData || []
    }
  }
}
</script>
