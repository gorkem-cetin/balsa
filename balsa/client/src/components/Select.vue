<template>
  <div :class="{'balsa-select':text}">
    <el-select :default-first-option="true" :value="value" @change="triggerEvent" placeholder="Select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  props: {
    options: {
      type: Array,
      required: true,
      default: [],
    },
    text: {
      type: Boolean,
      default: false,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  methods: {
    triggerEvent(event) {
      this.$emit('input', event);
    }
  }
};
</script>

<style lang='scss'>
@import '../assets/sass/color.scss';
.balsa-select .el-input__inner {
  //border: 0;
  //text-align: right;
  background: transparent;

  font-size: 14px;
  //font-weight: 900;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: $--color-primary;
  font-weight: 500;
}
.el-select .el-input .el-select__caret {
  color: $--color-primary;
}
</style>
