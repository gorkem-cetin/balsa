<template>
  <el-row>
    <div class="block">
      <el-rate @change="updateStatus" :max="1" :value="file.isStarred?1:0"></el-rate>
    </div>
  </el-row>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // same as { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    };
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateStatus(e) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($fileId: Int!) {
            starFile(fileId: $fileId) {
              id
              isStarred
            }
          }
        `,
        variables: {
          fileId: this.file.id,
        },
        refetchQueries: ['starredFiles', 'File'],
      });
    },
  },
};
</script>

<style>
</style>
