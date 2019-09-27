<template>
  <div class="balsa-container">
    <el-row type="flex" style="justify-content:flex-end" class="mobile-margin-bottom-32">
      <el-button
        style="margin-right:10px;"
        type="success"
        @click="createFile(true)"
        :plain="false"
        icon="el-icon-files"
        class="semi-medium-font"
      >Create File</el-button>
      <CreateFolder />
    </el-row>
    <el-row v-if="(allFolders&&allFolders.length>0 ) && !this.$apollo.queries.myFiles.loading">
      <!-- <BalsaSpaceBetween text buttonText="Create new" /> -->
      <el-row
        type="flex"
        justify="space-between"
        style="padding-left:8px"
        v-if="!this.$apollo.queries.myFiles.loading"
      >
        <h1 v-if="!quickAccess" style="font-size:23px;">Quick Access</h1>
      </el-row>
      <el-row v-if="!quickAccess" :gutter="20" style="margin-top:13px;">
        <el-col :md="6" :sm="8" :xs="12" v-for="card in cards" v-bind:key="card.id">
          <DocCard
            :id="card.id"
            :title="card.title"
            :time="card.time"
            :others="card.others"
            :content="card.content ? card.content : ''"
          />
        </el-col>
      </el-row>
      <!-- <el-row type="flex" :gutter="20" justify="space-between" style="margin-top:65px;">
        <el-col :span="24">
          <h1
            style="padding-left:8px;font-size:23px;font-weight:600;margin-bottom:14px;"
            class="primary-color"
          >Recently updated</h1>
          <el-row v-for="(file,index) in files" v-bind:key="index">
            <FileCapsule hoverVisible>
              <template v-slot:divider>
                <Divider />
              </template>
              <el-col :span="22" :xs="24">
                <File>
                  <template v-slot:image>
                    <BalsaIcon icon="file.png" />
                  </template>

                  <FileContainer :file="file" />
                </File>
              </el-col>

              <el-col :md="2" :xs="3">
                <FileMenu :file="file" />
              </el-col>
            </FileCapsule>
          </el-row>
        </el-col>
      </el-row>-->
      <!-- <el-row type="flex" justify="space-between" style="margin-top:49px; padding-left:8px">
        <h1 style="font-size:23px;">Files and Folders</h1>
      </el-row>-->
      <TabContainer class="margin-top-25" :class="{'marginTop55':true}" style="min-height: 400px;"></TabContainer>
    </el-row>
    <el-row
      v-if="(allFolders&&allFolders.length<=0 )"
      style="min-height:50vh;flex-direction:column"
      type="flex"
      justify="center"
      align="middle"
    >
      <i class="el-icon-document" style="font-size:48px;color:rgba(0, 122, 255, 0.67)"></i>
      <span style="font-size:28px;color: #303133b3;">Feeling lonely. No documents in sight, yet</span>
      <el-row type="flex" justify="center" align="middle" class="flexDirectionColumn">
        <span style="margin-right:5px;    opacity: 0.9;">Why not go ahead and create one?</span>
        <BalsaSpaceBetween text buttonText="Create new" style="margin-top:15px;" />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import BalsaSpaceBetween from '../BalsaSpaceBetween.vue';
import BalsaIcon from '../BalsaIcon.vue';
import File from '../File.vue';
import DocCard from '../DocCard.vue';
import FileContainer from '../FileContainer.vue';
import Divider from '../Divider.vue';
import FileCapsule from '../FileCapsule.vue';
import PopoverImage from '../PopoverImage.vue';
import gql from 'graphql-tag';
import moment from 'moment';
import { RECENT_FILES_QUERY, MY_FILES_QUERY, ALL_FOLDERS_QUERY } from '../../queries';
import CreateFolder from '../CreateFolder.vue';
import TabContainer from '../TabContainer.vue';

