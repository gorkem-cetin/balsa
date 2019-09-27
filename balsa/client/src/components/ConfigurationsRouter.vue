<template>
  <el-container>
    <ProfileHeader/>
    <Main class="sub-main">
      <Configurations/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import Configurations from './Profile/Configurations.vue';
export default {
  name: 'HelloWorld',
  components: { ProfileHeader, Main, Configurations },
};
</script>


