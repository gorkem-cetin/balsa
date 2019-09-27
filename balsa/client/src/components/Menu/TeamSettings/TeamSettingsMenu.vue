<template >
  <el-row type="flex" align="middle">
    <RemoveUserDialog
        :dialogVisible="removeUserDialogVisible"
        @handler="removeUserDialogHandler"
        :user="user"
        :allUsers="allUsers"
    />
    <EditUserDialog
        :dialogVisible="editUserDialogVisible"
        @handler="editUserDialogHandler"
        :user="user"
    />
    <el-col :md="2" class="center-icon">
      <PopoverImage visible :data="user">
        <template v-slot:image>
          <icon name="dots" class="dots-x" style="width:36px;height:24px" />
        </template>
        <template slot-scope="props" slot="menu">
          <el-menu
              class="el-menu-demo"
              style="border-right:0"
              placement="bottom"
              mode="vertical"
              @open="true"
          >
            <el-menu-item
                index="edit-user"
                @click="editUserDialogHandler"
            >Edit user</el-menu-item>
            <el-menu-item index="make-admin">Make admin</el-menu-item>
            <el-menu-item
                v-if="user.id !== userid"
                index="remove-user"
                @click="removeUserDialogHandler"
            >Remove user
            </el-menu-item>
          </el-menu>

        </template>
      </PopoverImage>
    </el-col>
  </el-row>
</template>

<script>
import RemoveUserDialog from "../../Dialogs/RemoveUserDialog"
import EditUserDialog from "../../Dialogs/EditUserDialog"
import PopoverImage from '../../PopoverImage.vue';
import Icon from '../../Icon';

import gql from "graphql-tag";

export default {
  props: {
    user: {
      type: Object
    },
    allUsers: {
      type: Array
    }
  },
  data() {
    return {
      removeUserDialogVisible: false,
      editUserDialogVisible: false,
      userid: parseInt(localStorage.getItem('USERID'))
    }
  },
  components: {
    RemoveUserDialog,
    EditUserDialog,
    PopoverImage,
    Icon
  },
  methods: {
    //action is an index prop. edit,share,invite...
    removeUserDialogHandler(e) {
      this.removeUserDialogVisible = !this.removeUserDialogVisible;
    },
    editUserDialogHandler(e) {
      this.editUserDialogVisible = !this.editUserDialogVisible;
    },
  },
};
</script>

<style scoped >
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
