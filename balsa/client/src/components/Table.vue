<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Title" min-width="260">
      <template slot-scope="scope">
        <div class="table-flex-direction-column">
          <span class="span-balsa">{{ scope.row.title }}</span>
          <span
            class="span-balsa balsa-opacity font-size-14 line-height-normal zberkberkerk berkberkerk"
          >{{ scope.row.date }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Views" min-width="160">
      <template slot-scope="scope">
        <span class="views-reads span-balsa">{{ scope.row.views }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Reads" min-width="145">
      <template slot-scope="scope">
        <span class="views-reads span-balsa">{{ scope.row.reads }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Collaboators" min-width="172">
      <template slot-scope="scope">
        <AvatarContainer :avatars="scope.row.collaborators" size="smallAvatar"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AvatarContainer from './AvatarContainer.vue';
export default {
  components: {
    AvatarContainer,
  },
  data() {
    return {
      tableData: [
        {
          title: 'Reconciliation',
          date: 'Edited 45 mins ago',
          views: '754',
          reads: '103',
          collaborators: [
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'İchigo',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
          ],
        },
        {
          title: 'Sales Pitch - 2018',
          date: 'Edited 1 day ago',
          views: '380',
          reads: '89',
          collaborators: [
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'İchigo',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'İchigo',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
          ],
        },
        {
          title: 'Social Media Plan, Dec',
          date: 'Edited 2 mins ago',
          views: '154',
          reads: '45',
          collaborators: [
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
          ],
        },
        {
          title: 'License Agreement & SLA',
          date: 'Edited 5 days ago',
          views: '90',
          reads: '104',
          collaborators: [
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
            {
              profileImage: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
              firstName: 'Matsumoto',
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleEdit(index, row) {
    },
    handleDelete(index, row) {
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/sass/color.scss';
.span-balsa {
  color: $--color-h1;
}

.font-size-14 {
  font-size: 14px;
}
.table-flex-direction-column {
  padding: 5px 0;
  display: flex;
  flex-direction: column;
}
.views-reads {
  font-size: 19px;
  padding-left: 5px;
}
</style>


