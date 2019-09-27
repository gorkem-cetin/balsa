<template>
  <el-row type="flex" align="middle">
    <el-popover
      placement="bottom"
      width="200"
      trigger="manual"
      style="line-height:1;height:15px;"
      v-model="open"
    >
      <el-menu
        class="el-menu-demo"
        style="border-right:0"
        placement="bottom"
        mode="vertical"
        @open="true"
      >
        <el-menu-item index="READ_WRITE" @click="handleAction('READ_WRITE')">Read / Write</el-menu-item>
        <el-menu-item index="READ_ONLY" @click="handleAction('READ_ONLY')">Read Only</el-menu-item>
      </el-menu>
      <i slot="reference" class="el-icon-edit cursor-pointer" @click="open = !open"></i>
    </el-popover>
  </el-row>
</template>

<script>
import Icon from '../../Icon';
import Avatar from '../../Avatar.vue';
import Dialog from '../../Dialog.vue';
import PopoverImage from '../../PopoverImage.vue';
import TeamSettingsMenu from '../../Menu/Home/HomeMenu.vue';
import HomeMenu from '../../Menu/Home/HomeMenu.vue';
import FilePermissionDialog from '../../Dialogs/FilePermissionDialog';
import RemoveFileDialog from '../../Dialogs/RemoveFileDialog';
import CascaderDialog from '../../Dialogs/DuplicateFileDialog';

export default {
  components: {
    RemoveFileDialog,
    FilePermissionDialog,
    CascaderDialog,
    PopoverImage,
    Avatar,
    Icon,
    Dialog,
    HomeMenu,
  },
  props: {
    file: {
      type: Object,
    },
  },
  data: function() {
    return {
      open: false,
      is_mobile: false,
      filePermissionDialogVisible: false,
      cascaderPermissionDialogVisible: false,
      removeFileDialogVisible: false,
      userid: localStorage.getItem('USERID'),
    };
  },
  created: function() {
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var Android = /(Android)/g.test(navigator.userAgent);
    if (iOS == true) {
      this.is_mobile = true;
    } else if (Android == true) {
      this.is_mobile = true;
    }
  },
  methods: {
    handleAction(selected) {
      this.open = !this.open;
      this.$emit('handler', selected);
    },
  },
};
</script>

<style scoped>
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
