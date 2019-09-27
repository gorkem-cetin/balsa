<template>
  <el-row>
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
    <el-row class="system-capsule-log balsa-medium balsa-opacity">
      <el-col :span="24" :xs="22" class="desktop-padding-left-28">
        <el-row class="info-tab">{{logs}}</el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import Icon from '../../../Icon';
import PopoverImage from '../../../PopoverImage.vue';
import SystemMenu from '../../../Menu/System/SystemMenu.vue';
export default {
  components: {
    PopoverImage,
    SystemMenu,
    Icon,
  },
  data() {
    return {
      logs: `at Function.app.loadThemeFiles (/root/countly/frontend/express/app.js:267:13)
    at /root/countly/frontend/express/app.js:452:13
ForbiddenError: invalid csrf token
    at csrf (/root/countly/node_modules/csurf/index.js:112:19)
    at /root/countly/frontend/express/app.js:477:9
    at Layer.handle [as handle_request] (/root/countly/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/root/countly/node_modules/express/lib/router/index.js:317:13)
    at /root/countly/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/root/countly/node_modules/express/lib/router/index.js:335:12)
    at next (/root/countly/node_modules/express/lib/router/index.js:275:10)
    at methodOverride (/root/countly/node_modules/method-override/index.js:79:5)
    at Layer.handle [as handle_request] (/root/countly/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/root/countly/node_modules/express/lib/router/index.js:317:13)
    at /root/countly/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/root/countly/node_modules/express/lib/router/index.js:335:12)
    at next (/root/countly/node_modules/express/lib/router/index.js:275:10)
    at /root/countly/frontend/express/app.js:469:13
    at Function.app.loadThemeFiles (/root/countly/frontend/express/app.js:267:13)
    at /root/countly/frontend/express/app.js:452:13
ForbiddenError: invalid csrf token
    at csrf (/root/countly/node_modules/csurf/index.js:112:19)
    at /root/countly/frontend/express/app.js:477:9
    at Layer.handle [as handle_request] (/root/countly/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/root/countly/node_modules/express/lib/router/index.js:317:13)
    at /root/countly/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/root/countly/node_modules/express/lib/router/index.js:335:12)
    at next (/root/countly/node_modules/express/lib/router/index.js:275:10)
    at methodOverride (/root/countly/node_modules/method-override/index.js:79:5)
    at Layer.handle [as handle_request] (/root/countly/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/root/countly/node_modules/express/lib/router/index.js:317:13)
    at /root/countly/node_modules/express/lib/router/index.js:284:7
    at Function.process_params (/root/countly/node_modules/express/lib/router/index.js:335:12)
    at next (/root/countly/node_modules/express/lib/router/index.js:275:10)
    at /root/countly/frontend/express/app.js:469:13
    at Function.app.loadThemeFiles (/root/countly/frontend/express/app.js:267:13)
    at /root/countly/frontend/express/app.js:452:13`,
    };
  },
};
</script>

<style lang='scss'>
@import '../../../../assets/sass/color.scss';
@media only screen and (min-width: 600px) {
  .desktop-padding-left-28 {
    padding-left: 28px;
  }
}
.margin-top-53 {
  margin-top: 53px;
}
.system-capsule-log {
  color: $--color-h1;
  line-height: 1.54;
  border: solid 1px #f1f2f4;
  border-radius: 4px;
  max-height: 420px;
  overflow-y: scroll;
}
</style>
