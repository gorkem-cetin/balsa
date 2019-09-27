<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Are you sure you want to remove this file ?</span>
      <el-col :md="24" style="margin-top:26px;">
        <span class="medium-font pale">This action is irreversible.</span>
      </el-col>
    </template>
    <template v-slot:main>
      <el-row>
        <el-col
          v-for="(data,index) in datas"
          :key="index"
          :xs="3"
          :md="2"
          class="theme-button-radio-margin"
        >
          <div
            class="balsa-theme-box"
            :class="{'is-active':index===parseInt(radio)}"
            v-on:click="radio=index.toString()"
          >
            <el-col :style="{'background-color':data.color,'border-radius':'50%'}"></el-col>
          </div>
          <!-- <el-radio v-model="radio" :label="index.toString()">{{data.text}}</el-radio> -->
        </el-col>
      </el-row>
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
  data() {
    return {
      radio: '0',
      datas: [
        { color: '#ffedc0' },
        { color: '#4bc961' },
        { color: '#fa7047' },
        { color: '#4b87c9' },
        { color: '#ffbab7' },
      ],
    };
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
        .catch(error => {
          this.notifyError(error.message);
        });
    },
  },
};
</script>

<style scoped>
.theme-button-radio-margin {
  margin-top: 10px;
}

@media only screen and (max-width: 600px) {
  .theme-button-radio-margin {
    margin-top: 14px;
  }
}

.balsa-theme-box {
  cursor: pointer;
  display: flex;
  margin-bottom: 12px;
  width: 24px;
  height: 24px;
}
</style>
