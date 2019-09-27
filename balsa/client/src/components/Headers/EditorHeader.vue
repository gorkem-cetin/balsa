<template>
  <el-header>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item>
        <el-button type="text" @click="$router.push({name:'home'})">
          <i class="el-icon-arrow-left" />
        </el-button>
      </el-menu-item>
      <div class="status">
        <div style="display: flex" v-if="!!File">
          <span @click="handleEdit()" v-if="!edit">{{File.name||"Untitled File"}}</span>
          <el-input
            id="qwfDD"
            ref="nameRef"
            v-if="edit"
            v-model="File.name"
            @blur="handleBlur()"
            size="mini"
          />
          <Stars :file="File" style="margin-left:5px" />
        </div>

        <span class="medium-text" v-if="$store.getters.isSaving">Saving...</span>
        <span class="medium-text" v-else>Saved</span>
      </div>

      <div class="flex-grow" />
      <el-menu-item v-if="!this.$apollo.queries.File.loading" class="hidden-sm-and-down">
        <AvatarContainer
          :avatars="File.nonMeContributors"
          :addAvatar="!this.$apollo.queries.File.loading && File.hasWritePermission"
          :startIndex="-10"
          style="height:100%;flex-direction:row"
        />
      </el-menu-item>
      <el-menu-item style="padding-left:0">
        <PopoverImage>
          <template v-slot:image>
            <img src="../../assets/3dot.svg" alt="balsa" />
          </template>
          <template slot-scope="props" slot="menu">
            <EditorMenu :parent-props="props" />
          </template>
        </PopoverImage>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import AvatarContainer from '../AvatarContainer.vue';
import PopoverImage from '../PopoverImage.vue';
import EditorMenu from '../Menu/Editor/EditorMenu.vue';
import Stars from '../Stars/Stars';
import gql from 'graphql-tag';

export default {
  components: { AvatarContainer, PopoverImage, EditorMenu, Stars },
  methods: {
    setInputSelection(el, startOffset, endOffset) {
      if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
        el.selectionStart = startOffset;
        el.selectionEnd = endOffset;
      } else {
        var range = el.createTextRange();
        var startCharMove = offsetToRangeCharacterMove(el, startOffset);
        range.collapse(true);
        if (startOffset == endOffset) {
          range.move('character', startCharMove);
        } else {
          range.moveEnd('character', offsetToRangeCharacterMove(el, endOffset));
          range.moveStart('character', startCharMove);
        }
        range.select();
      }
    },
    setCaretPosition(elem, caretPos) {
      if (elem != null) {
        if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.move('character', caretPos);
          range.select();
        } else {
          if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(caretPos, caretPos);
          } else elem.focus();
        }
      }
    },
    handleEdit() {
      if (!this.$apollo.queries.File.loading && !File.hasWritePermission) {
        return;
      }
      this.edit = true;
      this.bindInput = false;
      this.$nextTick(() => this.$refs.nameRef.focus());
    },
    handleBlur() {
      this.$apollo.mutate({
        mutation: gql`
          mutation($id: Int!, $name: String!) {
            updateFile(id: $id, name: $name) {
              id
              name
              updatedAt
            }
          }
        `,
        variables: {
          id: parseInt(this.$route.params.id),
          name: this.File.name,
        },
      });
      this.edit = false;
    },
  },
  data: function() {
    return {
      bindInput: false,
      edit: false,
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
    };
  },
  apollo: {
    File: {
      query: gql`
        query File($id: Int!) {
          File(id: $id) {
            id
            name
            isStarred
            hasWritePermission
            user {
              id
              firstName
              lastName
              profilePhoto
            }
            contributors {
              user {
                id
                firstName
                lastName
                profilePhoto
              }
            }
            nonMeContributors {
              id
              firstName
              lastName
              profilePhoto
            }
          }
        }
      `,
      variables() {
        return {
          id: parseInt(this.$route.params.id),
        };
      },
      // Error handling
      error(error) {
        console.error("We've got an error!", error.graphQLErrors[0].message);
      },
    },
  },
  updated: function() {
    this.$nextTick(function() {
      if (!this.bindInput) {
        var el = document.getElementById('qwfDD');
        if (el) {
          this.bindInput = true;
          el.addEventListener('keydown', e => {
            if (e.keyCode === 32) {
              let arr = this.File.name.split('');
              arr.splice(e.target.selectionStart, 0, ' ');
              this.File.name = arr.join('');
              var start = el.selectionStart;
              setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + 1;
              }, 10);
            }
          });
        }
      }
    });
  },
};
</script>

<style scoped>
.dots {
  display: block;
}
.flex-grow {
  flex-grow: 1;
}
.medium-text {
  font-size: 13px;
  color: #a5a6bd;
}
span {
  line-height: normal;
}
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-menu-demo {
  display: flex;
}
.el-header {
  z-index: 999;
  position: fixed;
  width: 100%;
  padding: 0;
}
</style>

