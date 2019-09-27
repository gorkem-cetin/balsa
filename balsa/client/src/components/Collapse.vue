
<template>
  <el-row>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="3">
        <template slot="title">
          <div class="full-width">
            <slot name="title"></slot>
          </div>
        </template>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['3'],
    };
  },
  methods: {
    handleChange(val) {
    },
  },
};
</script>

<style scoped>
</style>


