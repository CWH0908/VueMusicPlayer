<template>
  <div class="music-list">
    <div class="imgDiv">
      <!-- 顶部返回和标题 -->
      <header class="backgroundDiv">
        <div @click="goBack" class="el-icon-arrow-left goBack"></div>
        <span class="title">{{title}}</span>
      </header>
      <img :src="bgImage" class="bgImage" ref="bgImage" />
      <!-- <div class="bgImage" ref="bgImage" :style="bgStyle"></div> -->
    </div>
    <div
      ref="list"
      class="songList flexUl"
      v-loading="songs&&!songs.length"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0.8)"
      element-loading-customClass="loadingCustomClass"
      style="position:relative;min-height:50vh;font-size:1rem"
    >
      <KugouSongList :songs="songs"  @select="selectItem"></KugouSongList>

      <!-- <player></player> -->
    </div>
  </div>
</template>

<script>
import scroll from "../base/scroll";
import KugouSongList from "../../components/base/KugouSongList";
import { getKugouRankDetailList } from "../../api/kugouRank";
import { mapActions } from "vuex";
import player from "../../components/player/player";

export default {
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: () => {}
    },
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    selectItem(item, index) {
      //使用mapActions 暴露出来的 selectPlay函数，来设置播放器的播放内容
      this.selectPlay({
        list: this.songs, //为何不直接使用 item ，item在当前组件表示点击的某首歌曲，
        //此处传入的list将整个songs列表都传递进去，可以通过index查找，比起单首歌曲的播放列表，
        //显然完整的歌曲列表更加方便后续的使用
        index: index
      });
    },
    ...mapActions(["selectPlay"])
  },
  components: {
    scroll,
    KugouSongList,
    player
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage});background-size:cover;`;
    }
  }
};
</script>

<style lang="less" scoped>
.music-list {
  .goBack {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 2rem;
  }
  .imgDiv {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    .bgImage {
      position: relative;
      width: 100vw;
      // width: 100%;
      // height: 300px;
      // height: 0;
      // padding-top: 70%;
      display: block;
    }
    .title {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 80%;
    }
    .backgroundDiv {
      position: fixed;
      z-index: 999;
      width: 100%;
      height: 3rem;
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.6),
        rgba(0, 0, 0, 0)
      );
      color: #fff;
    }
  }
}

.wrapper {
  margin-top: 50vh;
  height: 100vh;
}
.list {
  .songList {
    color: rgba(0, 0, 0, 0.7);
  }
}

.flexUl {
  display: flex;
  flex-direction: column;
  li {
    list-style-type: none;
  }

  /deep/ .el-icon-loading:before {
    font-size: 30px;
  }
  /deep/ .el-loading-text {
    font-size: 18px;
  }
}
</style>