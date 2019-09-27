<template>
  <el-row type="flex" align="middle" style="flex-direction:row-reverse;">
    <div v-if="avatars.length" v-for="(avatar,index) in avatars.slice(0,max)" :key="index+1">
      <div
        v-bind:style="{left:(startIndex*index)+'px',position:'relative','z-index':avatars.length-index,'display':'flex'}"
      >
        <el-tooltip
          effect="dark"
          :content="avatar.firstName"
          placement="top-start"
          :visible-arrow="false"
        >
          <Avatar
            :av="avatar"
            :src="avatar.profilePhoto"
            :size="size"
            :firstName="avatar.firstName"
            :lastName="avatar.lastName"
          />
        </el-tooltip>
      </div>
    </div>
    <div
      v-if="avatars.length>max"
      style="display: flex;align-items: center;"
      v-bind:style="{left:(-10*avatars.slice(0,max).length+10)+'px',position:'relative','z-index':0}"
    >
      <span class="is-more">+{{avatars.length-max}}</span>
    </div>
    <div @click="$store.dispatch('toggleFilePermissionDialog')">
      <addAvatar
        v-if="addAvatar"
        v-bind:style="{'margin-left':'8px',position:'relative','z-index':0}"
      />
    </div>
  </el-row>
</template>

<script>
import Avatar from './Avatar.vue';
import addAvatar from './addAvatar.vue';
export default {
  props: {
    startIndex: {
      type: Number,
      default: 10,
    },
    max: {
      type: Number,
      default: 5,
    },
    size: {
      type: String,
      default: 'avatar',
    },
    addAvatar: {
      type: Boolean,
      required: false,
    },
    avatars: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: { Avatar, addAvatar },
};
</script>

<style >
.is-more {
  color: #b3b9bf;

  font-size: 14px;
}
</style>
