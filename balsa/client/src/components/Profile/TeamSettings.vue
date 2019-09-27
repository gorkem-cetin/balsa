<template>
  <div>
    <InviteUserDialog :dialogVisible="inviteUserDialogVisible" @handler="inviteUserDialogHandler"></InviteUserDialog>

    <ProfileContainer v-if="!this.$apollo.queries.allUsers.loading">
      <el-row>
        <el-row
          type="flex"
          align="middle"
          justify="space-between"
          class="balsa-space-between-row"
          style="margin-top:0"
        >
          <h1 class="balsa-h1-row" style="margin:0;">Team Settings</h1>
          <el-button
            type="success"
            @click="inviteUserDialogHandler"
            :plain="false"
            icon="el-icon-plus"
            class="semi-medium-font"
          >Invite team member</el-button>
        </el-row>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          style="margin-top:28px;"
          class="mobile-max-width"
        >
          <el-tab-pane :label="`Team Members (${allUsers.length})`" name="first">
            <el-row
              style="margin-top:15px;margin-bottom:4px;"
              type="flex"
              class="balsa-pading-left-5"
            >
              <el-col style="width:75px; height:1px;" />
              <el-col :span="22">
                <el-row type="flex">
                  <el-col :span="8" :xs="24">
                    <span class="small-span small-text-color-select font-medium">Name & E-mail</span>
                  </el-col>
                  <el-col :span="5" class="hidden-sm-and-down">
                    <span class="small-span small-text-color-select">Date created</span>
                  </el-col>
                  <el-col :span="5" class="hidden-sm-and-down">
                    <span class="small-span small-text-color-select font-medium">Status</span>
                  </el-col>
                  <el-col :span="5" :xs="3">
                    <span class="small-span small-text-color-select font-medium">Role</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2" class="hidden-sm-and-down" />
            </el-row>
            <el-row
              class="balsa-pading-left-5"
              v-for="(person,index) in allUsers"
              v-bind:key="index"
            >
              <FileCapsule hoverVisible>
                <template v-slot:divider>
                  <Divider />
                </template>
                <el-col :span="22" :xs="24">
                  <File>
                    <template v-slot:image>
                      <div style="padding:20px 10px">
                        <Avatar
                          size="smallAvatar"
                          :firstName="person.firstName"
                          :lastName="person.lastName"
                          :src="person.profilePhoto"
                        />
                      </div>
                    </template>

                    <el-col :md="8" :xs="24">
                      <PersonContainer
                        :firstName="person.firstName"
                        :lastName="person.lastName"
                        :email="person.email"
                      />
                    </el-col>
                    <el-col :span="5" class="hidden-sm-and-down">
                      <span class="small-span small-text-color">{{person.createdAt|formatDate}}</span>
                    </el-col>
                    <el-col :span="5" class="hidden-sm-and-down">
                      <span class="small-span small-text-color">{{person.status}}</span>
                    </el-col>
                    <div>
                      <span
                        class="small-span small-text-color"
                        style="padding-left:3px"
                      >{{person.role}}</span>
                    </div>
                    <div style="position: absolute;top: 2px;right: 0;" class="hidden-sm-and-up">
                      <TeamSettingsMenu :allUsers="allUsers" :user="person" />
                    </div>
                  </File>
                </el-col>
                <el-col :md="2" :xs="3">
                  <TeamSettingsMenu :allUsers="allUsers" :user="person" class="hidden-sm-and-down" />
                </el-col>
              </FileCapsule>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            :label="`Invitations ${invitedUsers.length > 0 ? '(' + invitedUsers.length + ')' : ''}`"
            name="second"
          >
            <div v-if="invitedUsers.length > 0">
              <el-row
                style="margin-top:15px;margin-bottom:4px;"
                type="flex"
                class="balsa-pading-left-5"
              >
                <el-col style="width:75px; height:1px;" />
                <el-col :span="22">
                  <el-row type="flex">
                    <el-col :span="8" :xs="24">
                      <span class="small-span small-text-color-select font-medium">Name & E-mail</span>
                    </el-col>
                    <el-col :span="5" class="hidden-sm-and-down">
                      <span class="small-span small-text-color-select">Date created</span>
                    </el-col>
                    <el-col :span="5" class="hidden-sm-and-down">
                      <span class="small-span small-text-color-select font-medium">Status</span>
                    </el-col>
                    <el-col :span="5" :xs="3">
                      <span class="small-span small-text-color-select font-medium">Role</span>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="2" class="hidden-sm-and-down" />
              </el-row>
              <el-row
                class="balsa-pading-left-5"
                v-for="(person,index) in invitedUsers"
                v-bind:key="index"
              >
                <FileCapsule hoverVisible>
                  <template v-slot:divider>
                    <Divider />
                  </template>
                  <el-col :span="22" :xs="24">
                    <File>
                      <template v-slot:image>
                        <div style="padding:20px 10px">
                          <Avatar />
                        </div>
                      </template>

                      <el-col :md="8" :xs="24">
                        <PersonContainer
                          :firstName="person.firstName"
                          :lastName="person.lastName"
                          :email="person.email"
                        />
                      </el-col>
                      <el-col :span="5" class="hidden-sm-and-down">
                        <span class="small-span small-text-color">{{person.createdAt|formatDate}}</span>
                      </el-col>
                      <el-col :span="5" class="hidden-sm-and-down">
                        <span class="small-span small-text-color">{{person.status}}</span>
                      </el-col>
                      <div>
                        <span class="small-span small-text-color">{{person.role}}</span>
                      </div>
                    </File>
                  </el-col>
                  <el-button type="danger" @click="revokeInvitation(person.id)">Revoke</el-button>
                </FileCapsule>
              </el-row>
            </div>
            <el-row
              v-else
              style="min-height:40vh;flex-direction:column"
              type="flex"
              justify="center"
              align="middle"
            >
              <span style="font-size:32px">No pending invitations.</span>
              <el-row type="flex">
                <span style="opacity: 0.9;">
                  Let's
                  <el-button
                    type="text"
                    @click="inviteUserDialogHandler"
                    :plain="false"
                    class="invite-button"
                  >invite</el-button>people and grow your team!
                </span>
              </el-row>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <Divider />
    </ProfileContainer>
  </div>
