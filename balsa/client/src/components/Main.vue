<template>
  <MainCapsule>
    <el-main style="padding-top:30px;height:100%">
      <el-row type="flex" justify="space-between" style="flex-direction:column;height:100%">
        <el-row>
          <slot></slot>
        </el-row>
        <div>Version: {{version}}</div>
      </el-row>
    </el-main>
  </MainCapsule>
</template>

<script>
import MainCapsule from './MainCapsule.vue';
import moment from 'moment';
import gql from 'graphql-tag';
export default {
  components: {
    MainCapsule,
  },
  apollo: {
    version: {
      query: gql`
        query version {
          version
        }
      `,
    },
  },
};
</script>

