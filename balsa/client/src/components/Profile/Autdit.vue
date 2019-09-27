<template>
  <ProfileContainer>
    <el-row>
      <h1 class="balsa-h1-row">Activities</h1>
      <el-row style="min-height:69vh">
        <el-table :data="fake_datas" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row style="padding:10px;">
                <el-col :md="12">
                  <el-row>
                    <el-row>
                      <el-col :span="4">
                        <span class="semi-medium-font">Full Path:</span>
                      </el-col>
                      <el-col :span="20">
                        <span
                          class="semi-medium-font"
                          style="margin-left:16px;text-decoration: underline;"
                        >{{props.row.file.path}}</span>
                      </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                      <el-col :span="4">
                        <span class="semi-medium-font">Type:</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row type="flex">
                          <BalsaIcon
                            style="margin-left:16px"
                            :icon="props.row.file.isFolder?'folder.svg':'file.svg'"
                          />
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                      <el-col :span="4">
                        <span class="semi-medium-font">Info:</span>
                      </el-col>
                      <el-col :span="20">
                        <span class="semi-medium-font" style="margin-left:16px;">Another Info</span>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-col>
                <el-col :md="12">
                  <el-row>
                    <el-row>
                      <el-col :span="4">
                        <span class="semi-medium-font">Full Path:</span>
                      </el-col>
                      <el-col :span="20">
                        <span
                          class="semi-medium-font"
                          style="margin-left:16px;text-decoration: underline;"
                        >{{props.row.file.path}}</span>
                      </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                      <el-col :span="4">
                        <span class="semi-medium-font">Type:</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row type="flex">
                          <BalsaIcon
                            style="margin-left:16px"
                            :icon="props.row.file.isFolder?'folder.svg':'file.svg'"
                          />
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                      <el-col :span="4">
                        <span class="semi-medium-font">Info:</span>
                      </el-col>
                      <el-col :span="20">
                        <span class="semi-medium-font" style="margin-left:16px;">Another Info</span>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="user.firstName" label="User" width="180">
            <template slot-scope="scope">
              <el-row type="flex" align="middle">
                <Avatar />
                <el-row style="margin-left:8px;">
                  <span class="medium-font">{{scope.row.user.firstName}}</span>
                </el-row>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="file.name" label="File/Folder" width="140">
            <template slot-scope="scope">
              <span class="medium-font">{{scope.row.file.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="Action">
            <template slot-scope="scope">
              <span class="medium-font">{{scope.row.action}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="Date" width="140">
            <template slot-scope="scope">
              <span class="medium-font">{{scope.row.date}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </ProfileContainer>
</template>

<script>
import BalsaIcon from '../BalsaIcon.vue';
import Avatar from '../Avatar.vue';
import ProfileContainer from './ProfileContainer.vue';

export default {
  components: {
    ProfileContainer,
    Avatar,
    BalsaIcon,
  },
  data() {
    return {
      fake_datas: [
        {
          user: {
            id: 1,
            firstName: 'Matsumoto',
            profileImage: '',
          },
          action: 'Like',
          file: {
            id: 1,
            isFolder: false,
            name: 'Anime',
            path: 'Abc / Data / Tek / Anime',
          },
          date: '2016-05-02',
        },
        {
          user: {
            id: 2,
            firstName: 'Ichigo',
            profileImage: '',
          },
          action: 'Invitation Accept',
          file: {
            id: 2,
            isFolder: true,
            name: 'Untitled',
            path: 'Abc / Data / Tek / Anime',
          },
          date: '2016-05-04',
        },
        {
          user: {
            id: 3,
            firstName: 'Berk',
            profileImage: '',
          },
          file: {
            id: 3,
            isFolder: true,
            name: 'DarkSouls',
            path: 'Abc / Data / Tek / Anime',
          },
          action: 'Edit',
          date: '2016-05-01',
        },
      ],
    };
  },
};
</script>

<style scoped>
</style>
