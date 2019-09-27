<template>
  <el-card shadow="hover" :body-style="{padding:'5px',position:'relative'}">
    <FileCapsule hoverVisible style="background-color:transparent;">
      <div style="position:absolute;right:0px; top:0px;z-index:1">
        <PopoverImage placement="bottom-start">
          <template v-slot:image>
            <icon name="dots" class="dots-x" style="width:36px;height:24px;" />
          </template>
          <template slot-scope="props" slot="menu">
            <ContributorMenu :parent-props="props" />
          </template>
        </PopoverImage>
      </div>
      <el-col :span="24">
        <el-row type="flex" class="contributors-row" align="middle">
          <div class="avatar-holder">
            <div :class="online ?'user-online':'user-offline'" />
            <Avatar size="mediumAvatar" />
          </div>
          <h4 class="contributors-name font-medium line-height-normal">{{name+' '+surname}}</h4>
          <el-col :span="24" style="margin-top:17px;">
            <el-row type="flex" class="contributors-row" align="middle">
              <span class="big-span font-heavy line-height-normal">{{contributions}}</span>
              <span class="font-medium pale line-height-normal extra-small">Contributions</span>
            </el-row>
          </el-col>
          <el-col :span="24" style="margin-top:13px;">
            <el-row type="flex" class="contributors-row" align="middle" style="margin-bottom:12px;">
              <span class="big-span font-heavy line-height-normal">{{owned}}</span>
              <span class="font-medium pale line-height-normal extra-small">Contributions</span>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </FileCapsule>
  </el-card>
</template>

<script>
import Icon from '../../Icon';
import FileCapsule from '../../FileCapsule.vue';
import Avatar from '../../Avatar.vue';
import PopoverImage from '../../PopoverImage.vue';
import ContributorMenu from '../../Menu/Analytics/ContributorMenu.vue';
export default {
  components: {
    Avatar,
    PopoverImage,
    FileCapsule,
    Icon,
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
