<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(data,index) in datas"
        :key="index"
        :hide-timestamp="false"
        :color="qwf(data.action)"
        size="large"
        placement="bottom"
      >
        <el-card>
          <el-row type="flex" align="middle">
            <Avatar
              :src="data.actor.profilePhoto"
              :firstName="data.actor.firstName"
              :lastName="data.actor.lastName"
            />
            <el-row style="margin-left:12px;  ">
              <span class="semi-medium-font medium-font-weight" style="color: rgb(112, 129, 148);">
                <span
                  v-if="data.objectType === 'UserInviteCode'"
                  class="semi-medium-font"
                  v-html="data.message"
                ></span>

                <span v-else-if="data.objectType === 'Contributor'" class="semi-medium-font">
                  <span class="semi-medium-font" v-html="data.message"></span>
                  <router-link :to="data.contributor.file.getUrl">
                    <span
                      class="semi-medium-font"
                      style="color:#007aff;font-weight:600"
                    >{{ data.fileName }}</span>
                  </router-link>
                </span>
                <span v-else class="semi-medium-font">
                  <span class="semi-medium-font" v-html="data.message"></span>
                  <router-link :to="data.file ? data.file.getUrl : data.star.file.getUrl">
                    <span
                      class="semi-medium-font"
                      style="color:#007aff;font-weight:600"
                    >{{ data.fileName }}</span>
                  </router-link>
                </span>
              </span>
              <el-row type="flex" align="middle">
                <i class="el-icon-time" style="color: rgb(112, 129, 148);" />
                <span
                  class="semi-medium-font"
                  style="color: rgb(112, 129, 148);font-size:11px;margin-left:4px;"
                >{{ convertDate(data.createdAt) }}</span>
              </el-row>
            </el-row>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import Avatar from './Avatar.vue';
import moment from 'moment';
export default {
  components: { Avatar },
  props: {
    datas: {
      default: ()=> [],
      type: Array,
    },
  },
  methods: {
    convertDate(createdAt) {
      return moment(parseInt(createdAt)).fromNow();
    },
    qwf(action) {
      if (action === 'Created File') {
        return '#007aff';
      }
      //   else if (action === 'Starred File') {
      //     return 'rgb(247, 186, 42)';
      //   } else if (action === 'Gave Permission') {
      //     return '#33c871';
      //   }
    },
  },
};
</script>

<style>
</style>
