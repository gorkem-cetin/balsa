<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Share with others</span>
      <el-row style="margin-top:26px;">
        <el-col :md="24">
          <span
            class="medium-font pale"
          >Select users and they will have read and write access to it.</span>
        </el-col>
      </el-row>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding:0 25px">
        <el-form :model="form" style="margin-top:20px;" label-position="top">
          <el-form-item class="file--permission--dialog">
            <el-select
              style="width: 100%"
              @focus="selectFocus"
              v-model="form.select"
              :multiple="true"
              :filterable="true"
              :remote="true"
              :remote-method="filterUsers"
              reserve-keyword
              default-first-option
              placeholder="Write a name or select one."
            >
              <el-option
                v-for="user in inviteToFileUserList"
                :label="`${user.firstName} ${user.lastName}`"
                :value="user.email"
                :key="user.email"
                style="min-height:50px"
              >
                <el-row type="flex" align="middle" style="height:100%">
                  <Avatar
                    :src="user.profilePhoto"
                    size="smallAvatar"
                    style="margin-right:10px;"
                    :firstName="user.firstName"
                    :lastName="user.lastName"
                  />
                  <span>{{ `${user.firstName} ${user.lastName}` }}</span>
                </el-row>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="People with Access"
            v-if="!$apollo.queries.File.loading && dialogVisible"
          >
            <el-row v-for="(data,index) in File.contributors" :key="index">
              <Divider />

              <el-row type="flex" align="middle" style="padding:10px 0;">
                <el-col style="width:37px;height:37px;margin-right:8px">
                  <Avatar :src="data.user.profilePhoto" />
                </el-col>
                <el-col>
                  <el-row type="flex" style="flex-direction:column">
                    <span style="line-height:normal">{{data.user.firstName}}  {{data.user.lastName}}</span>
                    <span
                        v-if="data.user.jobTitle"
                      class="small-text-color small-text-opacity small-span"
                    >{{ data.user.jobTitle }}</span>
                  </el-row>
                </el-col>
                <el-row type="flex" align="bottom">
                  <FilePermissionEditMenu
                    @handler="e => editPermission(e, data)"
                    style="margin-right:16px"
                  />
                  <i
                    class="el-icon-close hover-primary cursor-pointer"
                    style="font-size:16px;"
                    @click="deletePermission(data)"
                  ></i>
                </el-row>
              </el-row>
            </el-row>
            <Divider />
            <el-row v-if="File.contributors.length<=0">
              <span class="extra-small">Currently no one.</span>
            </el-row>
          </el-form-item>
          <el-form-item label="Not shared with anyone" v-else></el-form-item>
        </el-form>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import Avatar from '../Avatar.vue';
import Dialog from '../Dialog.vue';
import FilePermissionEditMenu from '../Menu/FilePermissionEditMenu/FilePermissionEditMenu.vue';
import Divider from '../Divider.vue';
import gql from 'graphql-tag';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  mixins: [NotificationMixin],
  name: 'FilePermissionDialog',
  components: {
    Avatar,
    Dialog,
    FilePermissionEditMenu,
    Divider,
  },
  apollo: {
    inviteToFileUserList: {
      query: gql`
        query inviteToFileUserList($filterQuery: String, $fileID: Int!) {
          inviteToFileUserList(filterQuery: $filterQuery, fileID: $fileID) {
            id
            email
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
    File: {
      query: gql`
        query File($id: Int!) {
          File(id: $id) {
            id
            contributors {
              id
              isAnon
              email
              user {
                id
                profilePhoto
                firstName
                lastName
                email
                jobTitle
              }
            }
          }
        }
      `,
      variables() {
        return { id: this.file.id };
      },
      skip() {
        return !this.dialogVisible;
      },
      result({ data }) {
        this.File = data.File;
        return data.File;
      }
    },
  },
  data: function() {
    return {
      form: {
        region: '',
        select: '',
      },
      userQuery: '',
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
    deletePermission(data) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($fileID: Int!, $email: String!) {
              dropFilePermission(fileID: $fileID, email: $email)
            }
          `,
          variables: {
            fileID: this.file.id,
            email: data.email,
          },
          refetchQueries: ['allFolders', 'myFiles', 'recentFiles'],
        })
        .then(() => {
          this.$apollo.queries.File.refetch();
          const user = data.user;
          this.notifySuccess(`Successfully removed ${user.firstName} ${user.lastName}'s access for this file.`);
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
    editPermission(permissionLevel, data) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($fileID: Int!, $email: String!, $permissionLevel: String!) {
              updateFilePermission(fileID: $fileID, email: $email, permissionLevel: $permissionLevel)
            }
          `,
          variables: {
            fileID: this.file.id,
            email: data.email,
            permissionLevel,
          },
          refetchQueries: ['allFolders', 'myFiles', 'recentFiles'],
        })
        .then(() => {
          const permissionLevelMsg = permissionLevel === 'READ_ONLY' ? 'Read only' : 'Read / Write';
          this.notifySuccess(`Permission is set to ${permissionLevelMsg}.`);
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
    selectFocus() {
      this.form.region = '1';
    },
    dialogActionChange(event) {
      if (event === 'confirm') {
        if (this.form.select.length) {
          this.givePermission();
        }
      } else {
        // close geliyor ancak handle etmeye gerek yok
      }
      this.$emit('handler');
    },
    filterUsers(query) {
      this.userQuery = query;
    },
    givePermission() {
      const _this = this;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($fileID: Int!, $emails: [String!]) {
              giveFilePermission(fileID: $fileID, emails: $emails)
            }
          `,
          variables: {
            fileID: this.file.id,
            emails: this.form.select,
          },
          refetchQueries: ['allFolders', 'myFiles', 'recentFiles'],
        })
        .then(() => {
          const userCount = this.form.select.length;
          this.form.select = [];
          let msg = '';
          if (userCount > 1) {
            msg = 'users';
          } else {
            msg = 'user';
          }
          this.notifySuccess(`File shared with ${msg} successfully.`);
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
