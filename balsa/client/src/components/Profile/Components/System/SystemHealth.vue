<template>
  <el-row :gutter="16">
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule">
        <span class="font-medium color-hevy line-height-normal">System uptime</span>
        <el-col :span="24" style="margin-top:20px;">
          <span
            style="font-size:22px;"
            class="font-heavy color-hevy line-height-normal"
          >52 days 20 hours 2 minutes</span>
        </el-col>
        <el-col :span="24">
          <span class="pale extra-small">Current</span>
        </el-col>
      </el-row>
    </el-col>
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule" style="min-height:136px;">
        <span class="font-medium color-hevy line-height-normal">System load</span>
        <el-row>
          <el-col :span="20" style="margin-top:20px;">
            <el-row type="flex" justify="space-between">
              <div class="health-small-info-box">
                <span style="font-size:22px;" class="font-heavy color-hevy line-height-normal">1%</span>
                <span class="pale extra-small">Current</span>
              </div>

              <div class="health-small-info-box">
                <span style="font-size:22px;" class="font-heavy color-hevy line-height-normal">5%</span>
                <span class="pale extra-small">5 mins ago</span>
              </div>
              <div class="health-small-info-box">
                <span style="font-size:22px;" class="font-heavy color-hevy line-height-normal">2%</span>
                <span class="pale extra-small">15 mins ago</span>
              </div>
            </el-row>
          </el-col>
        </el-row>

        <el-row></el-row>
      </el-row>
    </el-col>
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule">
        <span class="font-medium color-hevy line-height-normal">Memory allocation</span>
        <el-col :span="24" style="margin-top:20px;">
          <el-progress :percentage="75" :show-text="false"></el-progress>
        </el-col>
        <el-col :span="24" style="margin-top:10px;">
          <span
            style="font-size:22px;"
            class="font-heavy color-hevy line-height-normal"
          >15 GB of 20 GB (75%)</span>
        </el-col>
        <el-row>
          <span class="pale extra-small">Current</span>
        </el-row>
      </el-row>
    </el-col>
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule" style="min-height:152px;">
        <span class="font-medium color-hevy line-height-normal">Database connectivity</span>
        <el-col :span="24" style="margin-top:20px;">
          <span
            style="font-size:17px;"
            class="font-medium pale line-height-normal"
          >Connected to MySQL database</span>
        </el-col>
        <el-row>
          <span class="color-hevy" style="font-size:19px;">IP 128.1.27.84</span>
        </el-row>
      </el-row>
    </el-col>
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule" style="padding:0">
        <el-row class="padding21-18">
          <span class="font-medium color-hevy line-height-normal">Warnings (1)</span>
        </el-row>
        <Divider />
        <el-row class="padding21-18 system-sub-container">
          <span
            class="font-medium color-hevy line-height-normal"
          >MYSQL database usage is over 90% (600 MB left)</span>
          <el-row>
            <span class="color-hevy medium-font balsa-opacity">20 mins ago</span>
          </el-row>
        </el-row>
      </el-row>
    </el-col>
    <el-col :md="12" :xs="24" style="margin-top:21px;">
      <el-row class="health-capsule" style="padding:0">
        <el-row class="padding21-18">
          <span class="font-medium color-hevy line-height-normal">Errors (1)</span>
        </el-row>
        <Divider />
        <el-row class="padding21-18 system-sub-container">
          <span
            class="font-medium color-hevy line-height-normal"
          >Cannot ping Youtube (may effect embedding)</span>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {};
</script>

<style lang='scss' >
@import '../../../../assets/sass/color.scss';

.color-hevy {
  color: $--color-h1;
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
