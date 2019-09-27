<template>
  <el-row type="flex" align="middle">
    <Dialog :visible="dialogVisible" :dialogActionChange="dialogActionChange">
      <template v-slot:header>
        <span class="font-heavy font-size-28">Do you really want to remove</span>
        <Avatar style="margin-right:10px;"/>
        <span class="font-heavy font-size-28">Dosya İsmi ?</span>
        <el-row style="margin-top:26px;">
          <el-col :md="22">
            <span
                class="medium-font pale"
            >If a user has docs shared with other users, then those users still will have access to it.</span>
          </el-col>
        </el-row>
      </template>
      <template v-slot:main>
        <el-row class="slot-container-main">
          <el-row type="flex" align="middle">
            <span class="font-medium" style="letter-spacing:-0.17px">
              <Avatar size="smallAvatar" style="margin-right:10px;"/>
              Falan filan has
              <u>ıvır zıvır documents</u>

<!--              <div v-if="person.sharedablePerson.length===0">not shared with anyone.</div>-->
<!--              <div v-else>shared with {{person.sharedablePerson.length}} people</div>-->
            </span>
          </el-row>
          <el-form :model="form" style="margin-top:20px;">
            <el-form-item>
              <el-select
                  @focus="selectFocus"
                  v-model="form.select"
                  placeholder="Please select a zone"
              >
                <el-option
                    label="deneme"
                    value="deneme">

                  <div style="display:flex;align-items:center;">
                    <Avatar size="smallAvatar" style="margin-right:10px;"/>
                    <span>deneme</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
      </template>
    </Dialog>
    <el-col :md="2" class="hidden-sm-and-down">
      <PopoverImage :parent-props="props">
        <template v-slot:image>
          <img src="../assets/3dot.svg" alt="balsa">
        </template>
        <template slot-scope="props" slot="menu">
          <HomeMenu :parent-props="props"></HomeMenu>
        </template>
      </PopoverImage>
    </el-col>
  </el-row>
</template>

<script>
  import Avatar from './Avatar.vue';
  import Dialog from './Dialog.vue';
  import PopoverImage from './PopoverImage.vue';
  import TeamSettingsMenu from './Menu/Home/HomeMenu.vue';
  import HomeMenu from './Menu/Home/HomeMenu.vue';

  export default {
    components: {
      PopoverImage,
      Avatar,
      Dialog,
      HomeMenu,
    },

    data: function () {
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
