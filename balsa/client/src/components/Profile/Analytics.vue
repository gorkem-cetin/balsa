<template>
  <ProfileContainer>
    <el-row>
      <h1 class="balsa-h1-row">Analytics</h1>
      <h3
        style="margin-top:28px;margin-bottom:10px;"
        class="balsa-pading-left-5"
      >Most popular documents</h3>
      <Table class="mobile-max-width" />
      <!--ACTIVATE CARD-->
      <!--<ActiveContributorsContainer />-->
      <!-- / ACTIVATE CARDs-->
      <!--RECENT CARD-->
      <!--<RecentContributorsContainer /> -->
      <!-- / RECENT CARDs-->
    </el-row>
  </ProfileContainer>
</template>

<script>
import ProfileContainer from './ProfileContainer.vue';
import Table from '../Table.vue';
import ActiveContributorsContainer from './Components/Analytics/ActiveContributorsContainer.vue';
import RecentContributorsContainer from './Components/Analytics/RecentContributorsContainer.vue';
export default {
  components: {
    ProfileContainer,
    Table,
    ActiveContributorsContainer,
    RecentContributorsContainer,
  },
};
</script>

<style scoped>
</style>
