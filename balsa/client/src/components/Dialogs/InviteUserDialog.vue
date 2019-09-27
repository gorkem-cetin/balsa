<template>
  <Dialog
    :visible="dialogVisible"
    :dialogActionChange="dialogActionChange"
    dialogSize="el-dialog-balsa big-dialog"
  >
    <template v-slot:header>
      <el-row>
        <el-col :md="24">
          <span class="font-heavy font-size-28">Invite Users</span>
        </el-col>
        <el-col :md="24">
          <span class="medium-font pale">Fill information below to invite user(s).</span>
        </el-col>
      </el-row>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding: 0px 25px;">
        <el-form label-position="top" label-width="100px" :model="form" ref="form">
          <el-row :gutter="16" type="flex" v-for="(data, index) in form.inviteData" :key="index">
            <el-col :md="24">
              <el-form-item
                :prop="'inviteData.' + index + '.email'"
                :rules="[
                  { required: true, message: 'Please input email address', trigger: 'blur' },
                  { type: 'email', message: 'Please enter a valid email.', trigger: ['blur', 'change'] }
                ]"
              >
                <el-input placeholder="E-mail" v-model="data.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item
                :prop="'inviteData.' + index + '.firstName'"
                :rules="{
                  required: true, message: 'Please enter your first name.', trigger: 'blur'
                }"
              >
                <el-input placeholder="First Name" v-model="data.firstName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item
                :prop="'inviteData.' + index + '.lastName'"
                :rules="{
                  required: true, message: 'Please enter your last name.', trigger: 'blur'
                }"
              >
                <el-input placeholder="Last Name" v-model="data.lastName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item>
                <el-select
                  style="width:100%"
                  v-model="data.role"
                  placeholder="Please select a role"
                  class="balsa-select"
                >
                  <el-option :key="0" label="User" value="User"></el-option>
                  <el-option :key="0" label="Admin" value="Admin"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="3">
              <el-form-item class="cursor-pointer" v-if="index !==0">
                <div @click="deleteSelected(index)">
                  <i class="el-icon-close"></i>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row type="flex" style="padding: 0px 25px;">
        <el-button
          type="text"
          size="mini"
          @click="addMore"
          :plain="false"
          icon="el-icon-plus"
          class="semi-medium-font"
        >Add more</el-button>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import NotificationMixin from '../Mixins/NotificationMixin';
import Avatar from '../Avatar.vue';
import Dialog from '../Dialog.vue';
import gql from 'graphql-tag';
import Button from '../Button';

export default {
  name: 'InviteUserDialog',
  mixins: [NotificationMixin],
  components: {
    Avatar,
    Dialog,
    Button,
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        inviteData: [{ email: '', firstName: '', lastName: '', role: 'User' }],
      },

      userid: parseInt(localStorage.getItem('USERID')),
    };
  },
  methods: {
    dialogActionChange(event) {
      if (event !== 'confirm') {
        this.$emit('handler');
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (event === 'confirm') {
              this.$emit('handler');
              this.invite();
            }
          } else {
            return false;
          }
        });
      }
    },
    addMore() {
      this.form.inviteData.push({ email: '', firstName: '', lastName: '', role: 'User' });
    },
    deleteSelected(index) {

      this.form.inviteData.splice(index, 1);
    },
    invite() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($data: [InviteCodeInput]) {
              inviteUser(data: $data)
            }
          `,
          variables: {
            data: this.form.inviteData,
          },
          refetchQueries: ['allUsers', 'invitedUsers'],
        })
        .then(({ data }) => {
          this.form.inviteData = [{ email: '', firstName: '', lastName: '', role: 'User' }];
          this.notifySuccess('Users invited successfully');
        })
        .catch(error => {
          this.notifyError(error.message);
          this.loading = false;
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
