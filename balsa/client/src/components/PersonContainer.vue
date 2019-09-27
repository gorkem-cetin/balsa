<template>
  <el-row>
    <span class="title">{{firstName+' '+lastName}}</span>
    <el-row>
      <span class="small-span small-text-color">{{email}}</span>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    firstName: {
      type: String,
      required: true,
      default: ""
    },
    lastName: {
      type: String,
      required: true,
      default: ""
    },
    email: {
      type: String,
      required: true,
      default: ""
    }
  }
};
</script>

<style>
</style>
