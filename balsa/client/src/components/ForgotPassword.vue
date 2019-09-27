<template>
  <el-row type="flex" justify="center">
    <el-col :span="8" :xs="20" style="margin-top:3%">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-row type="flex" justify="center" style="margin-top:24px;flex-direction:column">
              <el-row>
                <h1>Reset your password</h1>
                <p
                  class="line-height-normal small-text-color"
                  style="margin-top:16px;margin-bottom:12px;"
                >Please enter the email address associated with your account - you wiill receive a link to reset your password.</p>
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
                    <el-form-item label="Email" prop="email">
                      <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top:10px">
                      <el-button
                        :class="{'full-width':fullWidth}"
                        type="primary"
                        @click="submitForm('ruleForm')"
                        :loading="loading"
                      >Receive password reset link</el-button>
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
            message: 'email address required.',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
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
            mutation($email: String!) {
                startForgotPassword(email: $email)
            }
          `,
          variables: {
            email: this.ruleForm.email
          },
        })
        .then(() => {
          this.notifySuccess(`Password reset details sent to your email`);
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
