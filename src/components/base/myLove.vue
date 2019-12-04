<template>
  <div class="myLove">
    <header class="backgroundDiv">
      <div @click="goBack" class="el-icon-arrow-left goBack"></div>
      <span class="title">myLove~</span>
    </header>
    <ul :style="isPaddingBottom" v-if="loveList&&loveList.length>0">
      <li @click="selectItem(item,index)" v-for="(item,index) in loveList" :key="'info-'+index">
        <div class="container">
          <h2 class="name">
            <span style="font-weight:bold;">{{index+1 | indexFilter}}&nbsp;&nbsp;</span>
            {{item.filename}}
          </h2>
        </div>
      </li>
    </ul>
    <div v-else class="noPlayList">喜欢的列表空空如也~</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    selectItem(item, index) {
      //使用mapActions 暴露出来的 selectPlay函数，来设置播放器的播放内容
      this.selectPlay({
        list: this.loveList, //为何不直接使用 item ，item在当前组件表示点击的某首歌曲，
        //此处传入的list将整个songs列表都传递进去，可以通过index查找，比起单首歌曲的播放列表，
        //显然完整的歌曲列表更加方便后续的使用
        index: index
      });
    },
    ...mapActions(["selectPlay"])
  },
  watch: {
    fullScreen: function(newVal) {
      newVal == true
        ? (this.isPaddingBottom = "")
        : (this.isPaddingBottom = "padding-bottom:3.5rem");
    },
    playList: function(newVal) {
      newVal.length == 0
        ? (this.isPaddingBottom = "")
        : (this.isPaddingBottom = "padding-bottom:3.5rem");
    }
  },
  computed: {
    ...mapGetters(["playList", "fullScreen", "loveList"]),
    isPaddingBottom: {
      get: function() {
        if (this.playList) {
          if (this.playList.length) {
            return this.fullScreen ? "" : "padding-bottom:3.5rem";
          }
        } else {
          return "";
        }
      },
      set: function(newValue) {}
    }
  },
  filters: {
    indexFilter: function(val) {
      if (val.toString().length == 1) {
        return "0" + val;
      } else {
        return val;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.myLove {
  position: ansolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
}
.backgroundDiv {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 2.5rem;
  background-color: #e20000;
  color: #fff;
  .el-icon-arrow-left {
    vertical-align: middle;
  }
  .goBack {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 2rem;
    &::before {
      vertical-align: middle;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 80%;
  }
}
ul {
  margin-top: 3rem;
  position: absolute;
  left: 0;
  li {
    height: 2rem;
    line-height: 2rem;
    .container {
      width: 100%;
      font-size: 0.8rem;
      text-align: left;
      color: black;
      .name {
        width: 95vw;
        padding-left:2vw;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.noPlayList {
  font-size: 1rem;
  color: gray;
  margin-top: 20vh;
}
</style>