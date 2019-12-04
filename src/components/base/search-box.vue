<template>
  <div class="searchBox">
    <el-input
      class="box"
      @blurInput="blurInput"
      ref="input"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="inputValue"
      clearable
    ></el-input>
    <div class="hotDiv" v-show="(kugouSearchList.length==0)&&(inputValue.trim()=='')">
      <div class="title">热门搜索</div>
      <ul class="hotUl">
        <li
          @click="selectKeyword(item.keyword)"
          class="hotLi"
          v-for="(item,index) in hotKeywords"
          :key="index"
        >{{item.keyword}}</li>
      </ul>
    </div>
    <!-- <button @click="searchMore">获取更多</button> -->

    <!-- 搜索不到对应歌曲 -->
    <!-- <div style="color:gray;" v-show="(kugouSearchList.length==0)&&(inputValue.trim()!='')">在地球上搜索不到这首歌 =_= </div> -->
    <!-- 搜索回来的歌曲列表 -->
    <div style="color:gray;" v-show="haveSong">在地球上搜索不到这首歌 =_=</div>

    <searchHistoryList
      @selectHistorySong="selectHistorySong"
      :searchHistory="searchHistory"
      v-show="(kugouSearchList.length==0)&&(inputValue.trim()=='')&&(searchHistory.length>0)"
    ></searchHistoryList>

    <suggest
      v-if="(kugouSearchList.length!=0)"
      :searchList="kugouSearchList"
      @searchMore="searchMore"
      @selectItem="selectItem"
    ></suggest>
  </div>
</template>

<script>
import { getKugouHotKeywords, getKugousearchList } from "../../api/kugouSearch";
import { mapActions, mapMutations, mapGetters } from "vuex";
import suggest from "../../components/suggest/suggest";
import searchHistoryList from "../base/searchHistoryList";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  created() {
    this.$watch("inputValue", newVal => {
      this.$emit("inputValue", newVal);
    });
    this._getKugouHotKeywords(); //获取热门关键词
  },
  data() {
    return {
      inputValue: "", //输入框的值
      hotKeywords: [], //热门关键词
      kugouSearchList: [], //搜索列表
      currentPage: 1, //搜索默认显示第一页
      totalPage: 0, //搜索结果的页数
      //   isSearch: false //是否有搜索结果
      haveSong: false,
      lastTime: 0
    };
  },
  methods: {
    //获取搜索热门词
    async _getKugouHotKeywords() {
      this.hotKeywords = await getKugouHotKeywords();
    },
    selectKeyword(keyword) {
      this.inputValue = keyword;
    },
    //搜索歌曲
    async getSearchList(keyword, page) {
      if (keyword.trim() != "") {
        console.log("keyWords", keyword);
        //   loading遮罩层
        this.openFullScreen();
        //不为空发起请求
        try {
          let data = await getKugousearchList(keyword, page);
          //插入搜索历史
          this.set_searchHistory(this.inputValue);
          if (data.info.length == 0 && this.inputValue.trim() != "") {
            this.haveSong = true;
          } else {
            this.haveSong = false;
          }
          this.kugouSearchList.push(...data.info);
          this.totalPage = Math.ceil(Number(data.total) / 20);
        } catch (err) {}
      } else {
        this.kugouSearchList = [];
      }
    },
    //loading更多歌曲
    searchMore() {
      this.currentPage++; //页数+1
      if (this.currentPage <= this.totalPage) {
        this.getSearchList(this.inputValue, this.currentPage);
      }
    },
    // loading全屏遮罩层
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    openFullScreen() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0, 0.8)"
      });
      setTimeout(() => {
        loading.close();
      }, 500);
    },
    //向state的播放列表等一系列数据中新增点击的搜索歌曲
    ...mapActions(["insertSong"]),
    //点击搜索的歌曲
    selectItem(item) {
      this.insertSong(item);
    },
    //节流函数
    throttle(newVal, wait) {
      var func = () => {
        var currentTime = Date.now();
        if (currentTime - this.lastTime > wait) {
          //如果调用时间间隔大于定时器规定时间，执行函数
          this.getSearchList(newVal, this.currentPage); //获取搜索数据
          // console.log("执行一次请求数据", newVal);
          this.lastTime = currentTime; //重置上一次函数被调用时的时间
        }
      };
      return func;
    },
    //搜索框失焦
    blurInput() {
      this.$refs.input.blur();
    },
    //选中历史歌曲到搜索框
    selectHistorySong(item) {
      this.inputValue = item;
    },
    //搜索历史数组
    ...mapMutations(["set_searchHistory"])
  },
  watch: {
    inputValue(newVal) {
      this.currentPage = 1; //搜索显示第一页的结果
      this.kugouSearchList = []; //重置
      // this.getSearchList(newVal, this.currentPage); //获取搜索数据
      this.throttle(newVal, 500)();
      //当请求不到时，输入框清空，隐藏找不到提示语
      if (newVal.length == 0) {
        this.haveSong = false;
      }
    },
    kugouSearchList(newVal) {
      //拿回数据,如果是因为网络，导致请求数据拿回过慢，在输入框清空后，也需要把搜索拿回的数据列表重置为空
      if (newVal != "") {
        if (this.inputValue == "") {
          this.kugouSearchList = [];
        }
      }
    }
  },
  components: {
    suggest,
    searchHistoryList
  },
  computed: {
    ...mapGetters(["searchHistory"])
  }
};
</script>

<style lang="less" scoped>
.searchBox {
  width: 100%;
  margin-top: 1vh;
  height: 4rem;
  line-height: 4rem;
  text-align: center;
  .box {
    width: 90%;
    display: inline-block;
  }
  .title {
    line-height: 3rem;
    color: #e20000;
  }
  .hotDiv {
    .hotUl {
      display: flex;
      justify-content: space-around;

      .hotLi {
        height: 2rem;
        line-height: 2rem;
        list-style-type: none;
        padding: 0 0.5rem;
        background-color: #e20000;
        border-radius: 20px;
        color: white;
        font-size: 0.5rem;
      }
    }
  }
}
</style>