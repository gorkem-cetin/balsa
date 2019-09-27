<template>
  <el-row>
    <el-button :plain="true" @click="open6">success</el-button>
    <el-button :plain="true" @click="open8">error</el-button>
  </el-row>
</template>

<script>
export default {
  methods: {
    open6() {
      this.$message({
        showClose: true,
        duration: '3000',
        message: 'Congrats, this is a success message.',
        type: 'success',
      });
    },

    open8() {
      this.$message({
        showClose: true,
        duration: '3000',
        message: 'Oops, this is a error message.',
        type: 'error',
      });
    },
  },
};
</script>

<style>
</style>
