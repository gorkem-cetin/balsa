<template>
  <el-row>
    <AddToFolderDialog
      :dialogVisible="$store.getters.isMoveDialogOpen"
      @handler="$store.dispatch('toggleMoveDialog')"
      :file="File"
      v-if="!this.$apollo.queries.File.loading && $store.getters.isMoveDialogOpen"
    />
    <ExportFileDialog
      :dialogVisible="$store.getters.isExportFileDialogOpen"
      @handler="$store.dispatch('toggleExportFileDialog')"
      @export="exportHandler"
      :file="File"
      v-if="!this.$apollo.queries.File.loading && $store.getters.isExportFileDialogOpen"
    />
    <FilePermissionDialog
      :dialogVisible="$store.getters.isFilePermissionDialogOpen"
      @handler="$store.dispatch('toggleFilePermissionDialog')"
      :file="File"
      v-if="!this.$apollo.queries.File.loading && $store.getters.isFilePermissionDialogOpen"
    />
    <RemoveFileDialog
      :dialogVisible="$store.getters.isRemoveFileDialogOpen"
      @handler="$store.dispatch('toggleRemoveFileDialog')"
      :file="File"
      v-if="!this.$apollo.queries.File.loading && $store.getters.isRemoveFileDialogOpen"
    />
    <div class="editor balsa-container" style="margin-bottom:2%;position:relative;">
      <el-row type="flex" justify="center" style="position:relative;min-height:60px">
        <editor-menu-bar
          :editor="editor"
          v-slot="{ commands, isActive }"
          v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"
        >
          <div class="menubar" :class="{'menubar-positionFixed':positionFixed}">
            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <icon name="bold" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <icon name="italic" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <icon name="strike" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              <icon name="underline" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.code() }"
              @click="commands.code"
            >
              <icon name="code" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.paragraph() }"
              @click="commands.paragraph"
            >
              <icon name="paragraph" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              @click="commands.heading({ level: 1 })"
            >H1</button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >H2</button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >H3</button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <icon name="ul" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <icon name="ol" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <icon name="quote" />
            </button>

            <button
              :class="{ 'is-active': showConversation }"
              class="menubar__button"
              @click="commands.openConversationBox"
            >
              <icon name="annotation" />
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.code_block() }"
              @click="commands.code_block"
            >
              <icon name="code" />
            </button>

            <button class="menubar__button" @click="commands.horizontal_rule">
              <icon name="hr" />
            </button>

            <button class="menubar__button" @click="commands.undo">
              <icon name="undo" />
            </button>

            <button class="menubar__button" @click="commands.redo">
              <icon name="redo" />
            </button>
            <button
              class="menubar__button"
              @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
            >
              <icon name="table" />
            </button>

            <span v-if="isActive.table()">
              <button class="menubar__button" @click="commands.deleteTable">
                <icon name="delete_table" />
              </button>
              <button class="menubar__button" @click="commands.addColumnBefore">
                <icon name="add_col_before" />
              </button>
              <button class="menubar__button" @click="commands.addColumnAfter">
                <icon name="add_col_after" />
              </button>
              <button class="menubar__button" @click="commands.deleteColumn">
                <icon name="delete_col" />
              </button>
              <button class="menubar__button" @click="commands.addRowBefore">
                <icon name="add_row_before" />
              </button>
              <button class="menubar__button" @click="commands.addRowAfter">
                <icon name="add_row_after" />
              </button>
              <button class="menubar__button" @click="commands.deleteRow">
                <icon name="delete_row" />
              </button>
              <button class="menubar__button" @click="commands.toggleCellMerge">
                <icon name="combine_cells" />
              </button>
            </span>
            <button class="menubar__button" @click="showImagePrompt(commands.image)">
              <icon name="image" />
            </button>
            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.todo_list() }"
              @click="commands.todo_list"
            >
              <icon name="checklist" />
            </button>
          </div>
        </editor-menu-bar>
      </el-row>

      <editor-menu-bubble
        :editor="editor"
        :keep-in-bounds="keepInBounds"
        v-slot="{ commands, isActive, getMarkAttrs, menu }"
        v-if="!this.$apollo.queries.File.loading && File.hasWritePermission"
      >
        <div
          class="menububble"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
        >
          <form
            class="menububble__form"
            v-if="linkMenuIsActive"
            @submit.prevent="setLinkUrl(commands.link, linkUrl)"
          >
            <input
              class="menububble__input"
              type="text"
              v-model="linkUrl"
              placeholder="https://"
              ref="linkInput"
              @keydown.esc="hideLinkMenu"
            />
            <button
              class="menububble__button"
              @click="setLinkUrl(commands.link, null)"
              type="button"
            >
              <icon name="remove" />
            </button>
          </form>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <icon name="bold" />
          </button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <icon name="strike" />
          </button>
          <template>
            <button
              class="menububble__button"
              @click="showLinkMenu(getMarkAttrs('link'))"
              :class="{ 'is-active': isActive.link() }"
            >
              <span>{{ isActive.link() ? 'Update Link' : ''}}</span>
              <icon name="link" />
            </button>
          </template>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >H1</button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >H2</button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <icon name="ul" />
          </button>
          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <icon name="italic" />
          </button>

          <button
            class="menububble__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <icon name="code" />
          </button>
        </div>
      </editor-menu-bubble>

      <div
        v-if="!this.$apollo.queries.conversation.loading && conversation"
        :class="{'closed': !showConversation}"
        class="comment-balsa"
      >
        <div v-for="(comment,index) in conversation.comments" :key="{index}">
          <el-row type="flex" justify="space-between">
            <el-row type="flex" align="middle">
              <Avatar
                :src="comment.user.profilePhoto"
                :firstName="comment.user.firstName"
                :lastName="comment.user.lastName"
              />
              <el-row style="margin-left:12px;  ">
                <span class="semi-medium-font medium-font-weight">
                  <span
                    class="semi-medium-font actorName"
                  >{{ comment.user.firstName }} {{ comment.user.lastName }}</span>
                </span>
                <el-row type="flex" align="middle">
                  <i class="el-icon-time" style="color: rgb(112, 129, 148);" />
                  <span
                    class="semi-medium-font"
                    style="color: rgb(112, 129, 148);font-size:11px;margin-left:4px;"
                  >{{convertDate(comment.createdAt)}}</span>
                </el-row>
              </el-row>
            </el-row>
            <el-row type="flex">
              <i
                class="el-icon-more cursor-pointer"
                style="font-size: 18px;color: rgb(112, 129, 148);    margin-top: 2px;"
              />
            </el-row>
          </el-row>
          <el-row style="margin-top:16px;">
            <p
              style="line-height:1.5;font-weight:500;"
              class="semi-medium-font actorName"
            >{{ comment.text }}</p>
          </el-row>
          <el-row style="margin:16px 0">
            <Divider />
          </el-row>
        </div>

        <div v-if="conversation && conversation.comments.length ===0">
          <el-row type="flex" align="middle">
            <Avatar
              :src="myProfile.profilePhoto"
              :firstName="myProfile.firstName"
              :lastName="myProfile.lastName"
            />
            <el-row style="margin-left:12px;  ">
              <span class="semi-medium-font medium-font-weight">
                <span
                  class="semi-medium-font actorName"
                >{{ myProfile.firstName }} {{ myProfile.lastName }}</span>
              </span>
            </el-row>
          </el-row>
          <el-row style="margin:16px 0">
            <Divider />
          </el-row>
        </div>
        <el-form @submit.native.prevent="createComment()">
          <el-row type="flex">
            <el-input
              placeholder="Reply..."
              v-model="inputComment"
              size="small"
              style="font-size:11px;"
            />
            <el-button
              type="primary"
              size="mini"
              style="margin-left:8px;"
              native-type="submit"
            >Comment</el-button>
          </el-row>
        </el-form>
      </div>

      <editor-content class="editor__content" id="balsa-editor" :editor="editor"></editor-content>
    </div>
    <el-row
      type="flex"
      justify="space-between"
      class="balsa-editor-search"
      :class="search ?'show-search':'hide-search'"
    >
      <el-row type="flex" justify="center" style="width:20px;" class="expanse-search">
        <div
          style="height:53px;display:flex;justify-content:center;align-items:center;"
          class="cursor-pointer"
          @click="iconDown=!iconDown"
        >
          <i
            class="el-icon-caret-right"
            :class="iconDown ?'make-icon-down':'' "
            style="transition: all 0.2s;"
          />
        </div>
      </el-row>
      <div class="search" style="display:flex;flex-direction:column;  padding: 10px 0;">
        <div style="display:flex;align-items:center">
          <input
            ref="search"
            class="ctrl__f-search"
            @keydown.enter.prevent="editor.commands.find(searchTerm)"
            placeholder="Search …"
            style="width:252px;"
            type="text"
            v-model="searchTerm"
          />
          <el-button
            type="primary"
            plain
            @click="editor.commands.find(searchTerm)"
            size="small"
          >Find</el-button>
          <i
            class="el-icon-close balsa-editor-search-close-icon cursor-pointer"
            @click="search=false;editor.commands.clearSearch();iconDown=false;"
          />
        </div>
        <div
          style="display:flex;margin-top:12px; padding-right:15px;  "
          :style="!iconDown ? 'display:none':''"
        >
          <input
            @keydown.enter.prevent="editor.commands.replace(replaceWith)"
            class="ctrl__f-replace"
            placeholder="Replace …"
            type="text"
            v-model="replaceWith"
          />
          <el-button size="mini" type="primary" plain>Replace</el-button>
          <el-button size="mini" type="primary" plain>Replace All</el-button>
        </div>
      </div>
    </el-row>
    <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectUser(user)"
        >{{ user.name }}</div>
      </template>
      <div v-else class="suggestion-list__item is-empty">No users found</div>
    </div>
  </el-row>
