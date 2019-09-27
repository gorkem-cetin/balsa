<template>
  <el-header>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item>
        <router-link :to="{name:'home'}">
          <el-button type="text" class="balsa-text-icon">
            <icon name="arrow" class="arrow" style="margin-right:16px;" />Back to files
          </el-button>
        </router-link>
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item style="padding-left:0">
        <PopoverImage>
          <template v-slot:image>
            <Avatar
              v-if="!!myProfile"
              :src="myProfile.profilePhoto"
              :firstName="myProfile.firstName"
              :lastName="myProfile.lastName"
            />
          </template>
          <template slot-scope="props" slot="menu">
            <ProfileHeaderMenu :parent-props="props" />
          </template>
        </PopoverImage>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import Icon from '../Icon';
import Avatar from '../Avatar.vue';
import PopoverImage from '../PopoverImage.vue';
import ProfileHeaderMenu from '../Menu/Profile/ProfileHeader.vue';
import gql from 'graphql-tag';
export default {
  components: { Avatar, PopoverImage, ProfileHeaderMenu, Icon },
  apollo: {
    myProfile: {
      query: gql`
        query myProfile {
          myProfile {
            id
            profilePhoto
            firstName
            lastName
          }
        }
      `,
      skip() {
        return !localStorage.getItem('TOKEN');
      },
    },
  },
};
</script>

<style scoped>
.dots {
  display: block;
}
.flex-grow {
  flex-grow: 1;
}
.medium-text {
  font-size: 13px;
  color: #a5a6bd;
}
span {
  line-height: normal;
}
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-menu-demo {
  display: flex;
}
.el-header {
  z-index: 999;
  position: fixed;
  width: 100%;
  padding: 0;
}
</style>

