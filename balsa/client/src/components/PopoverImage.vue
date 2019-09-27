<template >
  <div :class="{'dots':!visible}">
    <el-popover
      :visible-arrow="false"
      v-model="open"
      ref="popover"
      :placement="placement"
      width="200"
      trigger="click"
    >
      <slot name="menu" :handleMenu="handleMenu" :handleAction="handleAction" :data="data"></slot>
    </el-popover>
    <el-button type="text" class="button" v-popover:popover>
      <slot name="image"></slot>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: 'bottom',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    data: Object,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    handleMenu() {
      this.open = !this.open;
    },
    handleAction(action, data) {
    },
  },
};
</script>

<style scoped>
.button {
  padding: 0px;
  background-color: transparent;
}
</style>
