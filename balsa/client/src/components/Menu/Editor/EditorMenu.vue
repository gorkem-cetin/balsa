<template >
  <div>
    <el-menu
      class="el-menu-demo"
      style="border-right:0"
      placement="bottom"
      mode="vertical"
      @open="true"
    >
      <el-menu-item
        index="add-to-folder"
        v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"
        @click="$store.dispatch('toggleMoveDialog', file)"
      >Add to Folder</el-menu-item>
      <Divider class="divider-margin" v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"/>
      <el-menu-item index="export" @click="$store.dispatch('toggleExportFileDialog')">Export</el-menu-item>
      <el-menu-item index="copy-link" @click="copyLinkHandler()" v-if="!this.$apollo.queries.File.loading && File.hasWritePermission">Copy link</el-menu-item>
      <el-menu-item index="print" @click="print">Print</el-menu-item>
      <Divider class="divider-margin" v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"/>
      <el-menu-item
        index="share-settings"
        @click="$store.dispatch('toggleFilePermissionDialog')"
        v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"
      >Share</el-menu-item>
      <Divider class="divider-margin" v-if="!this.$apollo.queries.File.loading && File.hasWritePermission" />
      <el-menu-item index="delete" @click="$store.dispatch('toggleRemoveFileDialog')" v-if="!this.$apollo.queries.File.loading && File.hasWritePermission">Delete</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Divider from '../../Divider.vue';
import gql from 'graphql-tag';
import { GET_FILE_PUBLIC_URL } from '../../../queries';

export default {
  props: {
    parentProps: {
      type: Object,
    },
  },
  components: {
    Divider,
  },
  apollo: {
    File: {
      query: gql`
        query File($id: Int!, $inviteCode: String) {
          File(id: $id, inviteCode: $inviteCode) {
            id
            name
            content
            hasWritePermission
          }
        }
      `,
      variables() {
        return {
          id: parseInt(this.$route.params.id),
          inviteCode: this.$route.params.inviteCode,
        };
      },
      // Error handling
      error(error) {
        console.error("We've got an error!", error.graphQLErrors[0].message);
      },
      result({ data }) {
        this.file = data.File;
      },
    },
    getFilePublicUrl: {
      query: GET_FILE_PUBLIC_URL,
      variables() {
        return {
          id: this.File.id,
        };
      },
      skip() {
        return !this.publicViewClicked;
      },
      result({ data }) {
        const _this = this;
        this.$copyText(data.getFilePublicUrl).then(function(e) {
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
    print() {
      this.$htmlToPaper('balsa-editor');
    },
    copyLinkHandler(e) {
      this.publicViewClicked = true;
    },
  },
  data() {
    return {
      file: null,
      publicViewClicked: false,
    };
  },
};
</script>

<style scoped >
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
