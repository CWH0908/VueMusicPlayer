<template>
  <div>
    <scroll :data="rankList">
      <ul
        class="rankUl"
        v-loading="!rankList.length"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0.8)"
        element-loading-customClass="loadingCustomClass"
        style="position:relative;min-height:40vh;font-size:1rem"
      >
        <li
          v-show="isShowRank"
          class="rankLi"
          v-for="(item,index) in rankList"
          :key="index"
          @click="_getKugouRankDetailList(item)"
        >
          <div class="imgDiv">
            <img class="image" :src="(item.imgurl)|imageFilter" />
          </div>
          <div class="textDiv">
            <span>{{item.rankname}}</span>
          </div>
        </li>
      </ul>
    </scroll>
    <transition name="rank" mode="in-out" appear>
      <router-view class="topList" name="topList"></router-view>
    </transition>
  </div>
</template>

<script>
import { getKugouRank } from "../../api/kugouRank";
import scroll from "../base/scroll";
export default {
  created() {
    this._getKugouRank(); //获取排行榜数据
  },
  data() {
    return {
      rankList: [], //排行榜歌单
      isShowRank: true //是否显示歌单
    };
  },
  watch: {
    $route(newVal) {
      if (newVal.name == "Rank") {
        this.isShowRank = true;
      }
    }
  },
  methods: {
    async _getKugouRank() {
      this.rankList = await getKugouRank();
    },
    //获取排行榜详细歌曲
    async _getKugouRankDetailList(item) {
      this.isShowRank = false; //隐藏歌单
      item.imgurl = item.imgurl.replace(/{size}/, 400);
      this.$router.push({
        name: "rankList",
        params: {
          id: item.rankid, //传入歌单id
          specialname: item.rankname, //传入歌单名
          imgurl: item.imgurl, //传入歌单图片
          rank: true
        }
      });
    }
  },
  filters: {
    imageFilter: function(value) {
      return value.replace(/{size}/, 150);
    }
  },
  components: {
    scroll
  }
};
</script>

<style lang="less" scoped>
.rankUl {
  width: 100%;
  display: flex;
  flex-direction: column;
  .rankLi {
    list-style-type: none;
    width: 100%;
    height: 5rem;
    line-height: 5rem;
    margin-bottom: 0.5rem;
    border: 1px solid gray;

    .imgDiv {
      float: left;
      width: 20%;
      height: 5rem;
      display: block;
      box-sizing: border-box;
      .image {
        width: 100%;
        height: 100%;
      }
    }
    .textDiv {
      overflow: hidden;
      height: 5rem;
      display: flex;
      flex-direction: column;
      padding-left: 1rem;
      span {
        display: block;
        height: 2rem;
        line-height: 2rem;
      }
    }
  }
}
.rank-enter-active,
.rank-leave-active {
  transition: all 1s;
  transform: translateX(0);
}
.rank-enter, .rank-leave-to /* .rank-leave-active below version 2.1.8 */ {
  transform: translateX(500px);

  opacity: 0;
}
.topList {
  position: absolute;
  top: 0;
}
/deep/.el-loading-spinner{
  top: 50vh;
}
</style>