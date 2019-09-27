<template>
  <ProfileContainer>
    <el-row>
      <el-row>
        <h1>Configurations</h1>

        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          style="margin-top:28px;"
          class="mobile-max-width"
        >
<!--          <el-tab-pane label="Server" name="first">-->
<!--            <el-row style="margin-top:32px;">-->
<!--              <el-row>-->
<!--                <el-row type="flex" justify="end">-->
<!--                  <Messages/>-->
<!--                </el-row>-->

<!--                <el-form label-position="top" :model="ruleForm" ref="ruleForm" label-width="120px">-->
<!--                  <el-row>-->
<!--                    <span class="font-heavy color-hevy line-height-normal">Server URL</span>-->
<!--                    <el-form-item-->
<!--                      label="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium"-->
<!--                      prop="server_url"-->
<!--                      class="config"-->
<!--                    >-->
<!--                      <el-col :md="9" :xs="14">-->
<!--                        <el-input v-model="ruleForm.server_url"></el-input>-->
<!--                      </el-col>-->
<!--                    </el-form-item>-->
<!--                  </el-row>-->
<!--                  <el-row class="margin-top-10">-->
<!--                    <span class="font-heavy color-hevy line-height-normal">Allowed logins</span>-->
<!--                    <el-form-item-->
<!--                      label="Number of allowed login attempts per one IP"-->
<!--                      prop="allowed_logins"-->
<!--                      class="config"-->
<!--                    >-->
<!--                      <el-col :md="4" :xs="4">-->
<!--                        <el-input v-model="ruleForm.allowed_logins"></el-input>-->
<!--                      </el-col>-->
<!--                    </el-form-item>-->
<!--                  </el-row>-->
<!--                  <el-row class="margin-top-10">-->
<!--                    <span class="font-heavy color-hevy line-height-normal">Password expiration</span>-->
<!--                    <el-form-item-->
<!--                      label="Password expiration in days"-->
<!--                      prop="pass_exprition"-->
<!--                      class="config"-->
<!--                    >-->
<!--                      <el-col :md="4" :xs="4">-->
<!--                        <el-input v-model="ruleForm.pass_exprition"></el-input>-->
<!--                      </el-col>-->
<!--                    </el-form-item>-->
<!--                  </el-row>-->
<!--                  <el-row class="margin-top-10">-->
<!--                    <span-->
<!--                      class="font-heavy color-hevy line-height-normal"-->
<!--                    >Another configuration input</span>-->
<!--                    <el-form-item-->
<!--                      label="Something configurable could be here too."-->
<!--                      prop="another_config_op"-->
<!--                      class="config"-->
<!--                    >-->
<!--                      <el-col :md="4" :xs="4">-->
<!--                        <el-input v-model="ruleForm.another_config_op"></el-input>-->
<!--                      </el-col>-->
<!--                    </el-form-item>-->
<!--                  </el-row>-->
<!--                </el-form>-->
<!--              </el-row>-->
<!--            </el-row>-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="API" name="second">qwf2</el-tab-pane>-->
          <el-tab-pane label="All" name="first">
            <el-row v-if="!this.$apollo.queries.configurations.loading">
              <el-row style="margin-top:32px;">
                <el-row>
                  <el-form label-position="top" :model="ruleForm" ref="ruleForm" label-width="120px">
                    <el-row>
                      <span class="font-heavy color-hevy line-height-normal">Copy Link</span>
                      <el-form-item
                          label="Let users copy and share document link."
                          class="config"
                      >
                        <el-col :md="9" :xs="14">
                          <el-switch v-model="configurations.copyLink"></el-switch>
                        </el-col>
                      </el-form-item>
                    </el-row>
                    <el-button @click="updateConfigurations">Save</el-button>
                  </el-form>
                </el-row>
              </el-row>
            </el-row>
          </el-tab-pane>
<!--          <el-tab-pane label="Sharing" name="fourth">qwf4</el-tab-pane>-->
<!--          <el-tab-pane label="Integrations" name="fifth">qwf5</el-tab-pane>-->
<!--          <el-tab-pane label="Advanced" name="sixth">qwf6</el-tab-pane>-->
        </el-tabs>
      </el-row>
      <el-row></el-row>
    </el-row>
  </ProfileContainer>
</template>

<script>
import Messages from '../Messages/Messages.vue';
import ProfileContainer from './ProfileContainer.vue';
import {CONFIGURATIONS_QUERY} from "../../queries";
import gql from "graphql-tag";
import NotificationMixin from '../Mixins/NotificationMixin';
import ConfigurationAwareMixin from '../Mixins/ConfigurationAwareMixin';

export default {
  components: {
    Messages,
    ProfileContainer,
  },
  mixins: [NotificationMixin, ConfigurationAwareMixin],
  data() {
    return {
      ruleForm: {
        server_url: 'myserver.balsa.app',
        allowed_logins: '4',
        pass_exprition: '30',
        another_config_op: '30',
      },
      activeName: 'first',
    };
  },
  methods: {
    handleClick(tab, event) {
    },
    updateConfigurations() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateConfiguration($data: ConfigurationInput!) {
              updateConfigurations(data: $data) {
                id
                copyLink
              }
            }
          `,
          variables: {
            data: {copyLink: this.configurations.copyLink}
          },
          refetchQueries: ['configurations']
        })
        .then(({ data }) => {
          this.notifySuccess('Configurations updated successfully.')
        }).catch(error => {
          this.notifyError(error.message)
        });
    }
  },
};
</script>


<style lang='scss'  scoped>
@import '../../assets/sass/color.scss';
.margin-top-10 {
  margin-top: 10px;
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
