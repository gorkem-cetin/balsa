<template>
  <el-row class="auto-comp-balsa">
    <el-autocomplete
      :hide-loading="true"
      popper-class="my-autocomplete"
      v-model="searchQuery"
      :debounce="400"
      :fetch-suggestions="querySearch"
      placeholder="Search for anything you want …"
      @select="handleSelect"
      :class="balsaClass"
    >
      <!-- <i class="el-icon-edit el-input__icon" slot="suffix"></i> -->
      <template slot-scope="{ item }">
        <div v-if="!item.file.isFolder">
          <el-popover
            :open-delay="500"
            popper-class="hey"
            placement="left-start"
            width="380"
            trigger="hover"
            content="this is content, this is content, this is content"
            :id="'balsa-auto-'+item.file.id"
          >
            <el-row v-html="item.file.contentHtml"></el-row>

            <el-row slot="reference" type="flex" align="middle">
              <router-link
                :to="item.file.isFolder? '/'+item.file.id:'/editor/'+item.file.id"
                style="display:flex;color:unset;width:100%;align-items:center"
              >
                <BalsaIcon :icon="item.file.isFolder?'folder.svg':'file.svg'" />
                <el-col :span="24" style="margin-left:16px;">
                  <div class="fullWidth">
                    <span
                      class="title medium-font medium-font-weight"
                      :class="item.highlightedField==='name' ? 'bold-title':''"
                    >{{item.file.name}}</span>
                  </div>
                  <span
                    v-if="item.highlightedField!=='name'"
                    style="font-size:12px;"
                    class="highlight-balsa"
                    v-html="item.highlight"
                  ></span>
                  <el-row>
                    <span style="font-size:11px;font-weight:400">{{parseTimingLog(item.file)}}</span>
                  </el-row>
                </el-col>
              </router-link>
            </el-row>
          </el-popover>
        </div>
        <div v-else>
          <el-row slot="reference" type="flex" align="middle">
            <BalsaIcon :icon="item.file.isFolder?'folder.svg':'file.svg'" />
            <el-col :span="24" style="margin-left:16px;">
              <div class="fullWidth">
                <span
                  class="title medium-font medium-font-weight"
                  :class="item.highlightedField==='name' ? 'bold-title':''"
                >{{item.file.name}}</span>
              </div>
              <span
                v-if="item.highlightedField!=='name'"
                style="font-size:12px;"
                class="highlight-balsa"
                v-html="item.highlight"
              ></span>
              <el-row>
                <span style="font-size:11px;font-weight:400">{{parseTimingLog(item.file)}}</span>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div v-if="item.file.id !==lastEl.file.id" class="search-divider"></div>
      </template>
    </el-autocomplete>
  </el-row>
</template>

<script>
import { SEARCH_FILE_QUERY } from '../queries';
import moment from 'moment';
import gql from 'graphql-tag';
import BalsaIcon from './BalsaIcon.vue';
export default {
  components: {
    BalsaIcon,
  },
  props: {
    smallPlaceHolder: {
      type: Boolean,
      required: false,
    },
    filled: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      cb: null,
      myQueryString: '',
      backupLinks: [],
      controll: false,
      links: [],
      lastEl: null,
      balsaClass: '',
      searchQuery: '',
    };
  },
  methods: {
    loadMore() {
      this.links = this.backupLinks;
      this.cb(this.links);
      var element = document.getElementById('show-more-div-balsa');
      element.parentNode.removeChild(element)
    },
    parseTimingLog(f) {
      let myId = parseInt(localStorage.getItem('USERID'));

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
    handleSelect() {},
    querySearch(queryString, cb) {
      if (this.myQueryString !== queryString) {
        this.myQueryString = queryString;
        this.$apollo
          .mutate({
            mutation: gql`
              mutation searchFile($query: String!) {
                searchFile(query: $query) {
                  highlight
                  highlightedField
                  file {
                    id
                    isFolder
                    updatedAt
                    name
                    readAt
                    content
                    contentHtml
                    lastEditor {
                      id
                      updatedFileAt
                      user {
                        id
                        firstName
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              query: queryString,
            },
          })
          .then(({ data }) => {
            let myData = data.searchFile.filter(dat => dat.highlight && dat);
            if (myData.length > 3) {
              this.backupLinks = myData;
              this.links = myData.slice(0, 3);
              this.lastEl = myData[myData.slice(0, 3).length - 1];
            } else {
              this.backupLinks = myData;
              this.links = myData;
              this.lastEl = myData[myData.length - 1];
            }
            this.cb = cb;
            cb(this.links);
          })
          .then(() => {
            let itself = document.getElementById('show-more-div-balsa');
            if (!itself && this.backupLinks.length > 3) {
              let parent = document.getElementById('balsa-auto-' + this.lastEl.file.id).parentElement.parentElement.id;
              document
                .getElementById(parent)
                .insertAdjacentHTML(
                  'afterend',
                  "<div id='show-more-div-balsa' style='display:flex;margin-top:8px;justify-content:center'><span onclick='loadMore()' class='title semi-medium-font medium-font-weight' style='color: #007aff;cursor:pointer;'><i class='el-icon-caret-bottom'></i> Show more</span></div>",
                );
            } else {
              var element = document.getElementById('show-more-div-balsa');
              if(element){
                element.parentNode.removeChild(element);
              }
            }
          });

        // call callback function to return suggestion objects
      } else if (this.myQueryString === queryString && queryString.length > 0) {
        cb(this.links);
      } else {
        cb([]);
      }
    },
  },
  created: function() {
    window.loadMore = this.loadMore;
    if (this.filled) this.balsaClass += 'filled';
    if (this.smallPlaceHolder) this.balsaClass = this.balsaClass + ' el-input';
  },
};
</script>

<style>
.el-autocomplete-suggestion li.highlighted .title {
  color: #007aff;
}
.el-autocomplete-suggestion li:hover .title {
  color: #007aff;
}
.bold-title {
  color: #007aff;
  font-weight: 500;
}
.el-autocomplete-suggestion li {
  line-height: unset;
}
.highlight-balsa b {
  color: #007aff;
}
.hey {
  padding: 50px;
  height: 392px;
  overflow: hidden;
}
.search-divider {
  width: calc(100% + 40px);
  height: 1px;
  margin-left: -20px;
  background-color: #efefef;
  margin-top: 3px;
}
</style>
