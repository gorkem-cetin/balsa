<template>
  <el-container>
    <ProfileHeader/>
    <Main class="sub-main">
      <Profile/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import Profile from './Profile/Profile.vue';
export default {
  name: 'HelloWorld',
  components: { ProfileHeader, Main, Profile },
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

