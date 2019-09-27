<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Copy Document</span>
      <el-row style="margin-top:26px;">
        <el-col :md="24">
          <span
            class="medium-font pale"
          >Select users and they will have read and write access to it.</span>
        </el-col>
      </el-row>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding: 30px 25px;padding-top:0">
        <el-form :model="form" label-position="top">
          <el-form-item label="Name" style="margin-bottom:8px">
            <el-input placeholder="Please input a name" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Folder" style="margin-bottom:8px">
            <el-cascader
              v-model="form.selectedFolder"
              :props="cascaderProps"
              :show-all-levels="false"
              placeholder="Find Folder"
            ></el-cascader>
          </el-form-item>
          <el-form-item style="margin-bottom:8px">
            <el-checkbox v-model="form.keepPeopleCheck">Share it with the same people</el-checkbox>
          </el-form-item>
        </el-form>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import Avatar from '../Avatar.vue';
import Dialog from '../Dialog.vue';
import gql from 'graphql-tag';
import _ from 'lodash';
import { ALL_FOLDERS_QUERY, MY_FILES_QUERY, ONLY_FOLDERS_QUERY, RECENT_FILES_QUERY } from '../../queries';
import NotificationMixin from '../Mixins/NotificationMixin';

let id = 0;
export default {
  mixins: [NotificationMixin],
  name: 'DuplicateFileDialog',
  components: {
    Avatar,
    Dialog,
  },
  apollo: {
    onlyFolders: {
      query: ONLY_FOLDERS_QUERY,
      variables() {
        return {
          parentId: this.folderBufferID,
        };
      },
    },
  },
  data() {
    const _this = this;
    return {
      folderBufferID: null,
      form: {
        keepPeopleCheck: false,
        name: this.file.name + ' Copy',
        selectedFolder: null,
      },
      cascaderProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          //onload moment
          const { level } = node;
          if (node.data) {
            this.folderBufferID = node.data.value;
            // _this.$apollo.queries.onlyFolders.refetch();
          }
          setTimeout(() => {
            const nodes = _this.onlyFolders.map(item => ({
              value: item.id,
              label: item.name,
              leaf: item.children ? item.children.filter(c => c.file === null).length === 0 : true,
            }));
            // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
            resolve(nodes);
          }, 100);
        },
      },
      input: '',
    };
  },
  props: {
    file: {
      type: Object,
    },
    dialogVisible: {
      type: Boolean,
    },
  },
  methods: {
    dialogActionChange(event) {
      this.$emit('handler');
      if (event === 'confirm') {
        this.duplicate();
      }
    },
    duplicate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!, $name: String, $folderId: Int, $keepContributors: Boolean) {
              duplicateFile(id: $id, name: $name, folderId: $folderId, keepContributors: $keepContributors) {
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
            id: this.file.id,
            name: this.form.name,
            folderId: _.last(this.form.selectedFolder),
            keepContributors: this.form.keepPeopleCheck,
          },
          refetchQueries: ['allFolders','recentFiles', 'myFiles'],
        })
        .then(() => {
          this.notifySuccess(`File duplicated.`);
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../../assets/sass/color.scss';

.hover-primary:hover {
  color: $--color-primary;
}
</style>
