<template>
  <el-container>
    <EditorHeader />
    <Main class="sub-main balsa-header-bg">
      <Editor ref="editor" />
    </Main>
  </el-container>
</template>

<script>
import EditorHeader from './Headers/EditorHeader.vue';
import Editor from './Editor.vue';
import Main from './Main.vue';
export default {
  name: 'HelloWorld',
  components: { EditorHeader, Main, Editor },
  props: {
    msg: String,
  },
};
</script>
