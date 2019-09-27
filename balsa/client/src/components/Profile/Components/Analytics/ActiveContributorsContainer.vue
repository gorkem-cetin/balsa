<template>
  <el-row>
    <el-row type="flex" align="middle" justify="space-between" style="margin-top:63px;">
      <h3>Most active contributors</h3>
      <div>
        <span class="pale small-span font-heavy" style="margin-right:7px;">Show all</span>
        <img alt="balsa" src="../../../../assets/arrow-right.svg" />
      </div>
    </el-row>
    <el-row :gutter="24">
      <el-col
        :md="6"
        style="margin-top:21px;"
        :xs="12"
        v-for="(contributor,index) in contributors"
        :key="index"
      >
        <ActiveContributors
          :name="contributor.name"
          :surname="contributor.surname"
          :owned="contributor.owned"
          :contributions="contributor.contributions"
          :online="contributor.online"
        />
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import ActiveContributors from '../../../Cards/Analytics/ActiveContributors.vue';
export default {
  components: {
    ActiveContributors,
  },
  data: function() {
    return {
      contributors: [
        {
          name: 'Theresa',
          surname: 'Kaufmann',
          contributions: 76,
          owned: 23,
          online: true,
        },
        {
          name: 'Anna',
          surname: 'Graham',
          contributions: 54,
          owned: 8,
          online: false,
        },
        {
          name: 'Patrice',
          surname: 'Loken',
          contributions: 50,
          owned: 7,
          online: true,
        },
        {
          name: 'Léa',
          surname: 'Hollande',
          contributions: 34,
          owned: 9,
          online: true,
        },
      ],
    };
  },
};
</script>

<style>
</style>
