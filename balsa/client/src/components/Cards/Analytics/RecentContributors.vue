<template>
  <el-card shadow="hover" :body-style="{padding:'5px',position:'relative'}">
    <el-row type="flex" class="contributors-row" align="middle">
      <div class="avatar-holder">
        <div :class="online ?'user-online':'user-offline'"/>
        <Avatar size="mediumAvatar"/>
      </div>
      <el-row class="contributors-name">
        <h4 class="font-medium line-height-normal">{{name}}</h4>
        <h4 class="font-medium line-height-normal">{{surname}}</h4>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
import FileCapsule from '../../FileCapsule.vue';
import Avatar from '../../Avatar.vue';
import PopoverImage from '../../PopoverImage.vue';
import ContributorMenu from '../../Menu/Analytics/ContributorMenu.vue';
export default {
  components: {
    Avatar,
    PopoverImage,
    FileCapsule,
    ContributorMenu,
  },
  props: {
    online: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    surname: {
      type: String,
      required: false,
      default: '',
    },
    contributions: {
      type: Number,
      required: false,
      default: 0,
    },
    owned: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/color.scss';
.contributors-name {
  min-height: 49px;
  margin-bottom: 8px;
  margin-top: 8px;
  text-align: center;
  margin-top: 8px;
  letter-spacing: -0.26px;
}
.big-span {
  font-size: 25px;
}
.contributors-row {
  flex-direction: column;
}
.avatar-holder {
  margin-top: 15px;
  position: relative;
  border-radius: 50%;
  padding: 2px;
}
.user-online {
  background-color: #33c871;
  width: 7px;
  right: 0;
  height: 7px;
  border-radius: 50%;
  position: absolute;
}
.user-offline {
  background-color: #abb1b8;
  width: 7px;
  right: 0;
  height: 7px;
  border-radius: 50%;
  position: absolute;
}
</style>
