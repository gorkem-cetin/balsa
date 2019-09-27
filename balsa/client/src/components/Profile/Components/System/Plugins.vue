<template>
  <el-row>
    <el-table class="berkk" :data="tableData" style="width: 100%">
      <el-table-column label="Enabled" width="92" class="deneme">
        <template slot-scope="scope">
          <el-row style="padding-top:20px;padding-bottom:20px;">
            <el-switch v-model="scope.row.switch"></el-switch>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Plugin" width="227">
        <template slot-scope="scope">
          <span class="views-reads span-balsa font-medium">{{ scope.row.plugin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" min-width="300">
        <template slot-scope="scope">
          <span class="views-reads span-balsa">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [
        {
          switch: true,
          plugin: 'Calendar',
          description: 'A simple calendar plugin with option to create events.',
        },
        {
          switch: true,
          plugin: 'PDF Annotation',
          description: 'Annotate your PDF files in an easy way.',
        },
        {
          switch: false,
          plugin: 'Image recognition',
          description: 'Automated image recognition & integration of something funny.',
        },
      ],
    };
  },
};
</script>

<style>
</style>
