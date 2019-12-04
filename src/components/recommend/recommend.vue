<template>
  <div>
    <scroll :data="discList">
      <div class="recommend">
        <mt-swipe :auto="4000">
          <!-- <mt-swipe-item v-for="item in slider" :key="item.id">
            <img style="height:100%;width:100%" :src="item.picUrl" />
          </mt-swipe-item>-->
          <mt-swipe-item v-for="item in BSlider" :key="item.id">
            <img style="height:100%;width:100%" :src="item.pic" />
          </mt-swipe-item>
        </mt-swipe>
        <h4 class="hotSongText">热门歌单推荐</h4>
        <ul
          class="flexUl"
          v-loading="!kugouDiscList.length||!discList.length"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0.8)"
          element-loading-customClass="loadingCustomClass"
          style="position:relative;min-height:40vh;font-size:1rem"
        >
          <!-- QQ音乐推荐歌单 -->
          <!-- <li v-for="item in discList" :key="item.dissid">
          <div class="eachSongListItem">
            <img v-lazy="item.imgurl" />
            <div>
              <h4>{{item.creator.name}}</h4>
              <p>{{item.dissname}}</p>
            </div>
          </div>
          </li>-->
          <!-- 酷狗音乐推荐榜单 -->
          <li @click="gotoDisc(item)" v-for="item in kugouDiscList" :key="item.global_specialid">
            <div class="eachSongListItem">
              <img v-lazy="item.imgurl" />
              <div>
                <h4 class="name">{{item.specialname}}</h4>
                <p class="intro">{{item.intro}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </scroll>

    <transition appear mode="in-out">
      <router-view name="Disc"></router-view>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";

import { getRecommend } from "../../api/recommend.js"; //引入 推荐组件 所需要的 请求文件，用于发送jsonp请求，请求API数据
import { ERR_OK } from "../../api/config.js"; //用于判断请求成功与否的参数

import axios from "axios";

import { getDiscList } from "../../api/songList";

import { getKugouDiscList } from "../../api/kugouRecommend";

import scroll from "../base/scroll"; //滚动组件
import { async } from "q";

import { getBSwipper } from "../../api/getBSwipper";

export default {
  created() {
    // this._getRecommend(); //jsonp请求推荐列表 ,QQ音乐轮播图废了，使用下面后端代理拿回来的B站轮播图
    this._getBSwipper(); //B站轮播图

    setTimeout(() => {
      //调用songList函数请求歌曲列表
      this._getDiscList();
      this._getKugouDiscList();
    }, 500); //延迟体现loading加载效果

    // QQ音乐推荐歌单列表API  axios请求
    // axios
    //   .get("/QQMusicAPI/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg", {
    //     params: {
    //       g_tk: 5391,
    //       inCharset: "utf-8",
    //       outCharset: "utf-8",
    //       notice: 0,
    //       format: "jsonp",
    //       platform: "h5",
    //       uin: 0,
    //       needNewCode: 1
    //     },
    //     headers: {
    //       // referer: "https://c.y.qq.com/",
    //       // host: "c.y.qq.com"
    //     }
    //   })
    //   .then(function(respond) {
    //     console.log("axios请求成功");
    //     // console.log(respond.data.data.slider);
    //     console.log(respond.data);
    //   })
    //   .catch(function(error) {
    //     console.log("axios请求失败");
    //     console.log(error);
    //   });
  },
  data() {
    return {
      slider: [], //推荐列表的数据
      discList: [],
      kugouDiscList: [],
      BSlider: []
    };
  },
  methods: {
    _getRecommend() {
      getRecommend().then(respond => {
        if (respond.code == ERR_OK) {
          console.log(respond.data.slider);
          this.slider = respond.data.slider;
        }
      });
    },
    _getBSwipper() {
      getBSwipper().then(respond => {
        if (respond.code == ERR_OK) {
          console.log(respond.data);
          this.BSlider = respond.data;
        }
      });
    },
    async _getDiscList() {
      this.discList = await getDiscList();
    },
    async _getKugouDiscList() {
      let KugouDiscList = await getKugouDiscList();
      var reg = /{size}/g; //正则修改请求回来的图片数据
      KugouDiscList.forEach(element => {
        element.imgurl = element.imgurl.replace(reg, "");
      });
      this.kugouDiscList = KugouDiscList;
    },
    //跳到歌单详情页
    gotoDisc(kugouDiscList) {
      console.log("跳到歌单详情");
      console.log(kugouDiscList);
      this.$router.push({
        name: "Disc",
        params: {
          id: kugouDiscList["specialid"], //传入歌单id
          specialname: kugouDiscList["specialname"], //传入歌单名
          imgurl: kugouDiscList["imgurl"] //传入歌单图片
        }
      });
    }
  },
  components: {
    scroll
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  max-height: 87.5vh !important;
}
.recommend {
  // height: 87.5vh;

  h4 {
    text-align: center;
  }
}
.mint-swipe {
  height: 14rem;
  background-color: gray;
}
.hotSongText {
  padding: 1rem 0;
  border-bottom: 1px solid gray;
  color: #e20000;
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
.eachSongListItem {
  height: 5.3rem;
  padding: 0.5rem 0.5rem;

  img {
    display: inline-block;
    width: 25%;
    float: left;
  }
  div {
    padding: 0 1rem;
    overflow: hidden;
  }
  h4.name {
    text-align: left;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p.intro {
    text-align: left;
    color: gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 2.5;
  }
}
</style>