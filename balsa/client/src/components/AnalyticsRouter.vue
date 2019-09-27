<template>
  <el-container>
    <ProfileHeader/>
    <Main>
      <Analytics/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import Analytics from './Profile/Analytics.vue';
export default {
  name: 'MyAnalytics',
  components: { ProfileHeader, Main, Analytics },
};
</script>


