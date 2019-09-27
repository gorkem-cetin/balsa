<template>
  <Dialog
    :visible="dialogVisible"
    :dialogActionChange="dialogActionChange"
    dialogSize="el-dialog-balsa small-dialog"
  >
    <template v-slot:header>
      <el-row type="flex" style="flex-direction:column;width:100%">
        <span class="font-heavy font-size-28" style="font-size:24px;">Export Document</span>
        <el-row style="margin-top:0px;">
          <el-col :md="24">
            <span class="medium-font pale" style="font-size:16px;">Select an output type.</span>
          </el-col>
        </el-row>
      </el-row>
    </template>
    <template v-slot:main>
      <el-row class="slot-container-main" style="padding: 30px 25px;padding-top:0;padding-bottom:0">
        <el-form :model="form" label-position="top" class="form-export">
          <span class="form-export-text">Which file format?</span>
          <el-form-item style="margin-bottom:0px">
            <el-radio v-model="form.radio" label="pdf">PDF</el-radio>
          </el-form-item>

          <el-form-item style="margin-bottom:0px">
            <el-radio v-model="form.radio" label="docx">Microsoft Word (.docx)</el-radio>
          </el-form-item>

          <el-form-item style="margin-bottom:8px">
            <el-radio v-model="form.radio" label="md">Markdown (.md)</el-radio>
          </el-form-item>
        </el-form>
      </el-row>
    </template>
  </Dialog>
</template>

<script>
import Avatar from '../Avatar.vue';
import Dialog from '../Dialog.vue';
import _ from 'lodash';
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  name: 'ExportFileDialog',
  mixins: [NotificationMixin],
  components: {
    Avatar,
    Dialog,
  },
  data() {
    return {
      form: {
        radio: 'pdf',
      },
    };
  },
  props: {
    file: {
      type: Object,
    },
    dialogVisible: {
      type: Boolean,
    },
  },
  methods: {
    dialogActionChange(event) {
      this.$emit('handler');
      if (event === 'confirm') {
        if (this.form.radio === 'pdf') {
          this.$emit('export', 'pdf');
        } else if (this.form.radio === 'docx') {
          this.$emit('export', 'docx');
        } else if (this.form.radio === 'md') {
          this.$emit('export', 'md');
        }
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import '../../assets/sass/color.scss';
.form-export {
  border: 1px solid rgb(226, 226, 226);
  padding: 8px 20px 0px 20px;
  position: relative;
}
.form-export-text {
  position: absolute;
  top: -10px;
  background-color: white;
  font-size: 13px;
  left: 14px;
  padding: 0 4px;
}
.hover-primary:hover {
  color: $--color-primary;
}
</style>
