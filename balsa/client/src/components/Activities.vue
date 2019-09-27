<template>
  <el-row style="margin-top:60px" class="balsa-container">
    <!-- <el-row v-for="(data,index) in activities" :key="index">
      <Divider v-if="index!==0" style="padding:20px 0" />
      <el-row type="flex" align="middle">
        <Avatar :src="data.actor.profilePhoto" />
        <el-row style="margin-left:12px;  ">
          <span class="semi-medium-font medium-font-weight" style="color: rgb(112, 129, 148);">
            <span
              v-if="data.objectType === 'UserInviteCode' || data.objectType === 'Contributor'"
              class="semi-medium-font"
              v-html="data.message"
            ></span>
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
    </el-row>-->
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <TimeStamps :datas="activities"/>
      </el-col>
    </el-row>
    <el-pagination
      v-if="!!activitiesMeta"
      :page-size="pageSize"
      @current-change="handlePageChange"
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :total="activitiesMeta.count">
    </el-pagination>
  </el-row>
</template>

<script>
  import Divider from './Divider.vue';
  import Avatar from './Avatar.vue';
  import {ACTIVITIES_QUERY, ACTIVITIES_META_QUERY} from './../queries';
  import moment from 'moment';
  import TimeStamps from './TimeStamps.vue';

  const PAGE_SIZE=20

  export default {
    components: {
      Divider,
      Avatar,
      TimeStamps,
    },
    methods: {
      handlePageChange(page){
        this.$apollo.queries.activities.refetch({skip:(page-1)*PAGE_SIZE})
      },
      convertDate(createdAt) {
        return moment(parseInt(createdAt)).fromNow();
      },
    },
    apollo: {
      activitiesMeta: {
        query: ACTIVITIES_META_QUERY,
      },
      activities: {
        query: ACTIVITIES_QUERY,
        variables:{
          first:PAGE_SIZE,
          skip:0
        },
        result({data}) {
          const activities = data.activities;
          this.activities = activities.map(activity => {
            //const time = new Date(); //moment(parseInt(activity.createdAt)).fromNow();

            let actorFirstName = activity.actor.firstName;
            let actorLastName = activity.actor.lastName;

            if (activity.action === 'Updated File') {
              const fileName = activity.file.name;
              if (activity.actor.id === activity.file.user.id) {
                actorFirstName = 'You';
                actorLastName = '';
              }
              activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> edited your file `;
              activity.fileName = fileName;

            } else if (activity.action === 'Starred File') {
              const fileName = activity.star.file.name;

              if (activity.actor.id === activity.star.user.id) {
                activity.message = `<span class='semi-medium-font actorName'>You starred file `;
              } else {
                activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> starred your file `;
              }
              activity.fileName = fileName;

            } else if (activity.action === 'Accepted User Invitation') {
              activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> accepted your invitation ${time}.`;

            } else if (activity.action === 'Created File') {
              const fileName = activity.file.name;
              if (activity.actor.id === activity.file.user.id) {
                actorFirstName = 'You';
                actorLastName = '';
              }
              activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> started writing a new document `;
              activity.fileName = fileName;

            } else if (activity.action === 'Gave Permission') {
              const fileName = activity.contributor.file.name;
              if (activity.actor.id === activity.contributor.user.id) {
                activity.message = `<span class='semi-medium-font actorName'>You</span> shared a document with ${activity.contributor.user.firstName} ${activity.contributor.user.lastName}: `;
              } else {
                activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> shared a document with you: `;
              }
              activity.fileName = fileName;
            } else if (activity.action === 'User Received a You are Mentioned E-mail') {
              const fileName = activity.file.name;
              activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> mentioned you in a document:`;
              activity.fileName = fileName;
            } else if (activity.action === 'Created Folder') {
              const fileName = activity.file.name;
              if (activity.actor.id === activity.file.user.id) {
                actorFirstName = 'You';
                actorLastName = '';
              }
              activity.message = `<span class='semi-medium-font actorName'>${actorFirstName} ${actorLastName}</span> created a directory `;
              activity.fileName = fileName;
            }

            //activity.createdAt = time;
            return activity;
          });
        },
      },
    },
    data() {
      return {
        pageSize:PAGE_SIZE,
        datas: [1, 2, 3],
      };
    },
  };
</script>

<style>
  .actorName {
    color: #323f50;
  }

  .activities-img img {
    padding: 0;
    width: 12px;
  }
</style>
