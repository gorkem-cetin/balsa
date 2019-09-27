<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo trans"
        @open="handleOpen"
        @close="handleClose"
        v-if="!!myProfile"
      >
        <div
          v-for="(ar,index) in arr.filter((rx)=>!rx.isCheck || myProfile.role !=='User')"
          :key="index"
        >
          <router-link :to="ar.link" v-if="ar.name!=='blank'">
            <el-menu-item :index="index.toString()">
              <span>{{ar.name}}</span>
            </el-menu-item>
          </router-link>
          <div v-else class="empty-line" />
        </div>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import gql from 'graphql-tag';
export default {
  data() {
    return {
      activeIndex: '0',
      arr: [
        { name: 'My Profile', link: '/profile', isCheck: false },
        { name: 'My Settings', link: '/settings', isCheck: false },
        { name: 'Team Settings', link: '/team-settings', isCheck: true },
        //{ name: 'blank' },
        //{ name: 'Analytics', link: '/analytics' },
        //{ name: 'System', link: '/system' },
        { name: 'Configurations', link: '/configurations', isCheck: true },
      ],
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
            role
            profilePhoto
          }
        }
      `,
    },
  },
  created: function() {
    //this.activeIndex;
    var currentUrl = window.location.pathname;
    this.arr.forEach((ar, index) => (ar.link === currentUrl ? (this.activeIndex = index.toString()) : null));

    // `this` points to the vm instance
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
  },
};
</script>

<style scoped>
.empty-line {
  padding: 15px 0;
}
.el-menu-item {
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  height: 29px;
  line-height: 29px;
  border: 2px solid transparent;
}
.is-active {
  border-left: 2px solid;
}
.el-menu-vertical-demo {
  border-right: 0;
}
</style>
