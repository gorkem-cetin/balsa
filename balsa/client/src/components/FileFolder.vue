<template>
  <div class="balsa-container">
    <el-row>
      <el-row type="flex" align="middle" justify="space-between" class="balsa-space-between-row">
        <h1 class="balsa-h1-row">Files & Folders</h1>
        <el-row type="flex">
          <el-button
            style="margin-right:10px;"
            type="success"
            @click="createFile"
            :plain="false"
            icon="el-icon-files"
            class="semi-medium-font"
          >Create File</el-button>
          <CreateFolder />
        </el-row>
      </el-row>
      <TabContainer class="margin-top-25"></TabContainer>
    </el-row>
  </div>
</template>

<script>
import CreateFolder from './CreateFolder.vue';
import TabContainer from './TabContainer.vue';
import gql from 'graphql-tag';
import { ALL_FOLDERS_QUERY, RECENT_FILES_QUERY, MY_FILES_QUERY } from '../queries';

export default {
  components: {
    TabContainer,
    CreateFolder,
  },
  methods: {
    createFile() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createFile($content: String, $folderId: Int) {
              createFile(content: $content, folderId: $folderId) {
                id
                name
                content
                updatedAt
                user {
                  id
                  firstName
                  lastName
                }
              }
            }
          `,
          variables: {
            content: '{"type":"doc","content":[{"type":"paragraph"}]}',
            folderId: parseInt(this.$route.params.id),
          },
        })
        .then(({ data }) => {
          this.$router.push({ name: 'editor', params: { id: data.createFile.id } });
        });
    },
    createFolder() {
    },
  },
};
</script>

<style>
.margin-top-25 {
  margin-top: 25px;
}

@media only screen and (max-width: 600px) {
  .margin-top-25 {
    margin-top: 40px;
  }
}
</style>
