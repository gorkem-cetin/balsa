<template>
  <el-container>
    <Header />
    <Main class="sub-main">
      <Activities />
    </Main>
  </el-container>
</template>

<script>
import Header from './Headers/HomeHeader.vue';
import Main from './Main.vue';
import Activities from './Activities.vue';
export default {
  name: 'MyActivities',
  components: { Header, Main, Activities },
};
</script>


