<template>
  <div class="balsa-tab">
    <el-breadcrumb separator="/" style="padding-left:8px;padding-bottom:5px;padding-top:5px">
      <el-breadcrumb-item :to="{ path: '/' }" style="font-size:16px;">My Drive</el-breadcrumb-item>
      <el-breadcrumb-item
        style="font-size:16px;"
        v-for="(node,index) in folderPath"
        v-bind:key="index"
        :to="{ path: '/'+node.id }"
      >{{node.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="$router.push({name:'home'})" class="overflow-unset">
      <el-tab-pane label="All" name="first">
        <div
          v-if="isEmpty(allFolders) && !this.$apollo.queries.allFolders.loading"
          class="nofiles"
        >No Files or Folders.</div>
        <Tab
          :loading="this.$apollo.queries.allFolders.loading"
          :files="allFolders"
          :filter="filter"
        ></Tab>
      </el-tab-pane>

      <el-tab-pane label="Folders" name="second">
        <el-row
          v-if="isEmpty(onlyFolders) && !this.$apollo.queries.onlyFolders.loading"
          style="min-height:36vh;flex-direction:column;"
          type="flex"
          justify="center"
          align="middle"
        >
          <i class="el-icon-folder-opened" style="font-size:48px;color:rgba(0, 122, 255, 0.67)"></i>
          <span style="font-size:28px;color: #303133b3;">No folders created, yet</span>
          <el-row type="flex">
            <CreateFolder>
              <span
                style="text-decoration:underline;cursor:pointer;margin-right:5px;"
                class="medium-font"
              >Create a folder</span>
            </CreateFolder>
            <span style="opacity: 0.9;" class="medium-font">to get organized</span>
          </el-row>
        </el-row>
        <Tab
          :loading="this.$apollo.queries.onlyFolders.loading"
          :files="onlyFolders"
          :filter="filter"
        ></Tab>
      </el-tab-pane>

      <el-tab-pane label="Starred" name="third">
        <el-row
          v-if="!this.$apollo.queries.starredFiles.loading && isEmpty(starredFiles)"
          style="min-height:36vh;flex-direction:column"
          type="flex"
          justify="center"
          align="middle"
        >
          <i class="el-icon-star-off" style="font-size:48px;    color: rgba(0, 122, 255, 0.67)"></i>
          <span style="font-size:28px;    color: #303133b3;">No starred documents, yet</span>
          <el-row type="flex">
            <span
              style="opacity: 0.9;"
              class="medium-font"
            >They will show up here once you star them</span>
          </el-row>
        </el-row>
        <Tab
          :loading="this.$apollo.queries.starredFiles.loading"
          :files="starredFiles"
          :filter="filter"
        ></Tab>
      </el-tab-pane>

      <el-tab-pane label="Recent" name="fourth">
        <div
          v-if="isEmpty(allFolders) && !this.$apollo.queries.allFolders.loading"
          class="nofiles"
        >No Files or Folders.</div>
        <Tab
          :loading="this.$apollo.queries.allFolders.loading"
          :files="allFolders"
          :filter="filter"
          recent
        ></Tab>
      </el-tab-pane>
    </el-tabs>
    <div class="balsa-tab-filter">
      <Select :text="true" :options="options" class="balsa-no-border-select" v-model="filter" />
    </div>
  </div>
</template>

<script>
import Icon from './Icon';
import File from './File.vue';
import AvatarContainer from './AvatarContainer.vue';
import BalsaIcon from './BalsaIcon.vue';
import FileContainer from './FileContainer.vue';
import Divider from './Divider.vue';
import Tab from './Tab.vue';
import FileCapsule from './FileCapsule.vue';
import PopoverImage from './PopoverImage.vue';
import FileMenu from './Menu/File/FileMenu.vue';
import Select from './Select.vue';
import moment from 'moment';
import CreateFolder from './CreateFolder.vue';
import { ALL_FOLDERS_QUERY, ONLY_FOLDERS_QUERY, STARRED_FILES_QUERY, GET_FOLDER_PATH_QUERY } from '../queries';
import _ from 'lodash';
import gql from 'graphql-tag';

export default {
  name: 'tabContainer',
  components: {
    FileCapsule,
    Divider,
    Tab,
    Icon,
    AvatarContainer,
    File,
    FileContainer,
    PopoverImage,
    Select,
    FileMenu,
    BalsaIcon,
    CreateFolder,
  },
  data() {
    return {
      filter: 'date_order_asc',
      is_mobile: false,
      selectedFile: '',
      favourites: [],
      options: [
        {
          value: 'date_order_asc',
          label: 'Most recent',
        },
        {
          value: 'asc',
          label: 'Title: A to Z',
        },
        {
          value: 'desc',
          label: 'Title: Z to A',
        },
        // {
        //   value: 'exp1',
        //   label: 'Recently viewed',
        // },
        // {
        //   value: 'exp2',
        //   label: 'Created by me',
        // },
      ],
      avatars: [
        {
          profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          firstName: 'İchigo',
        },
        {
          profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          firstName: 'Matsumoto',
        },
      ],
      activeName: 'first',
    };
  },

  created: function() {
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var Android = /(Android)/g.test(navigator.userAgent);
    if (iOS == true) {
      this.is_mobile = true;
    } else if (Android == true) {
      this.is_mobile = true;
    }
  },
  methods: {
    isEmpty(arr) {
      return _.isEmpty(arr);
    },
  },
  apollo: {
    folderPath: {
      query: GET_FOLDER_PATH_QUERY,
      variables() {
        return { id: parseInt(this.$route.params.id) };
      },
    },
    allFolders: {
      query: ALL_FOLDERS_QUERY,
      variables() {
        return { parentId: parseInt(this.$route.params.id) };
      },
    },
    starredFiles: {
      query: STARRED_FILES_QUERY,
    },
    onlyFolders: {
      query: ONLY_FOLDERS_QUERY,
      variables() {
        return { parentId: parseInt(this.$route.params.id) };
      },
    },
  },
};
</script>

<style scoped>
.nofiles {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}
</style>

