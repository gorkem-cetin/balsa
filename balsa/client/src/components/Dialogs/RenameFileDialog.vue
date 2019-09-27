<template>
  <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
    <template v-slot:header>
      <span class="font-heavy font-size-28">Rename Document</span>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding: 30px 25px;padding-top:0">
        <el-form
          :model="form"
          label-position="top"
          @submit.native.prevent="dialogActionChange('confirm')"
        >
          <el-form-item label="Name" style="margin-bottom:8px">
            <el-input placeholder="Please input" v-model="form.input"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import Dialog from '../Dialog.vue';
import gql from 'graphql-tag';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  name: 'RenameFileDialog',
  mixins: [NotificationMixin],
  components: {
    Dialog,
  },
  props: {
    file: {
      type: Object,
    },
    dialogVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        input: this.file.name,
      },
    };
  },
  methods: {
    dialogActionChange(event) {
      if (event === 'confirm') {
        this.renameFile();
      } else {
        // close geliyor ancak handle etmeye gerek yok
      }
      this.$emit('handler');
    },
    renameFile() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateFile($id: Int!, $name: String) {
              updateFile(id: $id, name: $name) {
                id
                name
                updatedAt
              }
            }
          `,
          variables: {
            id: this.file.id,
            name: this.form.input,
          },
          refetchQueries: ['recentFiles', 'myFiles'],
        })
        .then(() => {
          this.notifySuccess(`File has been renamed successfully.`);
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },
  },
};
</script>

<style scoped>
</style>
