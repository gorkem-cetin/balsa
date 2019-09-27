<template>
  <el-row class="theme-radio">
    <el-col v-for="(data,index) in datas" :key="index" :xs="8" class="theme-button-radio-margin">
      <div class="balsa-theme-box" v-on:click="radio=index.toString()">
        <el-col
          v-for="color in data.colors"
          :key="color"
          :style="{'background-color':color,'border-radius':' 0px'}"
        ></el-col>
      </div>
      <el-radio v-model="radio" :label="index.toString()">{{data.text}}</el-radio>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      radio: '0',
      datas: [
        { text: 'Honeydew', colors: ['#ffedc0', '#d2d6db', '#e9f2f8'] },
        { text: 'Lime', colors: ['#4bc961', '#40794a', '#c9bd4b'] },
        { text: 'Ice Cream', colors: ['#d7c0ad', '#fa7047', '#ffbab7'] },
        { text: 'Dark', colors: ['#3d3d3d', '#000000', '#acacac'] },
        { text: 'Midnight Blue', colors: ['#4b87c9', '#4a5564', '#304057'] },
      ],
    };
  },
};
</script>

<style scoped>
.theme-button-radio-margin {
  margin-top: 10px;
}
.theme-radio {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .theme-radio {
    display: block;
  }
  .theme-button-radio-margin {
    margin-top: 14px;
  }
}

.balsa-theme-box {
  cursor: pointer;
  display: flex;
  margin-bottom: 12px;
  border-radius: 4px;
  width: 80px;
  height: 80px;
}
</style>
