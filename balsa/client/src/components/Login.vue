<template>
  <el-row type="flex" justify="center">
    <el-col :span="8" :xs="20" style="margin-top:3%">
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-row type="flex" justify="center" style="margin-top:24px;">
              <el-col :lg="16" :xl="14">
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
                    <el-form-item label="Password" prop="password">
                      <el-input v-model="ruleForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top:10px">
                      <el-button
                          :class="{'full-width':fullWidth}"
                          type="primary"
                          @click="submitForm('ruleForm')"
                          :loading="loading"
                      >Login
                      </el-button>
                    </el-form-item>
                    <el-row type="flex" align="middle" justify="space-between">
                      <router-link to="forgot-password" class="small-span">Forgot Password?</router-link>
                      <div v-if="!this.$apollo.queries.configurations.loading && !this.configurations.appInitialized">
                        <span
                            class="small-span small-text-color"
                            style="margin-right:5px;"
                        >No account yet?</span>
                        <router-link to="sign-up" class="small-span">Sign up</router-link>
                      </div>
                    </el-row>
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
  import gql from 'graphql-tag';
  import NotificationMixin from './Mixins/NotificationMixin';

  export default {
    mixins: [NotificationMixin],
    data() {
      return {
        fullWidth: true,
        loading: false,
        ruleForm: {
          email: '',
          password: '',
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
          password: [
            {
              required: true,
              message: 'Please input Activity password',
              trigger: 'blur',
            },
            {
              min: 6,
              max: 100,
              message: 'Length should be 6 to 100',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    created() {
      const token = localStorage.getItem('TOKEN');
      if (token) {
        this.$router.push({name: 'home'});
      }
    },
    apollo: {
      configurations: {
        query: gql`
          query configurations {
            configurations {
              id
              appInitialized
            }
          }
        `,
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true;
            this.login()
              .then(({data}) => {
                this.loading = false;
                this.$store.dispatch('saveUserInformation', data.authenticate).then(() => {
                  localStorage.setItem('TOKEN', data.authenticate.token);
                  localStorage.setItem('USERID', data.authenticate.user.id);
                  this.notifySuccess('Logged in successfully.');
                  this.$router.push({name: 'home'});
                });
              })
              .catch((error) => {
                this.notifyError(error.message);
                this.loading = false;
              });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      login() {
        return this.$apollo.mutate({
          mutation: gql`
          mutation($email: String!, $password: String!) {
            authenticate(email: $email, password: $password) {
              token
              user {
                id
                firstName
                lastName
              }
            }
          }
        `,
          variables: {
            email: this.ruleForm.email,
            password: this.ruleForm.password,
          },
        });
      },
    },
  };
</script>

<style>
  .el-form--label-top {

  }
</style>
