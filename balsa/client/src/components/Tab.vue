<template>
  <div>
    <el-row
      v-for="(file,index) in renderFiles()"
      v-bind:key="index"
      :class="{'onDragParent':file.id===parseInt(activeDragCss)?true:false}"
      :id="index"
      :data="file.id"
      ondragstart="drag(event,this.id,this)"
      ondrop="drop(event,this.id,this)"
      ondragover="allowDrop(event,this.id,this)"
      ondragleave="leaveDrop(event,this.id,this)"
      draggable="true"
    >
      <el-button
        style="display:none;height:0;width:0"
        @click="vueOnDrop(file.id)"
        :id="`button-drop-${file.id}`"
      ></el-button>
      <el-button
        style="display:none;height:0;width:0"
        @click="changeCss(parseInt(file.id))"
        :id="`button-${file.id}`"
      ></el-button>
      <el-button style="display:none;height:0;width:0" @click="changeCss(-2)" :id="`buttonx--1`"></el-button>
      <div :data="file.id">
        <FileCapsule hoverVisible>
          <template v-slot:divider>
            <Divider />
          </template>
          <el-col :md="22" :xs="22">
            <div class="full-width" @click="el=>callme(el,file)">
              <File>
                <template v-slot:image>
                  <!--it was file.svg -->
                  <BalsaIcon
                    v-if="!file.isFolder"
                    :icon="file.isFolder?'folder.svg':'newFile2.png'"
                  />
                  <el-row v-else type="flex" justify="center" style="padding:24px 0 24px 0">
                    <icon
                      name="folder"
                      style="width:31px;height:24px;"
                      :style="{color:file.color}"
                    />
                  </el-row>
                </template>

                <FileContainer :file="file" />
              </File>
            </div>
          </el-col>
          <el-col :md="10" class="hidden-sm-and-down">
            <AvatarContainer
              :avatars="file.nonMeContributors"
              size="smallAvatar"
              :max="5"
              style="padding-right:80px;"
            />
          </el-col>
          <el-col :sm="2" :xs="3">
            <FileMenu :file="file" v-if="!loading" />
          </el-col>
        </FileCapsule>
      </div>
    </el-row>
  </div>
</template>

