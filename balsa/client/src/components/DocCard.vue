<template>
  <div>
    <router-link :to="{name:'editor',params:{id}}">
      <div class="balsa-home-card">
        <div class="balsa-home-card-content-container">
          <div class="balsa-home-card-content editor__content-balsa-preview" v-html="content"></div>
        </div>
      </div>
      <el-row :gutter="2" class="editor-capsule-informer">
        <span class="span-dark">{{title}}</span>
        <p class="balsa-home-small-text">{{time}}</p>
      </el-row>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String|null|undefined,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    others: {
      type: String,
      required: false,
    },
  },
};
</script>


<style >
.editor-capsule-informer {
  padding-top: 9px;
  top: 0px;
  background-color: white;
}
.primary-color {
  color: #323f50;
}
span {
  font-weight: 500;
  font-size: 15px;
}
.balsa-home-card {
  padding: 17px 18px 0px 16px;
  border-radius: 4px;
  background-color: #dcdce4;
}
.balsa-home-card-content-container {
  background-color: white;
  height: 119px;
  box-shadow: 0 5px 7px 0 rgba(0, 0, 0, 0.13);
  overflow: hidden;
}
.balsa-home-card-content {
  transform-origin: 0 0;
  margin: 10px 25px;
}

.balsa-home-small-text {
  margin-top: 3px;
  letter-spacing: -0.1px;
  color: #616381;
  font-size: 11px;
  font-weight: 500;
}
@media only screen and (max-width: 600px) {
  .balsa-home-card {
    padding: 7px 8px 0 8px;
    border-radius: 4px;
    background-color: #dcdce4;
  }
}
</style>
