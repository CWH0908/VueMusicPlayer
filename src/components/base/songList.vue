<template>
  <div class="songList">
    <ul>
      <li @click="selectItem(item,index)" v-for="(item,index) in songs" :key="item.id">
        <div class="container">
          <h2 class="name">{{item.name}}</h2>
          <p class="descript">{{getDescript(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getDescript(songs) {
      return `${songs.singer} , ${songs.album}`;
    },
    selectItem(item,index){
        this.$emit("select",item,index);//让父组件去处理
    }
  }
};
</script>

<style lang="less" scoped>
.songList {
  .container {
    // background-color: rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid gray;
    .name {
      font-weight: 900;
      line-height: 1.5;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: gray;
    }
  }
}
</style>