<script>
import Icon from './Icon';
import File from './File.vue';
import AvatarContainer from './AvatarContainer.vue';
import BalsaIcon from './BalsaIcon.vue';
import FileContainer from './FileContainer.vue';
import Divider from './Divider.vue';
import FileCapsule from './FileCapsule.vue';
import FileMenu from './Menu/File/FileMenu.vue';
import moment from 'moment';
import { ALL_FOLDERS_QUERY, ONLY_FOLDERS_QUERY, STARRED_FILES_QUERY, GET_FOLDER_PATH_QUERY } from '../queries';
import _ from 'lodash';
import gql from 'graphql-tag';
import NotificationMixin from './Mixins/NotificationMixin';
export default {
  name: 'tabContainer',
  components: {
    FileCapsule,
    Divider,
    AvatarContainer,
    File,
    FileContainer,
    FileMenu,
    BalsaIcon,
    Icon,
  },
  mixins: [NotificationMixin],
  props: {
    recent: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: String,
      default: '',
    },
    files: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  data() {
    return {
      activeDragCss: -2,
      selectedFile: '',
    };
  },

  methods: {
    loadingSuccessState(parent, child) {
      this.notifySuccess(`${child} moved to folder ${parent}`);
    },
    callme(el, file) {
      if (!el.target.classList.contains('el-rate__icon')) {
        if (file.isFolder) {
          this.$router.push({ name: 'home', params: { id: file.id } });
        } else {
          this.$router.push({ name: 'editor', params: { id: file.id } });
        }
      }
    },

    leaveDrop(ev, index, data) {
      let parentId = data.getAttribute('data');
      if (
        this.activeDragCss !== '-1' &&
        ev.target.className !== 'el-row onDragParent' &&
        ev.target.className !== 'title' &&
        ev.target.className !== 'el-row el-row--flex' &&
        ev.target.className !== 'small-span small-text-color small-text-opacity' &&
        ev.target.className !== 'el-row is-justify-center el-row--flex' &&
        ev.target.className !== 'el-row is-align-middle el-row--flex' &&
        ev.target.className !== 'el-row' &&
        ev.target.className !== 'el-rate__icon el-icon-star-off' &&
        ev.target.className !== 'el-rate__item' &&
        ev.target.className !== 'small-span small-text-color'
      ) {
        var link = document.getElementById(`buttonx--1`);
        link.click();
      }

      ev.preventDefault();
    },
    changeCss(id) {
      //this.Vue.set(this, 'activeDragCss', parseInt(index));
      //console.log('changeCss', index, this.activeDragCss);
      if (id !== this.activeDragCss) this.activeDragCss = id;

      //this.$set(this.data, 'activeDragCss', parseInt(index));
    },
    vueOnDrop(id) {
      if (
        this.files[_.findIndex(this.files, ['id', parseInt(id)])].isFolder &&
        parseInt(this.selectedFile) !== parseInt(id)
      ) {
        if (this.activeDragCss === -2) {
          this.activeDragCss = id;
        }
      }
    },
    init() {
      window.drag = this.drag;
      window.drop = this.drop;
      window.allowDrop = this.allowDrop;
      window.leaveDrop = this.leaveDrop;
    },
    allowDrop(ev, index, data) {
      let parentId = data.getAttribute('data');
      var dropLink = document.getElementById(`button-drop-${parentId}`);
      dropLink.click();
      ev.preventDefault();
    },
    drop(ev, index, data) {
      var link = document.getElementById(`buttonx--1`);
      link.click();
      let parentId = data.getAttribute('data');
      ev.preventDefault();

      if (
        this.files[_.findIndex(this.files, ['id', parseInt(parentId)])].isFolder &&
        parseInt(this.selectedFile) !== parseInt(parentId)
      ) {
        this.loadingSuccessState(
          this.files[_.findIndex(this.files, ['id', parseInt(parentId)])].name,
          this.files[_.findIndex(this.files, ['id', parseInt(this.selectedFile)])].name,
        );
        var data = ev.dataTransfer.getData('text');
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: Int!, $parentId: Int) {
                updateFile(id: $id, parentId: $parentId) {
                  id
                  name
                  content
                  user {
                    id
                    firstName
                    lastName
                  }
                  updatedAt
                  parent {
                    id
                  }
                }
              }
            `,
            variables: {
              id: parseInt(this.selectedFile),
              parentId: parseInt(parentId),
            },
            refetchQueries: ['allFolders', 'onlyFolders', 'starredFiles'],
          })
          .then(() => {
            //document.getElementById(data).remove();
          });
      }

      //ev.target.appendChild(document.getElementById(data));
    },
    drag(ev, index, data) {
      this.selectedFile = data.getAttribute('data');
      ev.dataTransfer.setData('text', ev.target.id);
    },
    renderFiles() {
      if (this.filter !== '') {
        if (this.recent) {
          return this.sortBySelected(this.filterByRecent(this.filterFiles(this.files)));
        }
        return this.sortBySelected(this.files);
      }

      return this.files;
    },
    isEmpty(arr) {
      return _.isEmpty(arr);
    },
    sortBySelected(arrays) {
      if (this.filter === 'date_order_asc') {
        return this.sortByRecent(arrays);
      } else if (this.filter === 'asc') {
        return this.sortByTitle(arrays);
      } else if (this.filter === 'desc') {
        return this.sortByTitle(arrays, 'desc');
      }
    },
    sortByTitle(arrays, direction = 'asc') {
      return _.orderBy(arrays, [file => file.name.toLowerCase()], [direction]);
    },
    sortByRecent(arrays) {
      return _.orderBy(arrays, ['updatedAt', 'createdAt'], ['desc', 'desc']);
    },
    filterByRecent(arrays) {
      return _.filter(arrays, f => Date.now() - f.updatedAt < 86400000 || Date.now() - f.createdAt < 86400000); // less than 1 day old
    },
    filterFiles(arrays) {
      return _.filter(arrays, f => !f.isFolder);
    },
  },
  created: function() {
    this.init();
  },
};
</script>

