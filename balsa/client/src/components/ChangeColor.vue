<template>
  <el-row>
    <el-row>
      <el-col
        v-for="(data,index) in datas"
        :key="index"
        :xs="3"
        :md="6"
        class="theme-button-radio-margin"
      >
        <div
          class="balsa-theme-box"
          :class="{'is-active':index===(radio ==='-1' ?(datas.indexOf(file.color)):parseInt(radio))}"
          v-on:click="changeSelected(index)"
        >
          <el-col :style="{'background-color':data,'border-radius':'50%'}"></el-col>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin-top:12px;">
      <el-col :span="8">
        <el-button size="mini" type="text" @click="()=>onchangeColorHandler('Cancel')">Cancel</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="()=>onchangeColorHandler('Confirm')">Confirm</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    triggerPreviewColor: {
      type: Function,
    },
    changeColorHandler: {
      type: Function,
    },
    file: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      radio: '-1',
      datas: ['#ffedc0', '#4bc961', '#fa7047', '#4b87c9', '#ffbab7', '#c9bd4b', '#e9f2f8', '#304057'],
    };
  },

  methods: {
    changeSelected(index) {
      this.radio = index.toString();
      this.triggerPreviewColor(this.datas[index], this.file);
    },
    onchangeColorHandler(e) {
      this.changeColorHandler(e, this.datas[parseInt(this.radio)], this.file);
    },
  },
};
</script>

<style scoped>
.balsa-theme-box {
  cursor: pointer;
  display: flex;
  margin-bottom: 12px;
  width: 24px;
  height: 24px;
}
.balsa-theme-box .el-col:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
  transition: all 0.2s;
}
.is-active .el-col {
  border: 2px solid #0881ff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}
</style>