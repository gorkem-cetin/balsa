<template >
  <el-menu
    class="el-menu-demo"
    style="border-right:0"
    placement="bottom"
    mode="vertical"
    @open="true"
    @select="(data)=>handleSelect(data)"
  >
    <el-menu-item index="sorting1">Title: A to Z</el-menu-item>
    <el-menu-item index="sorting2">Title: Z to A</el-menu-item>
    <el-menu-item index="recently-viewed">Recently viewed</el-menu-item>
    <el-menu-item index="created-by-me">Created by me</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    parentProps: {
      type: Object
    }
  },
  methods: {
    handleSelect(action) {
      this.parentProps.handleMenu();
      this.parentProps.handleAction(action);
    }
  },
  created: function() {}
};
</script>

<style scoped >
.el-menu-item {
  height: 33px;
  line-height: 33px;
}
</style>
