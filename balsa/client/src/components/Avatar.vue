<template>
  <el-image v-if="src" :src="src" :fit="fits" :class="size" class="avatar avatar-cover"></el-image>
  <el-row
    type="flex"
    justify="center"
    align="middle"
    v-else
    :class="size"
    :style="{'border':hasImage()}"
    style="background-color: #f1f2f4;"
    class="avatar avatar-cover circle"
  >{{firstLettersOfFullName()}}</el-row>
</template>

<script>
export default {
  props: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'avatar',
    },
    src: String,
  },
  data() {
    return {
      fits: 'cover',
    };
  },
  methods: {
    hasImage() {
      if (!this.src) {
        return '1px solid #e2e2e2';
      }
      return 'unset';
    },
    firstLettersOfFullName() {
      return this.firstName.charAt(0) + this.lastName.charAt(0);
    },
  },
};
</script>

<style>
.avatar {
  width: 37px;
  height: 37px;
  border-radius: 50%;
}
.mediumAvatar {
  width: 51px;
  height: 51px;
}
.smallAvatar {
  width: 37px;
  font-size: 10px;
  font-weight: 500;
  height: 37px;
  min-width: 37px;
  border-radius: 50%;
  min-height: 37px;
}

.el-image__inner {
  background-color: #7d91b6;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  /* border: 1.5px solid #ffffff; */
}
</style>
