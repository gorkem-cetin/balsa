<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Edit {{user.firstName+' '+user.lastName}}'s profile.</span>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding: 0px 25px;">
        <el-form label-position="top" label-width="100px" :model="form">
          <el-row :gutter="16">
            <el-col :md="12">
              <el-form-item label="E-mail">
                <el-input v-model="user.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="First Name">
                <el-input v-model="user.firstName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="Last Name">
                <el-input v-model="user.lastName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="Job Title">
                <el-input v-model="user.jobTitle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="User Role">
                <el-select
                  style="width:100%"
                  v-model="user.role"
                  placeholder="Please select a role"
                  class="balsa-select"
                >
                  <el-option :key="0" label="Admin" value="Admin"></el-option>
                  <el-option :key="0" label="User" value="User"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="User Status">
                <el-select
                  style="width:100%"
                  v-model="user.status"
                  placeholder="Please select a status"
                  class="balsa-select"
                >
                  <el-option :key="0" label="Active" value="Active"></el-option>
                  <el-option :key="0" label="Passive" value="Passive"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
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
  name: 'EditUserDialog',
  mixins: [NotificationMixin],
  components: {
    Avatar,
    Dialog,
  },
  props: {
    user: {
      type: Object,
    },
    dialogVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        email: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
      },
      userid: parseInt(localStorage.getItem('USERID')),
    };
  },
  methods: {
    dialogActionChange(event) {
      this.$emit('handler');
      if (event === 'confirm') {
        this.update();
      }
    },
    update() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($email: String!, $firstName: String!, $lastName: String!, $jobTitle: String) {
              editProfile(email: $email, firstName: $firstName, lastName: $lastName, jobTitle: $jobTitle)
            }
          `,
          variables: {
            ...this.user,
          },
        })
        .then(({ data }) => {
          this.notifySuccess('User updated successfully');
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
