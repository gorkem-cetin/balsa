<template>
  <el-row type="flex" align="middle">
    <FilePermissionDialog
        :dialogVisible="filePermissionDialogVisible"
        @handler="filePermissionDialogHandler"
        :file="file"
    />
    <RemoveFileDialog
        :dialogVisible="removeFileDialogVisible"
        @handler="removeFileDialogHandler"
        :file="file"
    />
    <DuplicateFileDialog
        :dialogVisible="duplicateFileDialogVisible"
        @handler="duplicateFileDialogHandler"
        :file="file"
    />
    <RenameFileDialog
        :dialogVisible="renameFileDialogVisible"
        @handler="renameFileDialogHandler"
        :file="file"
    />
    <AddToFolderDialog
        :dialogVisible="moveFileDialogVisible"
        @handler="moveFileDialogHandler"
        :file="file"
    />

    <el-col :md="2" v-if="!this.$apollo.queries.configurations.loading">
      <PopoverImage :visible="is_mobile">
        <template v-slot:image>
          <icon name="dots" class="dots-x" style="width:36px;height:24px"/>
        </template>
        <template slot="menu">
          <el-menu
              class="el-menu-demo"
              style="border-right:0"
              placement="bottom"
              mode="vertical"
              @open="true"
          >
            <router-link :to="`/editor/${file.id}`" v-if="!file.isFolder">
              <el-menu-item index="edit" v-if="file.hasWritePermission">Edit</el-menu-item>
              <el-menu-item index="edit" v-else>Show</el-menu-item>
            </router-link>
            <el-menu-item
                v-if="file.hasWritePermission"
                @click="filePermissionDialogHandler"
                index="invite"
            >Share
            </el-menu-item>
            <el-menu-item
                v-if="!file.isFolder"
                index="duplicate"
                @click="duplicateFileDialogHandler"
            >Make a Copy
            </el-menu-item>
            <el-menu-item
                v-if="configurations.copyLink && !file.isFolder"
                index="copy-link"
                @click="copyLinkHandler"
            >Copy link
            </el-menu-item>
            <el-menu-item
                v-if="file.hasWritePermission"
                index="rename"
                @click="renameFileDialogHandler"
            >Rename
            </el-menu-item>
            <el-menu-item
                v-if="file.hasWritePermission"
                @click="removeFileDialogHandler"
                index="delete"
            >Delete
            </el-menu-item>
            <el-menu-item
                v-if="file.hasWritePermission"
                @click="moveFileDialogHandler"
                index="move"
            >Move
            </el-menu-item>
            <el-popover
                @hide="onHidePopover"
                v-model="changeColor"
                v-if="file.isFolder && file.hasWritePermission"
                placement="left-start"
                width="200"
                trigger="click"
                content="this is content, this is content, this is content"
            >
              <el-row>
                <ChangeColor
                    :file="file"
                    :changeColorHandler="changeColorHandler"
                    :triggerPreviewColor="this.triggerPreviewColor"
                />
              </el-row>
              <el-menu-item slot="reference" index="change-color">Change Color</el-menu-item>
            </el-popover>
          </el-menu>
        </template>
      </PopoverImage>
    </el-col>
  </el-row>
</template>

<script>
  import ChangeColor from '../../ChangeColor';
  import Icon from '../../Icon';
  import Avatar from '../../Avatar.vue';
  import Dialog from '../../Dialog.vue';
  import PopoverImage from '../../PopoverImage.vue';
  import FilePermissionDialog from '../../Dialogs/FilePermissionDialog';
  import RemoveFileDialog from '../../Dialogs/RemoveFileDialog';
  import RenameFileDialog from '../../Dialogs/RenameFileDialog';
  import DuplicateFileDialog from '../../Dialogs/DuplicateFileDialog';
  import gql from 'graphql-tag';
  import {CONFIGURATIONS_QUERY, GET_FILE_PUBLIC_URL} from '../../../queries';
  import ConfigurationAwareMixin from '../../Mixins/ConfigurationAwareMixin';
  import AddToFolderDialog from '../../Dialogs/AddToFolderDialog';

  export default {
    components: {
      RemoveFileDialog,
      RenameFileDialog,
      ChangeColor,
      FilePermissionDialog,
      DuplicateFileDialog,
      AddToFolderDialog,
      PopoverImage,
      Avatar,
      Icon,
      Dialog,
    },
    props: {
      file: {
        type: Object,
      },
    },
    data: function () {
      return {
        previewColor: null,
        is_mobile: false,
        changeColor: false,
        publicViewClicked: false,
        filePermissionDialogVisible: false,
        duplicateFileDialogVisible: false,
        removeFileDialogVisible: false,
        renameFileDialogVisible: false,
        moveFileDialogVisible: false,
        userid: localStorage.getItem('USERID'),
      };
    },
    created: function () {
      var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
      var Android = /(Android)/g.test(navigator.userAgent);
      if (iOS == true) {
        this.is_mobile = true;
      } else if (Android == true) {
        this.is_mobile = true;
      }
    },
    apollo: {
      configurations: {
        query: CONFIGURATIONS_QUERY,
      },
      getFilePublicUrl: {
        query: GET_FILE_PUBLIC_URL,
        variables() {
          return {
            id: this.file.id,
          };
        },
        skip() {
          return !this.publicViewClicked;
        },
        result({data}) {
          const _this = this;
          this.$copyText(data.getFilePublicUrl).then(function (e) {
            _this.$message({
              showClose: true,
              duration: '3000',
              message: `Copied to clipboard`,
              type: 'success',
            });
            _this.publicViewClicked = false;
          });
        },
      },
    },
    methods: {
      triggerPreviewColor(selectedColor, selectedFile) {
        this.previewColor = selectedColor;
      },
      onHidePopover() {
        this.previewColor = null;
      },
      changeColorHandler(e, selectedColor, selectedFile) {
        this.changeColor = false;
        if (e === 'Confirm') {
          this.$apollo.mutate({
            mutation: gql`
            mutation updateFile($id: Int!, $color: String) {
              updateFile(id: $id, color: $color) {
                id
                color
              }
            }
          `,
            variables: {
              id: selectedFile.id,
              color: selectedColor,
            },
          });
        }
      },
      copyLinkHandler(e) {
        this.publicViewClicked = true;
      },
      moveFileDialogHandler(e) {
        this.moveFileDialogVisible = !this.moveFileDialogVisible;
      },
      duplicateFileDialogHandler(e) {
        this.duplicateFileDialogVisible = !this.duplicateFileDialogVisible;
      },
      filePermissionDialogHandler(e) {
        this.filePermissionDialogVisible = !this.filePermissionDialogVisible;
      },

      removeFileDialogHandler(e) {
        this.removeFileDialogVisible = !this.removeFileDialogVisible;
      },
      renameFileDialogHandler(e) {
        this.renameFileDialogVisible = !this.renameFileDialogVisible;
      },
    },
  };
</script>

<style scoped>
  .slot-container-main {
    padding: 0 25px;
  }

  .font-size-28 {
    font-size: 28px;
  }

  .divider-margin {
    margin: 5px 0;
  }

  .balsa-divider {
    padding: 10px;
  }

  .el-menu-demo {
    flex-direction: column;
  }

  .el-menu-item {
    font-size: 15px;

    font-weight: 500;
    height: 33px;
    line-height: 33px;
  }
</style>
