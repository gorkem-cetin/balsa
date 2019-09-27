<template>
  <el-row class="font-radio" style="margin-top:10px">
    <el-col v-for="(data,index) in datas" :key="index" :xs="12" class="font-button-radio-margin">
      <div class="balsa-font-box" v-on:click="radio=index.toString()">
        <div>
          <h3>Let’s go!</h3>
          <span class="balsa-font-span">Yes, it’s here.</span>
        </div>
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
      datas: [{ text: 'Avenir' }, { text: 'Arial' }, { text: 'Palatino' }, { text: 'Georgia' }],
    };
  },
};
</script>

<style scoped>
.font-button-radio-margin {
  margin-top: 10px;
}
.font-radio {
  display: flex;
}
@media only screen and (max-width: 600px) {
  .font-radio {
    display: block;
  }
  .font-button-radio-margin {
    margin-top: 14px;
  }
}

.balsa-font-box {
  cursor: pointer;
  background-color: #f9f9f9;
  display: flex;
  border: solid 1px #f1f2f4;
  margin-bottom: 12px;
  border-radius: 4px;
  width: 150px;
  height: 80px;
  justify-content: center;
  align-items: center;
}
.balsa-font-span {
  
  font-size: 14px;
  color: #858d97;
}
</style>
