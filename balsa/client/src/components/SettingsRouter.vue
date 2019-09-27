<template>
  <el-container>
    <ProfileHeader/>
    <Main class="sub-main">
      <Settings/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import Settings from './Profile/Settings.vue';
export default {
  name: 'HelloWorld',
  components: { ProfileHeader, Main, Settings },
  props: {
    msg: String,
  },
};
</script>
<style>
.el-form--label-top label {
  padding-bottom: 0px !important;
}
</style>

