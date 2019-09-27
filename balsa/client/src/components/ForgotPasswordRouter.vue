<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <ForgotPassword/>
    </Main>
  </el-container>
</template>

<script>
import Header from "./Headers/HomeHeader.vue";
import Main from "./Main.vue";
import ForgotPassword from "./ForgotPassword.vue";
export default {
  name: "ForgotPasswordRouter",
  components: { Main, ForgotPassword, Header }
};
</script>
<style scoped >
.sub-main {
  min-height: calc(100vh - 60px);
}
</style>

