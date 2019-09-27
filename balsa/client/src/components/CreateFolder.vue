<template>
  <el-row>
    <span @click="dialogOpen">
      <slot>
        <el-button
          type="text"
          :plain="false"
          icon="el-icon-folder"
          class="semi-medium-font"
        >Create Folder</el-button>
      </slot>
    </span>

    <el-dialog
      @opened="triggerFocus"
      title="Folder Name"
      :visible.sync="dialogVisible"
      custom-class="create-folder-dialog"
    >
      <el-form @submit.native.prevent="accept">
        <span>Type your folder name.</span>
        <el-row style="margin-top:20px;">
          <el-input
            v-if="dialogVisible"
            id="createFolderInput"
            :autofocus="true"
            filled
            placeholder="Please input"
            v-model="input"
          ></el-input>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="text"
          class="cancel-balsa"
          @click="dialogVisible = false"
          style="margin-right:16px;"
        >Cancel</el-button>
        <el-button type="primary" @click="accept">Confirm</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      dialogVisible: false,
      input: '',
    };
  },
  methods: {
    triggerFocus() {
      var el = document.getElementById('createFolderInput');
      if (el) {
        el.focus();
      }
    },
    dialogOpen() {
      this.dialogVisible = true;
    },
    createFolder() {
      const newFolder = this.input;
      this.input = '';
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createFolder($name: String, $parentId: Int) {
              createFolder(name: $name, parentId: $parentId) {
                id
                name
                color
                children {
                  id
                }
                parent {
                  id
                }
                user {
                  id
                }
                updatedAt
              }
            }
          `,
          variables: {
            name: newFolder,
            parentId: parseInt(this.$route.params.id),
          },
          refetchQueries: ['allFolders', 'onlyFolders'],
        })
        .catch(error => {
          // Error
          console.error(error);
          // We restore the initial user input
          this.input = newFolder;
        });
    },
    accept() {
      this.dialogVisible = false;
      this.createFolder();
    },
  },
};
</script>

<style>
</style>
