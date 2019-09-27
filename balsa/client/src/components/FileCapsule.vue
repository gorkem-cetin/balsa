<template>
  <el-row :class="{'balsa-recently-row':hoverVisible}">
    <slot name="divider"></slot>
    <el-row type="flex" align="middle">
      <slot name="default"></slot>
    </el-row>
  </el-row>
</template>

<script>
export default {
  components: {},
  props: {
    hoverVisible: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
};
</script>



<style lang="scss">
@import '../assets/sass/color.scss';
.dots {
  display: none;
}
.balsa-recently-row:hover .title {
  color: $--color-primary;
}
.balsa-recently-row:hover .dots {
  display: flex;
}
.balsa-recently-row:hover {
  background-color: #f9fafa;
  cursor: pointer;
}
.small-text-opacity {
  opacity: 0.61;
}
.small-text-color {
  color: $--color-trans;
  font-weight: 500;
}
.small-text-color-select {
  color: $--color-select;
  font-weight: 500;
}
.small-span {
  line-height: normal;
  font-size: 13px;
}
.font-medium {
}
.balsa-file-image {
  padding: 24px 0 24px 0;
}
.flex-direction-column {
  flex-direction: column;
}
</style>