export default {
  methods: {
    checkRoot(to) {
      if (to.path === '/' || to.path === '/home') {
        this.quickAccess = false;
      } else {
        this.quickAccess = true;
      }
    },
    createFile(inFolder) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createFile($content: String, $folderId: Int) {
              createFile(content: $content, folderId: $folderId) {
                id
                name
                content
                user {
                  id
                  firstName
                  lastName
                }
                updatedAt
              }
            }
          `,
          variables: {
            folderId: inFolder ? parseInt(this.$route.params.id) : undefined,
          },
        })
        .then(({ data }) => {
          this.$router.push({ name: 'editor', params: { id: data.createFile.id } });
        });
    },
    parseTimingLog(f, myId) {
      if (f.lastEditor) {
        if (!f.lastEditor.updatedFileAt) {
          f.lastEditor.updatedFileAt = '0';
        }
      }
      const lastEditor = {};
      const lastReader = {};

      if (f.lastEditor) {
        if (f.updatedAt > f.lastEditor.updatedFileAt) {
          lastEditor.editor = 'You';
          lastEditor.time = moment(parseInt(f.updatedAt)).fromNow();
          lastEditor.timestamp = f.updatedAt;
        } else {
          lastEditor.editor = `${f.lastEditor.user.firstName} ${f.lastEditor.user.lastName}`;
          lastEditor.time = moment(parseInt(f.lastEditor.updatedFileAt)).fromNow();
          lastEditor.timestamp = f.lastEditor.updatedFileAt;
        }
        if (f.readAt > f.lastEditor.readAt) {
          lastReader.editor = 'You';
          lastReader.time = moment(parseInt(f.readAt)).fromNow();
          lastReader.timestamp = f.readAt;
        } else {
          lastReader.editor = `${f.lastEditor.user.firstName} ${f.lastEditor.user.lastName}`;
          lastReader.time = moment(parseInt(f.lastEditor.readFileAt)).fromNow();
          lastReader.timestamp = f.lastEditor.readFileAt;
        }
      } else {
        lastEditor.editor = 'You';
        lastEditor.time = moment(parseInt(f.updatedAt)).fromNow();
        lastEditor.timestamp = f.updatedAt;
        lastReader.editor = 'You';
        lastReader.time = moment(parseInt(f.readAt)).fromNow();
        lastReader.timestamp = f.readAt;
      }

      if (lastEditor.editor === 'You' && lastEditor.timestamp > lastReader.timestamp) {
        // 1
        return `You edited this ${lastEditor.time}`;
      } else if (lastReader.editor === 'You' && lastReader.timestamp > lastEditor.timestamp) {
        // 2
        return `You viewed this ${lastReader.time}`;
      } else if (lastEditor.editor !== 'You' && lastEditor.timestamp > lastReader.timestamp) {
        // 3
        if (myId === f.lastEditor.user.id) {
          return `You edited this ${lastEditor.time}`;
        } else {
          return `${lastEditor.editor} edited this ${lastEditor.time}`;
        }
      } else if (lastReader.editor !== 'You' && lastReader.timestamp > lastEditor.timestamp) {
        // 4
        if (myId === f.lastEditor.user.id) {
          return `You viewed this ${lastReader.time}`;
        } else {
          return `${lastReader.editor} viewed this ${lastReader.time}`;
        }
      }
    },
  },
  data: function() {
    return {
      cards: [],
      files: [],
      quickAccess: true,
    };
  },
  apollo: {
    allFolders: {
      query: ALL_FOLDERS_QUERY,
      variables() {
        return { parentId: parseInt('') };
      },
    },
    myFiles: {
      query: MY_FILES_QUERY,
      result({ data }) {
        const myId = parseInt(localStorage.getItem('USERID'));
        this.cards = data.myFiles.map(f => ({
          id: f.id,
          title: f.name,
          time: this.parseTimingLog(f, myId),
          content: f.contentHtml,
          isStarred: f.isStarred,
          hasWritePermission: f.hasWritePermission,
        }));
      },
    },
    recentFiles: {
      query: RECENT_FILES_QUERY,
      result({ data }) {
        const myId = parseInt(localStorage.getItem('USERID'));
        this.files = data.recentFiles.map(f => {
          return {
            id: f.id,
            type: 'file',
            title: f.name,
            status: moment(parseInt(f.updatedAt)).fromNow(),
            editor: f.user,
            time: this.parseTimingLog(f, myId),
            isStarred: f.isStarred,
            hasWritePermission: f.hasWritePermission,
          };
        });
      },
    },
  },
  components: {
    BalsaSpaceBetween,
    DocCard,
    File,
    BalsaIcon,
    FileCapsule,
    PopoverImage,
    Divider,
    FileContainer,
    TabContainer,
    CreateFolder,
  },
  created() {
    this.checkRoot(this.$route);
  },
  watch: {
    $route(to, from) {
      this.checkRoot(to);
    },
  },
};
</script>

<style lang='scss'>
@import '../../assets/sass/color.scss';
.flexDirectionColumn {
  flex-direction: column;
}
.marginTop55 {
  margin-top: 55px;
}
h1 {
  color: $--color-h1;
  margin: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
