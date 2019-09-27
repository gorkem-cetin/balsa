<template>
  <el-row type="flex" justify="center">
    <el-col :span="8" :xs="20" style="margin-top:3%">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-row type="flex" justify="center" style="margin-top:24px;flex-direction:column">
              <el-row>
                <h1>Set your password</h1>
                <p
                    class="line-height-normal small-text-color"
                    style="margin-top:16px;margin-bottom:12px;"
                >Please enter a password you desire.</p>
              </el-row>

              <el-col :lg="16" :xl="24">
                <el-row>
                  <el-form
                      label-position="top"
                      :model="ruleForm"
                      :rules="rules"
                      ref="ruleForm"
                      label-width="120px"
                  >
                    <el-form-item label="Password" prop="password">
                      <el-input v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top:10px">
                      <el-button
                          :class="{'full-width':fullWidth}"
                          type="primary"
                          @click="submitForm('ruleForm')"
                          :loading="loading"
                      >Set Password</el-button>
                      <el-row type="flex" justify="space-between">
                        <div>
                          <span
                              class="small-span small-text-color"
                              style="margin-right:5px;"
                          >You don’t have an account?</span>
                          <router-link to="/sign-up">Sign up</router-link>
                        </div>
                      </el-row>
                    </el-form-item>
                  </el-form>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import gql from "graphql-tag";
  import NotificationMixin from './Mixins/NotificationMixin';

  export default {
    mixins: [NotificationMixin],
    data() {
      return {
        fullWidth: false,
        loading: false,
        ruleForm: {
          email: '',
        },
        rules: {
          email: [
            {
              required: true,
              message: 'password required.',
              trigger: 'blur',
            },
            {
              type: 'password',
              message: 'Please input correct password',
              trigger: ['blur', 'change'],
            },
          ],
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$apollo
          .mutate({
            mutation: gql`
            mutation($code: String!, $newPassword: String!) {
                forgotPassword(code: $code, newPassword: $newPassword)
            }
          `,
            variables: {
              code: this.$route.params.code,
              newPassword: this.ruleForm.password
            },
          })
          .then(() => {
            this.notifySuccess(`New password is set, now you may login.`);
            this.$router.push({ name: 'login' });
          })
          .catch(error => {
            this.notifyError(error.message);
          });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
</script>

<style>
  .el-form--label-top {
  }
</style>
