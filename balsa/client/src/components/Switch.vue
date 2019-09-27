<template>
  <el-row type="flex" class="balsa-switch-container">
    <el-switch
      @change="((data)=>change(data,dat))"
      v-for="(dat,index) in switches"
      :key="index"
      v-model="dat.value"
      :active-text="dat.text"
    ></el-switch>
  </el-row>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      required: true,
      default: [],
    },
  },
  methods: {
    change(data, dat) {
    },
  },
};
</script>

<style scoped>
.balsa-switch-container {
  flex-direction: column;
}
.balsa-switch-container .el-switch {
  margin: 8px 0px;
}
</style>