</template>

<script>
import moment from 'moment';
import Divider from './Divider.vue';
import Fuse from 'fuse.js';
import tippy from 'tippy.js';
import Icon from './Icon';
import { Editor, EditorContent, EditorMenuBubble, EditorMenuBar } from 'tiptap';
import AddToFolderDialog from './Dialogs/AddToFolderDialog';
import ExportFileDialog from './Dialogs/ExportFileDialog';
import FilePermissionDialog from './Dialogs/FilePermissionDialog';
import RemoveFileDialog from './Dialogs/RemoveFileDialog';
import Avatar from './Avatar.vue';
import has from 'lodash/has';
import Doc from './Editor/Components/Doc';
import _ from 'lodash';
import Title from './Editor/Components/Title';
import Iframe from './Editor/Components/Iframe';
import Comment from './Editor/Nodes/Comment';
import Image from './Editor/Nodes/Image';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Placeholder,
  TrailingNode,
  Mention,
  Search,
  CodeBlockHighlight,
} from 'tiptap-extensions';

import { gql } from 'apollo-server-core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TurnDown from 'turndown';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import { CONVERSATION_QUERY, MYPROFILE_QUERY } from '../queries';

export default {
  components: {
    Avatar,
    Divider,
    EditorContent,
    EditorMenuBubble,
    AddToFolderDialog,
    EditorMenuBar,
    ExportFileDialog,
    FilePermissionDialog,
    Icon,
    RemoveFileDialog,
  },
  data() {
    return {
      inputComment: '',
      selectedConversationId: null,
      showConversation: false,
      firstTime: false,
      highlighted: false,
      iconDown: false,
      search: false,
      replaceWith: null,
      searchTerm: null,
      positionFixed: false,
      linkUrl: null,
      linkMenuIsActive: false,
      keepInBounds: true,
      firstTransactionPassed: false,
      placeholderH1: '',
      placeholderP: '',
      htmlData: '',
      editor: new Editor({
        editable: this.$route.name !== 'readOnlyEditor',
        extensions: [
          // new Comment(this.createComment, [{ from: 38, to: 53, text: 'a' }]),
          new Comment({
            showConversationBox: this.showConversationBox,
            hideConversationBox: this.hideConversationBox,
            createConversation: this.createConversation,
          }),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
            },
          }),
          new Doc(),
          new Iframe(),
          new Title(),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Image({
            uploadImage: this.uploadImage,
          }),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem({
            nested: true,
          }),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph'],
          }),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: node => {
              if (node.type.name === 'title') {
                return this.placeholderH1;
              }
              return this.placeholderP;
            },
          }),
          new Table({
            resizable: true,
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Search({
            disableRegex: false,
          }),
          new Mention({
            // a list of all suggested items
            items: () => [
              ...this.File.contributors.map(c => ({
                id: c.user.id,
                name: [c.user.firstName, c.user.lastName].join(' '),
              })),
              {
                id: this.File.user.id,
                name: [this.File.user.firstName, this.File.user.lastName].join(' '),
              },
            ],
            // is called when a suggestion starts
            onEnter: ({ items, query, range, command, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.renderPopup(virtualNode);
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command;
            },
            // is called when a suggestion has changed
            onChange: ({ items, query, range, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.navigatedUserIndex = 0;
              this.renderPopup(virtualNode);
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null;
              this.filteredUsers = [];
              this.suggestionRange = null;
              this.navigatedUserIndex = 0;
              this.destroyPopup();
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler();
                return true;
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler();
                return true;
              }
              // pressing enter
              if (event.keyCode === 13) {
                this.enterHandler();
                return true;
              }
              return false;
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if (!query) {
                return items;
              }
              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ['name'],
              });
              return fuse.search(query);
            },
          }),
        ],
        autoFocus: 'end',
        content: '',
        onUpdate: ({ getJSON, getHTML, state, ...rest }) => {
          this.saveContent(getJSON(), getHTML(), state.selection.anchor);
          this.htmlData = getHTML();
        },
        onTransaction: ({ state, transaction }) => {
          // Skip the first transaction to avoid overwriting cursor position
          // Don't update if the cursorPosition is correct already.
          // Don't update if the file also changed
          if (
            this.firstTransactionPassed &&
            !transaction.docChanged &&
            state.selection.anchor !== this.File.cursorPosition
          ) {
            this.updateFile({ cursorPosition: state.selection.anchor });
          }
          this.firstTransactionPassed = true;
        },
        onInit: ({ transaction }) => {},
      }),
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {},
      observer: null,
    };
  },

  computed: {
    hasResults() {
      return this.filteredUsers.length;
    },
    showSuggestions() {
      return this.query || this.hasResults;
    },
  },
  apollo: {
    File: {
      query: gql`
        query File($id: Int!, $inviteCode: String, $publicViewCode: String, $log: Boolean) {
          File(id: $id, inviteCode: $inviteCode, publicViewCode: $publicViewCode, log: $log) {
            id
            name
            content
            cursorPosition
            isStarred
            hasWritePermission
            user {
              id
              firstName
              lastName
            }
            contributors {
              user {
                id
                firstName
                lastName
              }
            }
            comments {
              id
              from
              to
              text
            }
          }
        }
      `,
      variables() {
        return {
          id: parseInt(this.$route.params.id),
          inviteCode: this.$route.params.inviteCode,
          publicViewCode: this.$route.params.publicViewCode,
          log: true,
        };
      },
      // Error handling
      error(error) {
        console.error("We've got an error!", error.graphQLErrors[0].message);
      },
      result({ data }) {
        // assumes that value is the JSON value, keeps the cursor at the same position
        if (!data.File.hasWritePermission) {
          this.editor.setOptions({ editable: false });
        }
        if (data.File.content && JSON.stringify(this.editor.getJSON()) !== data.File.content) {
          // a change as happened, update the content, cursor is at the start of the editor,
          // however, that is no big deal, assume it's a different content anyways.
          if (!this.firstTime) {
            this.editor.setContent(JSON.parse(data.File.content));
            this.firstTime = true;
            if (data.File.cursorPosition) {
              const state = this.editor.state;
              const tr = state.tr.setSelection(
                state.selection.constructor.near(state.tr.doc.resolve(data.File.cursorPosition)),
              );

              this.editor.view.dispatch(tr.scrollIntoView());
            }
          }
          // if (data.File.cursorPosition) {
          //   const state = this.editor.state;
          //   const tr = state.tr.setSelection(
          //     state.selection.constructor.near(state.tr.doc.resolve(data.File.cursorPosition)),
          //   );
          //   //this.editor.view.dispatch(tr.scrollIntoView());
          // }
        }
        if (
          data.File.content === '' ||
          data.File.content === `{"type":"doc","content":[{"type":"title"},{"type":"paragraph"}]}`
        ) {
          const state = this.editor.state;
          const tr = state.tr.setSelection(
            state.selection.constructor.near(state.tr.doc.resolve(data.File.cursorPosition)),
          );
          this.editor.view.dispatch(tr.scrollIntoView());
        }
      },
    },
    contributor: {
      query: gql`
        query contributor($inviteCode: String) {
          contributor(inviteCode: $inviteCode) {
            id
            permissionLevel
            email
            isAnon
            user {
              id
              email
            }
          }
        }
      `,
      skip() {
        return !this.$route.params.inviteCode;
      },
      variables() {
        return {
          inviteCode: this.$route.params.inviteCode,
        };
      },
      result({ data }) {
        if (data.contributor.permissionLevel !== 'READ_WRITE') {
          this.editor.setOptions({
            editable: false,
          });
        }
      },
    },
    conversation: {
      query: CONVERSATION_QUERY,
      skip() {
        return !this.showConversation && !this.selectedConversationId;
      },
      variables() {
        return {
          uuid: this.selectedConversationId,
        };
      },
    },
    myProfile: {
      query: MYPROFILE_QUERY,
    },
  },
  created() {
    window.addEventListener('keydown', e => {
      if ((e.which == '115' || e.which == '83' || e.which == '70') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.search = true;
        return false;
      }
    });
    window.addEventListener('scroll', this.handleScroll);
    let randText = this.randomPlaceHolder();
    this.placeholderH1 = randText.h1;
    this.placeholderP = randText.p;
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    convertDate(createdAt) {
      return moment(parseInt(createdAt)).fromNow();
    },
    uploadImage(file) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation($file: Upload) {
            uploadFile(file: $file) {
              id
              file
            }
          }
        `,
        variables: {
          file,
        },
      });
    },
    createConversation(_id) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($fileId: Int!, $uuid: String!) {
            createConversation(fileId: $fileId, uuid: $uuid) {
              id
              uuid
            }
          }
        `,
        variables: {
          fileId: this.File.id,
          uuid: _id,
        },
      });
    },
    showConversationBox(_id) {
      this.selectedConversationId = _id;
      this.showConversation = true;
    },
    hideConversationBox(_id) {
      this.inputComment = '';
      if (this.showConversation && this.selectedConversationId) {
        if (this.conversation.comments.length === 0) {
          /* this.$apollo
              .mutate({
                mutation: gql`
                    mutation($fileId: Int!, $uuid: String!) {
                      deleteConversation(fileId: $fileId, uuid: $uuid) {
                        id
                        uuid
                      }
                  }
                `,
                variables: {
                  fileId: this.File.id,
                  uuid: _id
                },
              }).then(({data}) => {
              this.showConversation = false;
              this.selectedConversationId = null;
            })*/
          this.showConversation = false;
          this.selectedConversationId = null;
        } else {
          this.showConversation = false;
          this.selectedConversationId = null;
        }
      } else {
        this.showConversation = false;
        this.selectedConversationId = null;
      }
    },
    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler() {
      this.navigatedUserIndex = (this.navigatedUserIndex + this.filteredUsers.length - 1) % this.filteredUsers.length;
    },
    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.navigatedUserIndex = (this.navigatedUserIndex + 1) % this.filteredUsers.length;
    },
    enterHandler() {
      const user = this.filteredUsers[this.navigatedUserIndex];
      if (user) {
        this.selectUser(user);
      }
    },
    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectUser(user) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: user.id,
          label: user.name,
        },
      });
      this.editor.focus();
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($fileId: Int!, $userId: Int!) {
              mentionUser(fileId: $fileId, userId: $userId)
            }
          `,
          variables: {
            fileId: this.File.id,
            userId: user.id,
          },
        })
        .then(() => {})
        .catch(error => {
          console.log('MENTION ERROR', error);
        });
    },
    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      if (this.popup) {
        return;
      }
      this.popup = tippy(node, {
        content: this.$refs.suggestions,
        trigger: 'mouseenter',
        interactive: true,
        theme: 'dark',
        placement: 'top-start',
        inertia: true,
        duration: [400, 200],
        showOnInit: true,
        arrow: true,
        arrowType: 'round',
      });
      // we have to update tippy whenever the DOM is updated
      if (MutationObserver) {
        this.observer = new MutationObserver(() => {
          this.popup.popperInstance.scheduleUpdate();
        });
        this.observer.observe(this.$refs.suggestions, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    },
    destroyPopup() {
      if (this.popup) {
        this.popup.destroy();
        this.popup = null;
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    },
    handleScroll(event) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= 70) {
        this.positionFixed = true;
      } else {
        this.positionFixed = false;
      }
    },
    showImagePrompt(command) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = e => {
        // getting a hold of the file reference
        var file = e.target.files[0];

        if (file !== null) {
          command({ file });
        }
      };
      input.click();
    },
    updateFile(variables) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation updateFile($id: Int!, $content: String, $contentHtml: String, $cursorPosition: Int) {
            updateFile(id: $id, content: $content, contentHtml: $contentHtml, cursorPosition: $cursorPosition) {
              id
              content
              cursorPosition
              updatedAt
            }
          }
        `,
        variables: {
          id: parseInt(this.$route.params.id),
          ...variables,
          log: true,
        },
        context: {
          debounceKey: '1',
        },
      });
    },
    createComment(variables) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createComment($conversationUuid: String, $fileId: Int, $text: String) {
              createComment(conversationUuid: $conversationUuid, fileId: $fileId, text: $text) {
                id
              }
            }
          `,
          variables: {
            fileId: this.File.id,
            conversationUuid: this.selectedConversationId,
            text: this.inputComment,
          },
          refetchQueries: ['conversation'],
        })
        .then(({ data }) => {
          this.inputComment = '';
        });
    },
    saveContent(content, contentHtml, cursorPosition) {
      /* if (!has(content.content[0], 'content')) {
          this.editor.extensions.options.placeholder.emptyNodeText = this.randomPlaceHolder();
        }*/
      this.$store.dispatch('updateSavingState', true);
      this.updateFile({
        content: JSON.stringify(content),
        contentHtml: contentHtml,
        cursorPosition: cursorPosition,
      }).then(() => this.$store.dispatch('updateSavingState', false));
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
      this.editor.focus();
    },
    randomPlaceHolder() {
      const texts = [
        { h1: 'Better late than never', p: 'Are we partying, yet?' },
        { h1: 'A cat has nine lives', p: 'Everyone knows this.' },
        { h1: 'Actions speak louder than words', p: 'But everything starts with a word or two.' },
        { h1: 'All’s well that ends well', p: 'Focus on what you plan.' },
        { h1: 'Always put your best foot forward', p: 'Go grab it, now.' },
        { h1: 'An apple a day keeps the doctor away', p: 'Take the red one.' },
        { h1: 'A picture is worth a thousand words', p: 'Learn biology with pictures.' },
        { h1: 'A thing begun is half done', p: 'We trust you.' },
        /*'Better late than never', // Are we partying, yet?
          'A cat has nine lives', // Everyone knows this.
          'Actions speak louder than words', // But everything starts with a word or two.
          'All’s well that ends well', // Focus on what you plan.
          'Always put your best foot forward', // Go grab it, now.
          'An apple a day keeps the doctor away', // Take the red one.
          'A picture is worth a thousand words', // Learn biology with pictures.
          'A thing begun is half done', // We trust you.*/
      ];

      return texts[Math.floor(Math.random() * texts.length)];
    },
    exportHandler(type) {
      if (type === 'pdf') {
        this.exportToPdf();
      } else if (type === 'docx') {
        this.exportToDoc();
      } else {
        this.exportToMD();
      }
    },
    exportToPdf() {
      const doc = new jsPDF();
      const canvasElement = document.createElement('canvas');
      const _html = document.getElementsByClassName('ProseMirror')[0];
      _html.innerHTML = this.htmlData;

      html2canvas(_html, { canvas: canvasElement }).then(function(canvas) {
        const img = canvas.toDataURL('image/png');
        doc.addImage(img, 'PNG', 20, 20);
        doc.save('document.pdf');
      });
    },
    exportToDoc() {
      const header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
      const footer = '</body></html>';
      const sourceHTML = header + this.htmlData + footer;

      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement('a');
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'document.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
    },
    exportToMD() {
      const turndownService = TurnDown();
      const markdown = turndownService.turndown(document.getElementsByClassName('ProseMirror')[0]);

      const source = 'data:text/markdown; charset=UTF-8,' + encodeURIComponent(markdown);
      const fileDownload = document.createElement('a');
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'document.md';
      fileDownload.click();
      document.body.removeChild(fileDownload);
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>
<style lang="scss">
@import '../assets/sass/variables.scss';

.el-input--small input {
  font-size: 13px;
}

.comment-balsa {
  opacity: 1;
  transition: all 0.4s;
  position: absolute;
  width: 282px;
  right: -30%;
  background-color: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.closed {
  opacity: 0;
  right: -32%;
  transition: all 0.4s;
}

.comment-bg {
  background-color: yellow;
}

.editor .comment-bg::after {
  position: absolute;
  right: -15px;
  content: url(../assets/images/icons/annotation.svg);
  height: 20px;
  width: 20px;
}

.menubar-positionFixed {
  position: fixed;
  transition: background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding-top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    padding-bottom 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  //box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  border-bottom: 1px solid #efefef;
  padding-bottom: 5px;
  padding-top: 5px;
  background-color: #ffffff;
  z-index: 1;
  width: 100%;
  top: 60px;
}

.editor *.is-empty:nth-child(1)::before {
  padding-left: 3px;
}

.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}

.editor__content {
  background: white;
  border-radius: 4px;
  padding: 0 80px;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.ProseMirror {
  min-height: 125vh;
  padding-top: 75px;
  padding-bottom: 75px;
}

.trying {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: red;
}

.editor__content h1 {
  font-size: 42px;
  color: #293543;
}

.editor__content h2 {
  font-size: 34px;
  color: #293543;
}

.editor__content h3 {
  font-size: 26px;
  color: #293543;
}

.editor__content p {
  font-size: 18px;
  color: #293543;
  letter-spacing: -0.2px;
}

.menubar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
}

ul[data-type='todo_list'] {
  padding-left: 0;
}

li[data-type='todo_item'] {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.todo-checkbox {
  border: 2px solid $color-black;
  height: 0.9em;
  width: 0.9em;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: 0;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: 0.2em;
  background-color: transparent;
  transition: 0.4s background;
}

.todo-content {
  flex: 1;

  > p:last-of-type {
    margin-bottom: 0;
  }

  > ul[data-type='todo_list'] {
    margin: 0.5rem 0;
  }
}

li[data-done='true'] {
  > .todo-content {
    > p {
      text-decoration: line-through;
    }
  }

  > .todo-checkbox {
    background-color: $color-black;
  }
}

li[data-done='false'] {
  text-decoration: none;
}

.balsa-editor-search {
  right: 0;
  position: fixed;
  top: 62px;
  background-color: white;
  padding-right: 12px;
  border-radius: 4px;
  z-index: 1;
  min-height: 48px;
  border: 1px solid #efefef;
  transition: all 0.2s;
}

.balsa-editor-search-close-icon {
  font-size: 16px;

  font-weight: 600;
  color: #5f6368;
}

.balsa-editor-search-close-icon:hover {
  color: #323333;
}

.hide-search {
  top: -10px;
}

.search {
  display: flex;
  flex-wrap: wrap;

  border-radius: 5px;
  input {
    border-radius: 4px;
    padding: 0.25rem;
    border: 1px solid #efefef;
    margin-right: 0.6rem;
    font: inherit;
    font-size: 0.8rem;
    width: 20%;
    flex: 1;
  }
  button {
    margin-right: 0.6rem;
  }
}
.find {
  background: rgba(255, 213, 0, 0.5);
  font-size: inherit;
}
.expanse-search {
  margin-right: 2px;
  width: 24px;
}
.expanse-search:hover {
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transition: all 0.2s;
}
.make-icon-down {
  transform: rotate(90deg);
}
.balsa-container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 960px;
}
.mention {
  background: rgba($color-black, 0.1);
  color: rgba($color-black, 0.6);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}
.mention-suggestion {
  color: rgba($color-black, 0.6);
}
.suggestion-list {
  padding: 0.2rem;
  border: 2px solid rgba($color-black, 0.1);
  font-size: 0.8rem;
  font-weight: bold;
  &__no-results {
    padding: 0.2rem 0.5rem;
  }
  &__item {
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &.is-selected,
    &:hover {
      background-color: rgba($color-white, 0.2);
    }
    &.is-empty {
      opacity: 0.5;
    }
  }
}
.tippy-tooltip.dark-theme {
  background-color: $color-black;
  padding: 0;
  font-size: 1rem;
  text-align: inherit;
  color: $color-white;
  border-radius: 5px;
  .tippy-backdrop {
    display: none;
  }
  .tippy-roundarrow {
    fill: $color-black;
  }
  .tippy-popper[x-placement^='top'] & .tippy-arrow {
    border-top-color: $color-black;
  }
  .tippy-popper[x-placement^='bottom'] & .tippy-arrow {
    border-bottom-color: $color-black;
  }
  .tippy-popper[x-placement^='left'] & .tippy-arrow {
    border-left-color: $color-black;
  }
  .tippy-popper[x-placement^='right'] & .tippy-arrow {
    border-right-color: $color-black;
  }
  .iframe {
    &__embed {
      width: 100%;
      height: 15rem;
      border: 0;
    }
    &__input {
      display: block;
      width: 100%;
      font: inherit;
      border: 0;
      border-radius: 5px;
      background-color: rgba($color-black, 0.1);
      padding: 0.3rem 0.5rem;
    }
  }
}
pre {
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}
.dark .menubar__button {
  color: rgb(172, 174, 175);
}
.dark .menubar__button.is-active {
  background-color: rgb(55, 61, 63);
}
.dark .menubar__button:hover {
  background-color: rgb(55, 61, 63);
}
.dark .balsa-editor-search {
  background-color: #373d3f;
  border: 1px solid #373d3f;
}
.dark .menubar-positionFixed {
  background-color: #303437;
  border-bottom: 1px solid #373d3f;
}
.dark .editor__content {
  background: #373d3f;
}
.dark .editor__content h1 {
  color: rgb(172, 174, 175);
}
.dark .editor__content table td,
.editor__content table th {
  border: 2px solid rgb(172, 174, 175);
}
.dark .ctrl__f-search,
.dark .ctrl__f-replace {
  background-color: rgba(33, 36, 38, 0.45);
  border: rgba(33, 36, 38, 0.45);
  font-weight: 600;
  opacity: 0.9;
  color: rgb(172, 174, 175);
}
.dark .ctrl__f-search::placeholder,
.dark .ctrl__f-replace::placeholder {
  opacity: 0.9;
  color: rgb(172, 174, 175);
}
.editor__content a {
  color: #007aff;
  text-decoration: underline;
}
</style>

