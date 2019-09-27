<template>
  <ProfileContainer>
    <el-row>
      <el-row>
        <h1 class="balsa-h1-row">My Profile</h1>
        <el-row style="margin-bottom:12px;">
          <span>Photo</span>
        </el-row>
        <el-row type="flex" align="middle">
          <div @click="$refs.profilePhotoUploader.click()">
            <Avatar
              :src="profilePhotoChanged?preview:formLabelAlign.profilePhoto"
              :firstName="formLabelAlign.firstName"
              :lastName="formLabelAlign.lastName"
              style="width:100px;height:100px;margin-right:13px;"
            />
            <div class="image-add-holder">
              <i class="el-icon-plus icon-profile-holder"></i>
            </div>
          </div>
        </el-row>
        <Divider style="margin-top:36px;" />
        <el-row style="margin-top:24px;">
          <el-col :lg="16" :xl="11">
            <el-row>
              <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                <el-form-item label="E-mail">
                  <el-input v-model="formLabelAlign.email"></el-input>
                </el-form-item>
                <el-form-item label="First Name">
                  <el-input v-model="formLabelAlign.firstName"></el-input>
                </el-form-item>
                <el-form-item label="Last Name">
                  <el-input v-model="formLabelAlign.lastName"></el-input>
                </el-form-item>
                <el-form-item label="Job Title">
                  <el-input v-model="formLabelAlign.jobTitle"></el-input>
                </el-form-item>
                <input
                  type="file"
                  v-on:change="setPhoto"
                  ref="profilePhotoUploader"
                  style="display: none"
                />
              </el-form>
            </el-row>
          </el-col>
        </el-row>
        <el-button @click="submitForm" :loading="loading">Save</el-button>
        <Divider style="margin-top:36px;" />
        <el-row style="margin-top:24px">
          <el-col :span="24" style="margin-bottom:12px;">
            <span>Delete your account</span>
          </el-col>
          <el-col :xl="10" :lg="14">
            <p>
              <span class="color-orange">Deleting your own account</span> can only be done by the administrator. Please contact your administrator to delete your account
            </p>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </ProfileContainer>
</template>

<script>
import Icon from '../Icon';
import Divider from '../Divider.vue';
import Avatar from '../Avatar.vue';
import ProfileContainer from './ProfileContainer.vue';
import PopoverImage from '../PopoverImage.vue';
import EditorMenu from '../Menu/Editor/EditorMenu.vue';
import gql from 'graphql-tag';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  components: { ProfileContainer, Avatar, PopoverImage, EditorMenu, Divider, Icon },
  mixins: [NotificationMixin],
  data() {
    return {
      loading: false,
      profilePhotoChanged: false,
      preview: '',
      uploadedFile: {},
      labelPosition: 'top',
      formLabelAlign: {
        email: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        profilePhoto: '',
      },
    };
  },
  apollo: {
    myProfile: {
      query: gql`
        query myProfile {
          myProfile {
            id
            firstName
            lastName
            email
            jobTitle
            profilePhoto
          }
        }
      `,
      result(data) {
        this.formLabelAlign = data.data.myProfile;
      },
    },
  },

  methods: {
    loadingSuccessState() {
      this.notifySuccess(`Changes Applied.`);
      this.loading = false;
    },
    setPhoto(event) {
      this.uploadedFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = event => {
        this.preview = event.target.result;
      };
      reader.readAsDataURL(this.uploadedFile);
      this.profilePhotoChanged = true;
    },
    submitForm() {
      this.loading = true;

      this.save()
        .then(data => {
          setTimeout(this.loadingSuccessState, 600);
        })
        .catch(error => {
          this.loading = false;
          this.notifyError(error.graphQLErrors[0].message);
          //alert(error.graphQLErrors[0].message);
        });
    },
    save() {
      if (this.profilePhotoChanged) {
        return this.$apollo.mutate({
          mutation: gql`
            mutation(
              $email: String!
              $firstName: String!
              $lastName: String!
              $jobTitle: String
              $profilePhoto: Upload
            ) {
              editProfile(
                email: $email
                firstName: $firstName
                lastName: $lastName
                jobTitle: $jobTitle
                profilePhoto: $profilePhoto
              )
            }
          `,
          variables: {
            email: this.formLabelAlign.email,
            firstName: this.formLabelAlign.firstName,
            lastName: this.formLabelAlign.lastName,
            jobTitle: this.formLabelAlign.jobTitle,
            profilePhoto: this.uploadedFile,
          },
          refetchQueries: ['myProfile'],
        });
      } else {
        return this.$apollo.mutate({
          mutation: gql`
            mutation($email: String!, $firstName: String!, $lastName: String!, $jobTitle: String) {
              editProfile(email: $email, firstName: $firstName, lastName: $lastName, jobTitle: $jobTitle)
            }
          `,
          variables: {
            email: this.formLabelAlign.email,
            firstName: this.formLabelAlign.firstName,
            lastName: this.formLabelAlign.lastName,
            jobTitle: this.formLabelAlign.jobTitle,
          },
          refetchQueries: ['myProfile'],
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../../assets/sass/color.scss';
.icon-profile-holder {
  font-size: 24px;
  color: $--color-primary;
}
.image-add-holder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;

  position: absolute;
  top: 0;
  border-radius: 50%;
  opacity: 0;
  border: 1px solid white;
}
.image-add-holder:hover {
  cursor: pointer;
  height: 100px;
  width: 100px;

  position: absolute;
  top: 0;
  border-radius: 50%;
  background-image: linear-gradient(white, #9e9e9e);
  opacity: 0.6;
  border: 1px solid white;
}
p {
  color: #858d97;
  font-size: 14px;
}

.margin-bottom-31 {
  margin-bottom: 31px;
}

.profile-menu {
  position: fixed;
}

@media only screen and (max-width: 600px) {
  .profile-menu {
    position: unset;
  }
}
</style>
