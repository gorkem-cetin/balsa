<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span
        class="font-heavy font-size-28"
      >Do you really want to remove {{user.firstName+' '+user.lastName}}?</span>
      <el-row style="margin-top:26px;">
        <el-col :md="22">
          <span
            class="medium-font pale"
          >If a user has docs shared with other users, then those users still will have access to it.</span>
        </el-col>
      </el-row>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main">
        <el-row type="flex" align="middle">
          <Avatar
            :src="user.profilePhoto"
            :firstName="user.firstName"
            :lastName="user.lastName"
            size="smallAvatar"
            style="margin-right:10px;"
          />
          <div>
            {{user.firstName+' '+user.lastName}} has
            <u>{{user.fileCount}} documents{{' '}}</u>

            <span
              v-if="user.fileContributorsCount === 0"
              class="margin-left-5"
            >not shared with anyone.</span>
            <span
              v-else
              class="margin-left-5 medium-font"
            >shared with {{user.fileContributorsCount}} people.</span>
          </div>
        </el-row>
        <el-form :model="form" style="margin-top:20px;" v-if="user.fileCount > 0">
          <el-form-item>
            <el-radio-group v-model="form.transferFiles" style="display:flex;flex-direction:column">
              <el-radio :label="1" :disabled="user.fileCount === 0" class="label-radio-balsa">
                <span style="margin-right:10px">Assign them to user</span>
                <el-select
                  @focus="selectFocus"
                  v-model="form.select"
                  placeholder="Please select a user"
                  class="balsa-select"
                >
                  <el-option
                    v-for="(newUser, index) in allUsers"
                    v-if="newUser.id !== user.id"
                    :key="index"
                    :label="newUser.firstName+' '+newUser.lastName"
                    :value="newUser.id"
                  >
                    <div style="display:flex;align-items:center;">
                      <Avatar
                        :src="newUser.profilePhoto"
                        :firstName="newUser.firstName"
                        :lastName="newUser.lastName"
                        size="smallAvatar"
                        style="margin-right:10px;"
                      />
                      <span>{{newUser.firstName+' '+newUser.lastName}}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-radio>
              <el-radio :label="2" style="margin-top:15px;display:flex;">
                <el-row type="flex" style="flex-direction:column;">
                  <span>Do not assign them</span>
                  <span class="small-span">Docs will still exist, but won’t be accessible</span>
                </el-row>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import NotificationMixin from '../Mixins/NotificationMixin';
import Avatar from '../Avatar.vue';
import Dialog from '../Dialog.vue';
import gql from 'graphql-tag';

export default {
  name: 'RemoveUserDialog',
  mixins: [NotificationMixin],
  components: {
    Avatar,
    Dialog,
  },
  props: {
    user: {
      type: Object,
    },
    allUsers: {
      type: Array,
    },
    dialogVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        select: '',
        transferFiles: this.user.fileCount === 0 ? 2 : 1,
      },
    };
  },
  methods: {
    dialogActionChange(event) {
      this.$emit('handler');
      if (event === 'confirm') {
        this.remove();
      }
    },
    remove() {
      let passFilesTo = this.form.select;
      if (this.form.transferFiles !== 1) {
        passFilesTo = null;
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation removeUser($userId: Int!, $passFilesTo: Int) {
              removeUser(userId: $userId, passFilesTo: $passFilesTo)
            }
          `,
          variables: {
            passFilesTo: passFilesTo,
            userId: this.user.id,
          },
          refetchQueries: ['allUsers'],
        })
        .then(({ data }) => {
          this.notifySuccess('User removed.');
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
    selectFocus() {
      this.form.region = '1';
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
