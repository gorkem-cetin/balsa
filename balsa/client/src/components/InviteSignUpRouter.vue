<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <InviteSignUp/>
    </Main>
  </el-container>
</template>

<script>
  import Header from "./Headers/HomeHeader.vue";
  import Main from "./Main.vue";
  import InviteSignUp from "./InviteSignUp.vue";
  export default {
    name: "InviteSignUpRouter",
    components: { Main, InviteSignUp, Header }
  };
</script>
<style scoped >
  .sub-main {
    min-height: calc(100vh - 60px);
  }
</style>

