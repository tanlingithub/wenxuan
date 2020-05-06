<template>
  <div>
    <InputTable v-model="arr" />
  </div>
</template>

<script>
import InputTable from '@/components/input-table/index.vue'

export default {
  components: {
    InputTable
  },
  data() {
    return {
      arr: [{value: 1}]
    }
  }
}
</script>
