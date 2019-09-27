<template >
  <el-menu
    class="el-menu-demo"
    style="border-right:0"
    placement="bottom"
    mode="vertical"
    v-if="!this.$apollo.queries.checkToken.loading"
    @open="true"
    @select="(data)=>handleSelect(data)"
  >
    <router-link to="/profile">
      <el-menu-item index="my-profile">My Profile</el-menu-item>
    </router-link>
    <router-link to="/settings">
      <el-menu-item index="my-settings">My Settings</el-menu-item>
    </router-link>
    <router-link to="/team-settings">
      <el-menu-item index="team-settings" v-if="checkToken.role !== 'User'">Team Settings</el-menu-item>
    </router-link>
    <Divider class="divider-margin" v-if="checkToken.role !== 'User'" />
    <!-- <router-link to="/activities">
      <el-menu-item index="activities">Activities</el-menu-item>
    </router-link>-->
<!--    <router-link to="/system">-->
<!--      <el-menu-item index="system" v-if="checkToken.role !== 'User'">System</el-menu-item>-->
<!--    </router-link>-->
    <router-link to="/configurations">
      <el-menu-item index="configurations" v-if="checkToken.role !== 'User'">Configurations</el-menu-item>
    </router-link>

    <Divider class="divider-margin" />
    <el-menu-item index="switch">
      <el-switch
        v-model="value1"
        @change="((data)=>change(data))"
        active-text="Dark mode"
        class="balsa-menu-switch"
      ></el-switch>
    </el-menu-item>
    <router-link to="/logout">
      <el-menu-item index="log-out">Log Out</el-menu-item>
    </router-link>
  </el-menu>
</template>

<script>
import Divider from '../../Divider.vue';
import gql from "graphql-tag";
export default {
  props: {
    parentProps: {
      type: Object,
    },
  },
  apollo: {
    checkToken: {
      query: gql`
        query checkToken {
          checkToken {
            id
            role
          }
        }
      `,
    },
  },
  data() {
    return {
      value1: null,
    };
  },
  components: {
    Divider,
  },
  created() {
    let dat = localStorage.getItem('balsa-dark');
    if (dat) {
      this.value1 = true;
    }
  },
  methods: {
    change(data) {
      if (data) {
        document.querySelector('body').classList.add('dark');
        localStorage.setItem('balsa-dark', true);
      } else {
        document.querySelector('body').classList.remove('dark');
        localStorage.removeItem('balsa-dark');
      }
    },
    //action is an index prop. edit,share,invite...
    handleSelect(action) {
      //open or close menu
      if (action !== 'switch') {
        this.parentProps.handleMenu();
        //notify which action is selected
        this.parentProps.handleAction(action);
      }
    },
  },
};
</script>

<style scoped >
.divider-margin {
  margin: 5px 0;
}
.balsa-divider {
  padding: 10px;
}
.el-menu-demo {
  flex-direction: column;
}
.el-menu-item {
  font-size: 15px;

  font-weight: 500;
  height: 33px;
  line-height: 33px;
}
</style>
