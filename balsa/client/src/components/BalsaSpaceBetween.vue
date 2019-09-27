<template>
  <el-row type="flex" align="middle" justify="space-between" class="balsa-space-between-row">
    <h1 class="balsa-h1-row" style="margin:0;">{{text}}</h1>
    <el-button
      type="success"
      @click="createFile()"
      :plain="false"
      icon="el-icon-plus"
      class="semi-medium-font"
    >{{buttonText}}</el-button>
  </el-row>
</template>

<script>
import Button from './Button.vue';
import gql from 'graphql-tag';
import { MY_FILES_QUERY, RECENT_FILES_QUERY, ALL_FOLDERS_QUERY } from '../queries';
export default {
  components: {
    Button,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    buttonText: String,
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
                user {
                  id
                  firstName
                  lastName
                }
                updatedAt
              }
            }
          `,
          variables: {
            folderId: undefined,
          },
        })
        .then(({ data }) => {
          this.$router.push({ name: 'editor', params: { id: data.createFile.id } });
        });
    },
  },
};
</script>


