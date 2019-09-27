<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <Login/>
    </Main>
  </el-container>
</template>

<script>
import Header from "./Headers/HomeHeader.vue";
import Main from "./Main.vue";
import Login from "./Login.vue";
export default {
  name: "LoginRouter",
  components: { Main, Login, Header }
};
</script>
<style scoped >
.sub-main {
  min-height: calc(100vh - 60px);
}
</style>

