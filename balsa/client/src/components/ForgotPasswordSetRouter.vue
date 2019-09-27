<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <ForgotPasswordSet/>
    </Main>
  </el-container>
</template>

<script>
  import Header from "./Headers/HomeHeader.vue";
  import Main from "./Main.vue";
  import ForgotPasswordSet from "./ForgotPasswordSet.vue";
  export default {
    name: "ForgotPasswordSetRouter",
    components: { Main, ForgotPasswordSet, Header }
  };
</script>
<style scoped >
  .sub-main {
    min-height: calc(100vh - 60px);
  }
</style>

