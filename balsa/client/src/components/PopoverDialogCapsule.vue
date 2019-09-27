<template>
  <el-row type="flex" align="middle">


  </el-row>
</template>

<script>
import Icon from './Icon';
import Avatar from './Avatar.vue';
import Dialog from './Dialog.vue';
import PopoverImage from './PopoverImage.vue';
import TeamSettingsMenu from './Menu/TeamSettings/TeamSettingsMenu.vue';
export default {
  components: {
    PopoverImage,
    Avatar,
    Dialog,
    Icon,
    TeamSettingsMenu,
  },
  props: {
    user: {
      type: Object,
      default: {},
    },
  },
  data: function() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        region: '',
        select: '',
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
    selectFocus() {
      this.form.region = '1';
    },
    dialogActionChange() {
      this.dialogVisible = !this.dialogVisible;
    },
  },
};
</script>

<style scoped>
.margin-left-5 {
  margin-left: 5px;
}
.label-radio-balsa {
  display: flex;
  align-items: center;
}
@media only screen and (max-width: 600px) {
  .label-radio-balsa {
    display: flex;
    align-items: unset;
  }
  .mobile-padding-0 .input {
    padding: 0;
  }
  .wrap-balsa {
    display: flex;
    flex-wrap: wrap;
  }
}
.center-icon {
  display: flex;
  align-items: center;
}

.slot-container-main {
  padding: 0 25px;
}
.font-size-28 {
  font-size: 28px;
}

.divider-margin {
  margin: 5px 0;
}
.balsa-divider {
  padding: 10px;
}
.el-menu-demo {
  flex-direction: column;
}
.el-menu-item {
  font-size: 15px;

  font-weight: 500;
  height: 33px;
  line-height: 33px;
}
</style>
