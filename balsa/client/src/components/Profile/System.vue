<template>
  <ProfileContainer>
    <el-row>
      <el-col :xs="24" class="mobile-max-width">
        <el-row>
          <h1>System</h1>
          <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:28px;">
            <el-tab-pane label="Server log" name="first">
              <ServerLog />
            </el-tab-pane>
            <!-- <el-tab-pane label="Activity log" name="second">
              <el-row type="flex" justify="end" class="margin-top-53">
                <PopoverImage visible>
                  <template v-slot:image>
                    <icon name="dots" class="dots-x" style="width:36px;height:24px;" />
                  </template>
                  <template slot-scope="props" slot="menu">
                    <SystemMenu :parent-props="props" />
                  </template>
                </PopoverImage>
              </el-row>
              <el-row class="system-capsule balsa-medium balsa-opacity">
                <el-col :span="24" :xs="22" class="desktop-padding-left-28">
                  <el-row class="info-tab">{{logs}}</el-row>
                </el-col>
              </el-row>
            </el-tab-pane>-->
            <el-tab-pane label="System health" name="third">
              <SystemHealth />
            </el-tab-pane>
            <el-tab-pane label="Plugins" name="fourth">
              <Plugins />
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>
  </ProfileContainer>
</template>

<script>
import Plugins from './Components/System/Plugins.vue';
import SystemHealth from './Components/System/SystemHealth.vue';
import ServerLog from './Components/System/ServerLog.vue';
//import Icon from '../Icon';
//import PopoverImage from '../PopoverImage.vue';
//import Divider from '../Divider.vue';
import ProfileContainer from './ProfileContainer.vue';
//import SystemMenu from '../Menu/System/SystemMenu.vue';
export default {
  components: {
    //Divider,
    //Icon,
    ServerLog,
    Plugins,
    ProfileContainer,
    //PopoverImage,
    //SystemMenu,
    SystemHealth,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick(tab, event) {
    },
  },
};
</script>

<style lang='scss'  scoped>
@import '../../assets/sass/color.scss';
@media only screen and (min-width: 600px) {
  .desktop-padding-left-28 {
    padding-left: 28px;
  }
}

.margin-top-53 {
  margin-top: 53px;
}
.color-hevy {
  color: $--color-h1;
}
.system-capsule {
  color: $--color-h1;
  line-height: 1.54;
  border: solid 1px #f1f2f4;
  border-radius: 4px;
  max-height: 420px;
  overflow-y: scroll;
}
.health-capsule {
  border: 1px solid #f1f2f4;
  padding: 21px 21px;
  border-radius: 4px;
}
.padding21-18 {
  padding: 21px 18px 12px 18px;
}
.health-small-info-box {
  display: flex;
  flex-direction: column;
}
.system-sub-container {
  background-color: #f6f7f8;
  min-height: 76px;
}
</style>
