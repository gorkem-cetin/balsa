<template>
  <div>
    <el-dialog :visible.sync="visible" :custom-class="dialogSize" :before-close="handleClose">
      <el-row slot="title" class="slot-container-header slot-header" style="width:100%">
        <slot name="header"></slot>
      </el-row>

      <slot name="main"></slot>

      <span slot="footer" class="dialog-footer" style="    padding: 0px 25px;">
        <el-button
          type="text"
          @click="dialogActionChange('close')"
          style="color:#9ca2aa;margin-right:20px;"
        >
          <span class="small-span">Cancel</span>
        </el-button>
        <el-button type="success" @click="dialogActionChange('confirm')">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Avatar from './Avatar.vue';
export default {
  components: { Avatar },
  props: {
    dialogSize: {
      type: String,
      default: 'el-dialog-balsa',
    },
    smallDialog: {
      type: Boolean,
      default: false,
    },
    dialogActionChange: {
      type: Function,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      formLabelWidth: '120px',
    };
  },
  methods: {
    handleClose() {
      this.dialogActionChange('close');
    },
  },
};
</script>

<style scoped>
.slot-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.slot-container-header {
  padding: 30px 25px;
}
.slot-container-main {
  padding: 0 25px;
}
</style>
