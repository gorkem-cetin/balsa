<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Are you sure you want to remove this file ?</span>
      <el-col :md="24" style="margin-top:26px;">
        <span class="medium-font pale">This action is irreversible.</span>
      </el-col>
    </template>
  </Dialog>
</template>

<script>
import Dialog from '../Dialog.vue';
import gql from 'graphql-tag';
import { RECENT_FILES_QUERY, MY_FILES_QUERY, ALL_FOLDERS_QUERY } from '../../queries';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  mixins: [NotificationMixin],
  name: 'RemoveFileDialog',
  components: {
    Dialog,
  },
  apollo: {
    inviteToFileUserList: {
      query: gql`
        query inviteToFileUserList($filterQuery: String, $fileID: Int!) {
          inviteToFileUserList(filterQuery: $filterQuery, fileID: $fileID) {
            id
            firstName
            lastName
            profilePhoto
          }
        }
      `,
      variables() {
        return { filterQuery: this.userQuery, fileID: this.file.id };
      },
      skip() {
        return !this.dialogVisible;
      },
    },
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
      if (event === 'confirm') {
        this.deleteFile();
      } else {
        // close geliyor ancak handle etmeye gerek yok
      }
      this.$emit('handler');
    },
    deleteFile() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($fileID: Int!) {
              deleteFile(id: $fileID) {
                id
                parent {
                  id
                }
              }
            }
          `,
          variables: {
            fileID: this.file.id,
          },
          refetchQueries: ['recentFiles', 'myFiles', 'allFolders', 'onlyFolders', 'starredFiles'],
        })
        .then(() => {
          this.notifySuccess(`File(s) has been deleted successfully.`);
        })
        .then(() => {
          if (this.$route.name === 'editor') {
            this.$router.push({ name: 'home' });
          }
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
  },
};
</script>

<style scoped>
</style>
