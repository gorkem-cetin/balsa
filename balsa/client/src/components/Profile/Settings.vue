    <template>
  <ProfileContainer>
    <el-row>
      <el-row>
        <h1 class="balsa-h1-row">My Settings</h1>
        <h3 class="balsa-pading-left-5" style="margin-top:28px;">Send me an e-mail, when</h3>
        <el-row type="flex" class="balsa-switch-container" v-if="!this.$apollo.queries.userConfigurations.loading">
          <el-switch
              @change="((data)=>change(data))"
              v-model="userConfigurations.notifyMeOnShare"
              active-text="Someone shares a document with me"
          ></el-switch>
          <el-switch
              @change="((data)=>change(data))"
              v-model="userConfigurations.notifyMeOnReply"
              active-text="Someone replies to me"
          ></el-switch>
          <el-switch
              @change="((data)=>change(data))"
              v-model="userConfigurations.notifyMeOnMention"
              active-text="Someone mentions me"
          ></el-switch>
          <el-switch
              @change="((data)=>change(data))"
              v-model="userConfigurations.notifyMeOnModify"
              active-text="Someone modifies a document I own"
          ></el-switch>

        </el-row>
        <el-col :md="20" class="balsa-pading-left-5">
          <Divider style="margin-top:32px;"/>
        </el-col>
      </el-row>
      <el-row>
        <ThemeSettings/>
      </el-row>
    </el-row>
  </ProfileContainer>
</template>

<script>
import ThemeSettings from '../ThemeSettings.vue';
import BalsaSwitch from '../Switch.vue';
import Divider from '../Divider.vue';
import Avatar from '../Avatar.vue';
import ProfileContainer from './ProfileContainer.vue';
import PopoverImage from '../PopoverImage.vue';
import EditorMenu from '../Menu/Editor/EditorMenu.vue';
import gql from "graphql-tag";
import {USER_CONFIGURATIONS_QUERY} from "../../queries";
import NotificationMixin from '../Mixins/NotificationMixin';

export default {
  mixins: [NotificationMixin],
  components: {
    ProfileContainer,
    Avatar,
    PopoverImage,
    EditorMenu,
    Divider,
    ThemeSettings,
    BalsaSwitch,
  },
  apollo: {
    userConfigurations: {
      query: USER_CONFIGURATIONS_QUERY
    }
  },
  methods: {
    change(val) {
      this.$apollo.mutate({
        mutation: gql`
          mutation($data: UserConfigurationInput!) {
            updateUserConfigurations(data: $data) {
              id
              notifyMeOnShare
              notifyMeOnReply
              notifyMeOnMention
              notifyMeOnModify
            }
          }
        `,
        variables: {
          data: {
            notifyMeOnShare: this.userConfigurations.notifyMeOnShare,
            notifyMeOnReply: this.userConfigurations.notifyMeOnReply,
            notifyMeOnMention: this.userConfigurations.notifyMeOnMention,
            notifyMeOnModify: this.userConfigurations.notifyMeOnModify,
          }
        },
      }).then(() => {
        this.notifySuccess(`Configuration is updated.`);
      }).catch((error) => {
        this.notifyError(error);
      });
    }
  }
};
</script>

<style scoped>
  .color-orange {
    color: #fa7047;
  }
  p {

    color: #858d97;
    font-size: 14px;
  }
  .el-form--label-top {

  }
  .margin-bottom-31 {
    margin-bottom: 31px;
  }
  .balsa-switch-container {
    flex-direction: column;
  }
  .balsa-switch-container .el-switch {
    margin: 8px 0px;
  }
  span {

  }
</style>
