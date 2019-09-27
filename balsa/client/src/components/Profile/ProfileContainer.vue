<template>
  <el-row type="flex" justify="center" align="middle" class="profile-container">
    <el-col :xl="22" :lg="22" :xs="24">
      <el-row>
        <el-col :xl="3" :lg="4" class="profile-menu hidden-xs-only">
          <ProfileTab />
        </el-col>
        <el-col
          :lg="{span:16,offset:6}"
          :md="{span:18,offset:5}"
          :sm="{span:15,offset:6}"
          :xl="{span:13,offset:6}"
          :xs="24"
        >
          <slot></slot>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import ProfileTab from '../ProfileTab.vue';
import 'element-ui/lib/theme-chalk/display.css';
export default { components: { ProfileTab } };
</script>

<style scoped>
.profile-menu {
  position: fixed;
}
@media only screen and (max-width: 600px) {
  .profile-menu {
    position: unset;
  }
}
</style>
