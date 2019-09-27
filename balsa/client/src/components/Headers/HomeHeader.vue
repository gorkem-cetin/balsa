<template>
  <el-header>
    <NavMenu/>
  </el-header>
</template> 

<script>
import NavMenu from "../NavMenu.vue";

export default {
  components: { NavMenu }
};
</script>

<style scoped>
.el-menu-demo {
  display: flex;
}
.el-header {
  z-index: 999;
  position: fixed;
  width: 100%;
  padding: 0;
}
</style>

