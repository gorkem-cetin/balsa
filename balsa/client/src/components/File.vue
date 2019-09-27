<template >
  <el-row type="flex" align="middle" style="position:relative;">
    <el-col style="width:75px;">
      <slot name="image"></slot>
    </el-col>
    <el-col :span="22" :xs="24">
      <el-row type="flex" class="file-main-holder">
        <slot></slot>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {};
</script>

<style scoped>
.file-main-holder {
  align-items: center;
}
@media only screen and (max-width: 600px) {
  .file-main-holder {
    align-items: flex-end;
  }
}
</style>

