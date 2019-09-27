<template >
  <el-menu
    class="el-menu-demo"
    style="border-right:0"
    placement="bottom"
    mode="vertical"
    @open="true"
    @select="(data)=>handleSelect(data)"
  >
    <el-menu-item index="add-to-folder">Copy to clipboard</el-menu-item>
    <el-menu-item index="add-to-favorites">Clear server log</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    parentProps: {
      type: Object,
    },
  },
  components: {},
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
.divider-margin {
  margin: 5px 0;
}
.balsa-divider {
  padding: 10px;
}
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
