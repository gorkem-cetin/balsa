<template>
  <el-button :type="type" :plain="plain" :icon="icon">
    <slot></slot>
  </el-button>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: false
    },
    plain: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      required: false
    }
  }
};
</script>


