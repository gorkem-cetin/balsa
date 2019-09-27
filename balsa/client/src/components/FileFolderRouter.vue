<template>
  <el-container>
    <Header/>
    <Main class="sub-main">
      <FileFolder/>
    </Main>
  </el-container>
</template>

<script>
import Header from './Headers/HomeHeader.vue';
import Main from './Main.vue';
import FileFolder from './FileFolder.vue';
export default {
  name: 'HelloWorld',
  components: { Header, Main, FileFolder },
  props: {
    msg: String,
  },
};
</script>
<style scoped >
.sub-main {
  min-height: calc(100vh - 60px);
}
</style>
