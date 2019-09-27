<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <Home/>
    </Main>
  </el-container>
</template>

<script>
import Header from './Headers/HomeHeader.vue';
import Home from './Home/Home.vue';
import Main from './Main.vue';
export default {
  name: 'HelloWorld',
  components: { Header, Main, Home },
  props: {
    msg: String,
  },
};
</script>
