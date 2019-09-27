<template>
  <el-row>
    <el-row type="flex">
      <router-link
        :to="file.isFolder?{name:'home', params:{id: file.id}}:{name:'editor', params:{id: file.id}}"
      >
        <span class="title">{{file.title || file.name}}</span>
      </router-link>
      <Stars :file="file" style="margin-left:5px" />
    </el-row>

    <el-row v-if="file.editor || file.user">
      <span class="small-span small-text-color">{{file.status||status}}</span>
      <span class="small-span small-text-color small-text-opacity">{{' '}}by{{' '}}</span>
      <span
        class="small-span small-text-color"
      >{{`${(file.editor||file.user).firstName} ${(file.editor||file.user).lastName.substring(0,1)}.`}}</span>
    </el-row>
  </el-row>
</template>

<script>
import Stars from './Stars/Stars.vue';
import moment from 'moment';
export default {
  components: {
    Stars,
  },
  computed: {
    status() {
      return this.$props.file.updatedAt
        ? moment(parseInt(this.$props.file.updatedAt)).fromNow()
        : moment(parseInt(this.$props.file.createdAt)).fromNow();
    },
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.title {
  color: #323f50;
}
</style>
