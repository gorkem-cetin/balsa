<template >
  <el-menu
    class="el-menu-demo"
    style="border-right:0"
    placement="bottom"
    mode="vertical"
    @open="true"
    @select="(data)=>handleSelect(data)"
  >
    <router-link to="/editor">
      <el-menu-item index="edit">Edit</el-menu-item>
    </router-link>
    <el-menu-item index="share">Share</el-menu-item>
    <el-menu-item index="invite">Invite people</el-menu-item>
    <el-menu-item index="duplicate">Duplicate</el-menu-item>
    <el-menu-item index="copy-link">Copy link</el-menu-item>
    <el-menu-item index="rename">Rename</el-menu-item>
    <el-menu-item index="delete">Delete</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    parentProps: {
      type: Object,
    },
  },
  methods: {
    //action is an index prop. edit,share,invite...
    handleSelect(action) {
      //open or close menu
      this.parentProps.handleMenu();
      //notify which action is selected
      this.parentProps.handleAction(action);
    },
  },
  created: function() {},
};
</script>

<style scoped >
.el-menu-demo {
  flex-direction: column;
}
.el-menu-item {
  font-size: 15px;
  
  font-weight: 500;
  height: 33px;
  line-height: 33px;
}
</style>
