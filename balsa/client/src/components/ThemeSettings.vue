<template>
  <el-row style="margin-top:39px">
    <!-- <h4 class="balsa-pading-left-5">Theme</h4>
    <ThemeRadio />
    <el-row>
      <el-col :md="20">
        <Divider class="balsa-pading-left-5" style="margin-top:33px;margin-bottom:36px " />
      </el-col>
    </el-row>
    <el-row>
      <h4 class="balsa-pading-left-5">Font</h4>
      <FontRadio />
    </el-row>
    <el-row>
      <el-col :md="20">
        <Divider class="balsa-pading-left-5" style="margin-top:33px;margin-bottom:36px " />
      </el-col>
    </el-row>-->
    <h4 class="balsa-pading-left-5">Language</h4>
    <Select :options="options" style="margin-top:10px" />
  </el-row>
</template>

<script>
import ThemeRadio from './ThemeRadio.vue';
import FontRadio from './FontRadio.vue';
import Divider from './Divider.vue';
import Select from './Select.vue';
export default {
  components: { ThemeRadio, Divider, FontRadio, Select },
  data() {
    return {
      options: [
        {
          value: 'eng',
          label: 'English',
        },
        {
          value: 'tr',
          label: 'Turkish',
        },
      ],
    };
  },
};
</script>

<style>
</style>
