<template>
  <el-menu
    :router="true"
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item>
      <router-link to="/" class="hidden-xs-only">
        <Logo />
      </router-link>
      <div class="hold-menu hidden-sm-and-up">
        <MobileMenu />
      </div>
    </el-menu-item>

    <el-menu-item v-if="isLogin" index="home"
      :route="{name:'home'}" class="el-menu-item-text hidden-xs-only">My Drive</el-menu-item>
    <!-- <el-menu-item
      v-if="isLogin"
      index="files"
      class="el-menu-item-text hidden-sm-and-down"
    >Files & Folders</el-menu-item>-->
    <el-menu-item
      v-if="isLogin"
      index="activities"
      :route="{name:'activities'}"
      class="el-menu-item-text hidden-xs-only"
    >Activity</el-menu-item>
    <!-- <el-menu-item v-if="isLogin" index="/notes" class="el-menu-item-text hidden-sm-and-down">Notes</el-menu-item> -->
    <el-menu-item style="flex-grow:1"></el-menu-item>
    <el-menu-item v-if="isLogin" class="hidden-sm-and-down">
      <InputCapsule size="mid">
        <Input filled smallPlaceHolder />
      </InputCapsule>
    </el-menu-item>
    <el-menu-item v-if="isLogin">
      <PopoverImage visible style="z-index:1;position:relative">
        <template v-slot:image>
          <Avatar
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
    <el-menu-item index="/login" v-else class="el-menu-item-text hidden-sm-and-down">Log in</el-menu-item>
  </el-menu>
</template>

<script>
import MobileMenu from './MobileMenu.vue';
import Input from './Input.vue';
import Logo from './Logo.vue';
import PopoverImage from './PopoverImage.vue';
import Avatar from './Avatar.vue';
import InputCapsule from './InputCapsule.vue';
import ProfileHeaderMenu from './Menu/Profile/ProfileHeader.vue';
import gql from 'graphql-tag';

export default {
  components: {
    Logo,
    MobileMenu,
    Avatar,
    Input,
    InputCapsule,
    PopoverImage,
    ProfileHeaderMenu,
  },
  data() {
    return {
      isLogin: localStorage.getItem('TOKEN'),
      activeIndex: 'home',
      myProfile: {
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
            profilePhoto
          }
        }
      `,
      skip() {
        return !localStorage.getItem('TOKEN');
      },
    },
  },
  methods: {
    handleSelect(key, keyPath) {},
  },
  created: function() {
    if (this.$route.name) this.activeIndex = this.$route.name;
  },
};
</script>

<style scoped>
.hold-menu {
  height: 100%;
  display: flex;
  align-items: center;
}

.el-menu-item-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
