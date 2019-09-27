<template>
  <el-row type="flex" align="bottom" justify="center">
    <div class="button-action" @click="callMenu()">
      <Logo style="margin-right:0;" />
    </div>

    <i
      class="el-icon-arrow-down icon-balsa-arrow button-action"
      style="transition: transform .4s ease-in-out;"
      :style="open ? 'transform:rotate(-180deg);':'transform:rotate(0deg);'"
    ></i>
    <div class="header-menu-balsa" :class="open ?'open-balsa-header':null">
      <el-row
        style="margin-top:60px;padding-top:20px;transition: opacity 0.1s ease-in-out;flex-direction:column"
        :class="open ? 'visible':'invisible'"
      >
        <el-row class="padding-LR-20" type="flex" align="middle">
          <Avatar />
          <div
            style="display:flex;flex-direction:column;justify-content:space-between;height:37px;"
          >
            <span style="margin-left:5px;line-height:normal;color: #007aff;">Welcome!</span>
            <span class="extra-small" style="margin-left:5px;line-height:normal">George</span>
          </div>
        </el-row>
        <Divider class="padding-LR-20" style="margin-top:10px;" />
        <el-menu-item index="/">My Drive</el-menu-item>

        <!-- <el-menu-item index="/files">Files & Folders</el-menu-item> -->

        <el-menu-item index="/activity">Activity</el-menu-item>
        <!-- <el-menu-item index="/notes">Notes</el-menu-item> -->
        <Divider class="padding-LR-20" />
        <el-menu-item>
          <InputCapsule>
            <Input filled smallPlaceHolder />
          </InputCapsule>
        </el-menu-item>
      </el-row>
    </div>
  </el-row>
</template>

<script>
import Avatar from './Avatar.vue';
import Divider from './Divider.vue';
import Input from './Input.vue';
import InputCapsule from './InputCapsule.vue';
import Logo from './Logo.vue';
export default {
  components: {
    Logo,
    Avatar,
    InputCapsule,
    Divider,
    Input,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    callMenu() {
      this.open = !this.open;
    },
  },
};
</script>

<style scoped >
.visible {
  opacity: 1;
}
.invisible::after {
  display: none;
}
.invisible {
  opacity: 0;
}

.icon-balsa-arrow {
  width: auto !important;
  font-size: 12px !important;
  color: rgb(55, 60, 63);
}
.button-action {
  position: relative;
  display: flex;
  z-index: 2;
}

.header-menu-balsa {
  position: fixed;
  background-color: white;
  top: -409px;
  z-index: 1;
  left: 0;
  width: 100%;
  height: 0;
  transition: all 1s;
  transition-timing-function: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.open-balsa-header {
  height: 100%;
  top: 0;
}
.padding-LR-20 {
  padding: 0 20px;
}
</style>
