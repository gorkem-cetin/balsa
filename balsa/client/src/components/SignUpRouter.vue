<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <SignUp/>
    </Main>
  </el-container>
</template>

<script>
import Header from "./Headers/HomeHeader.vue";
import Main from "./Main.vue";
import SignUp from "./SignUp.vue";
export default {
  name: "LoginRouter",
  components: { Main, SignUp, Header }
};
</script>
<style scoped >
.sub-main {
  min-height: calc(100vh - 60px);
}
</style>

