<template>
  <el-container>
    <ProfileHeader/>
    <Main class="sub-main">
      <System/>
    </Main>
  </el-container>
</template>

<script>
import ProfileHeader from './Headers/ProfileHeader.vue';
import Main from './Main.vue';
import System from './Profile/System.vue';
export default {
  name: 'HelloWorld',
  components: { ProfileHeader, Main, System },
};
</script>