</template>

<script>
import PopoverDialogCapsule from '../PopoverDialogCapsule.vue';
import Dialog from '../Dialog.vue';
import Collapse from '../Collapse.vue';
import Avatar from '../Avatar.vue';
import TeamSettingsMenu from '../Menu/TeamSettings/TeamSettingsMenu.vue';
import PopoverImage from '../PopoverImage.vue';
import PersonContainer from '../PersonContainer.vue';
import BalsaIcon from '../BalsaIcon.vue';
import File from '../File.vue';
import FileCapsule from '../FileCapsule.vue';
import Divider from '../Divider.vue';
import ProfileContainer from './ProfileContainer.vue';
import BalsaSpaceBetween from '../BalsaSpaceBetween.vue';
import 'element-ui/lib/theme-chalk/display.css';
import gql from 'graphql-tag';
import { ALL_USERS_QUERY, INVITED_USERS_QUERY } from '../../queries';
import moment from 'moment';
import InviteUserDialog from '../Dialogs/InviteUserDialog';
import Button from '../Button';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  components: {
    InviteUserDialog,
    Dialog,
    ProfileContainer,
    PersonContainer,
    BalsaSpaceBetween,
    Divider,
    Collapse,
    TeamSettingsMenu,
    PopoverImage,
    BalsaIcon,
    File,
    Avatar,
    PopoverDialogCapsule,
    FileCapsule,
    Button,
  },
  mixins: [NotificationMixin],
  apollo: {
    allUsers: {
      query: ALL_USERS_QUERY,
    },
    invitedUsers: {
      query: INVITED_USERS_QUERY,
    },
  },
  data: function() {
    return {
      dialogVisible: false,
      inviteUserDialogVisible: false,
      activeName: 'first',
    };
  },
  filters: {
    formatDate(timestamp) {
      return moment(parseInt(timestamp)).format('DD/MM/YYYY');
    },
  },
  methods: {
    revokeInvitation(id) {
      this.$confirm('This will permanently delete the invitation. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($id: Int!) {
                  revokeInvitation(id: $id) {
                    id
                  }
                }
              `,
              variables: {
                id,
              },
              refetchQueries: ['invitedUsers'],
            })
            .then(() => {
              this.notifySuccess(`Invitation successfully revoked.`);
            })
            .catch(error => {
              this.notifyError(error.message);
            });
        })
        .catch(() => {});
    },
    selectFocus() {
      this.form.region = '1';
    },
    dialogActionChange() {
      this.dialogVisible = !this.dialogVisible;
    },
    inviteUserDialogHandler(e) {
      this.inviteUserDialogVisible = !this.inviteUserDialogVisible;
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



