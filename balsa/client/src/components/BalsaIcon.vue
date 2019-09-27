<template>
  <el-row type="flex" justify="center">
    <img :src="getImgUrl(icon)" alt="balsa" class="balsa-file-image">
  </el-row>
</template>

<script>
export default {
  methods: {
    getImgUrl(icon) {
      return require("../assets/" + icon);
    }
  },
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};
</script>
