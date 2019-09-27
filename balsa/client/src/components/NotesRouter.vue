<template>
  <el-container>
    <HomeHeader/>
    <Main class="sub-main">
      <Notes/>
    </Main>
  </el-container>
</template>

<script>
import HomeHeader from './Headers/HomeHeader.vue';
import Main from './Main.vue';
import Notes from './Notes.vue';
export default {
  name: 'HelloWorld',
  components: { HomeHeader, Main, Notes },
  props: {
    msg: String,
  },
};
</script>
<style>
.el-form--label-top label {
  padding-bottom: 0px !important;
}
</style>

