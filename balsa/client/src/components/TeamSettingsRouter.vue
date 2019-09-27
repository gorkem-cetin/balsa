<template>
  <el-container>
    <ProfileHeader/>
    <Main class="sub-main">
      <TeamSettings/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import TeamSettings from './Profile/TeamSettings.vue';
export default {
  name: 'HelloWorld',
  components: { ProfileHeader, Main, TeamSettings },
};
</script>



