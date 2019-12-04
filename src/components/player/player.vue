<template>
  <div class="player" v-show="isShow" :style="fullScreenStyle">
    <!-- 正常播放器 -->
    <transition name="normal" appear mode="in-out">
      <div class="normalPlayer" v-show="fullScreen">
        <!-- 整背景图 -->
        <div class="bgImage">
          <img width="100%" height="100%" :src="currentSongInfo.img" />
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back">
            <i class="el-icon-arrow-down icon-back" @click="goBack"></i>
          </div>
          <h1 class="title">{{currentSongInfo.song_name}}</h1>
          <h2 class="subtitle">{{currentSongInfo.author_name}}</h2>
        </div>
        <!-- 中部 唱片 -->
        <div
          class="middle"
          @touchstart="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!-- 旋转图片部分 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd">
                <img :style="imageRotateStop" class="image" v-lazy="currentSongInfo.img" />
              </div>
            </div>
          </div>
          <!-- 歌词滚动部分 -->
          <Scroll class="middle-r" ref="lyricList" :data="currentLyrics && currentLyrics.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyrics">
                <p
                  class="text"
                  :class="{'currentLine':currentLineNum == index}"
                  ref="lyricLine"
                  v-for="(line,index) in currentLyrics.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 图像/歌词切换 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow=='img'}"></span>
            <span class="dot" :class="{'active':currentShow=='lyric'}"></span>
          </div>
          <!-- 播放时间及进度条 -->
          <div class="progress-wrapper">
            <span class="item item-l">{{TimeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="item item-r">{{TimeFormat(currentSong.duration)}}</span>
          </div>
          <!-- 按钮 -->
          <ul class="operators">
            <!-- 播放模式 -->
            <li class="icon i-left">
              <!-- <i class="icon-sequence el-icon-refresh-left"></i> -->
              <i @click="modeChange" :class="iconMode"></i>
            </li>
            <!-- 上一首 -->
            <li class="icon i-left">
              <i @click="lastSong" class="icon-prev el-icon-d-arrow-left"></i>
            </li>
            <!-- 播放/暂停 -->
            <li class="icon i-center">
              <i ref="togglePlaying" @click="togglePlaying" class="el-icon-video-pause"></i>
            </li>
            <!-- 下一首 -->
            <li class="icon i-right">
              <i @click="nextSong" class="icon-next el-icon-d-arrow-right"></i>
            </li>
            <!-- 喜欢/取消喜欢 -->
            <li class="icon i-right" :key="'index'+currentSong">
              <i class="icon" :class="isLove" @click="myLove"></i>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- 迷你播放器 -->
    <div class="miniPlayer" v-show="!fullScreen" @click="setFullScreen">
      <!-- 图片 -->
      <div class="icon">
        <img :style="imageRotateStop" v-lazy="currentSongInfo.img" />
      </div>
      <!-- 文本 -->
      <div class="text">
        <h2 class="name">{{currentSongInfo.song_name}}</h2>
        <p class="desc">{{currentSongInfo.author_name}}</p>
      </div>
      <!-- 按钮 -->
      <div class="mini-icon">
        <i ref="miniTogglePlaying" @click="togglePlaying" class="el-icon-video-pause"></i>
      </div>
      <!-- 播放列表 -->
      <div class="mini-icon" @click="showPlayList">
        <i class="el-icon-tickets"></i>
      </div>
    </div>

    <playlist @modeChange="modeChange" v-show="isShowPlayList" :currentSongInfo="currentSongInfo"></playlist>

    <audio
      ref="audio"
      :src="currentSongInfo.play_url"
      @canplay="ready"
      @timeupdate="updateTime"
      @error="error"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

import { getKugouMusicPlay } from "../../api/kugouMusicPlay";

import progressBar from "../base/progress-bar"; //进度条组件

import Lyric from "lyric-parser"; //歌词滚动播放插件

import Scroll from "../base/scroll";

import playlist from "../../components/playlist/playlist";

export default {
  created() {
    this.touch = {}; //因为这个touch数据对象不需要get和set，所以放在created里面定义即可实现操作同一份数据
  },
  data() {
    return {
      emptyList: {
        list: [],
        index: -1
      },
      currentSongInfo: "", //根据currentSong的hash数据，发送请求，得到的歌曲详细信息
      fullScreenStyle: "position:fixed;",
      imageRotateStop: "animation-play-state: paused;", //停止旋转的style
      songReady: false, //连续切换曲目时会出错，使用此变量标识歌曲资源是否请求回来
      currentTime: 0, //播放当前时间
      currentLyrics: null, //当前歌曲歌词信息
      currentLineNum: 0, //当前歌曲歌词所在行
      currentShow: "img", //当前是 图像还是歌词
      isLove: "el-icon-star-off" //是否添加到喜欢列表
    };
  },
  methods: {
    ...mapActions(["selectPlay"]),
    ...mapMutations({
      set_fullScreen: "set_fullScreen",
      set_playing: "set_playing",
      set_currentIndex: "set_currentIndex",
      set_mode: "set_mode",
      set_playList: "set_playList",
      set_isShowPlayList: "set_isShowPlayList",
      set_loveList: "set_loveList",
      search_loveSong: "search_loveSong", //是否喜欢
      delete_loveList: "delete_loveList"
    }),
    noPlayer() {
      this.selectPlay({
        list: this.emptyList,
        index: this.emptyList.index
      });
      //以下设置无效
      // this.set_playing(false);
      // this.set_currentIndex(-1);
    },
    goBack() {
      //将vuex的fullScreen数据设为false
      this.set_fullScreen(false);
      // this.noPlayer();
    },
    setFullScreen(event) {
      //非点击迷你播放器的播放按钮或歌曲列表按钮
      if (event.target.nodeName !== "I") {
        //将vuex的fullScreen数据设为true
        this.set_fullScreen(true);
      }
    },

    //请求歌曲播放信息
    async _getKugouMusicPlay() {
      let info = await getKugouMusicPlay(this.currentSong.hash);
      if (info["SSA-CODE"]) {
        if (info["SSA-CODE"] != "") {
          //表示请求过于频繁，今天无法再播放歌曲
          //使用element组件
          this.$message({
            type: "error",
            message: "请求过于频繁，今天无法再播放歌曲了哦",
            offset: -4, //自顶部栏向下偏移量
            duration: 2000
          });
          this.noPlayer(); //设置空数据，变现为没有获取到歌单歌曲列表
          setTimeout(() => {
            this.$router.go(-1);
            return false;
          }, 2000);
        } else {
          this.currentSongInfo = info;
          this.currentLyrics = new Lyric(info.lyrics, this.handleLyric); //当前歌词信息
          if (this.playing) {
            this.currentLyrics.play();
          }
        }
      } else {
        this.currentSongInfo = info;
        this.currentLyrics = new Lyric(info.lyrics, this.handleLyric); //当前歌词信息
        if (this.playing) {
          this.currentLyrics.play();
        }
      }
    },

    //切换播放playing数据状态
    togglePlaying() {
      //歌曲资源未准备完成，return
      if (!this.songReady) {
        return;
      }
      this.set_playing(!this.playing);
      if (this.currentLyrics) {
        this.currentLyrics.togglePlay();
      }
    },

    //上一首
    lastSong() {
      //歌曲资源尚未请求成功，不切换歌曲
      if (!this.songReady) {
        return;
      }
      //改变下标index，获取歌曲currentSong，
      //重新设置 当前播放歌曲信息 currentSongInfo
      let index = this.currentIndex - 1;
      if (index < 0) {
        //歌曲列表结尾
        // index = this.currentIndex - 1; //重头开始
        // index = 0; //重头开始
      } else {
        this.set_currentIndex(index);
        if (!this.playing) {
          //暂停时切换歌曲需要改变state的playing状态
          this.togglePlaying();
        }
        this.songReady = false; //请求完当前歌曲，重新将songReady置为false
      }
    },

    //下一首
    nextSong() {
      //歌曲资源尚未请求成功，不切换歌曲
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index == this.playList.length) {
        //歌曲列表结尾
        index = 0; //重头开始
      }
      this.set_currentIndex(index);
      if (!this.playing) {
        //暂停时切换歌曲需要改变state的playing状态
        this.togglePlaying();
      }
      this.songReady = false; //请求完当前歌曲，重新将songReady置为false
    },

    //歌曲资源请求成功可以播放
    ready() {
      this.songReady = true;
    },

    //歌曲请求失败，也置为true，避免切换歌曲不执行
    error() {
      this.songReady = true;
    },
    updateTime(event) {
      this.currentTime = event.target.currentTime; //audio当前播放的时间，可读写
    },

    //用于将时间戳转换成所需时间格式
    TimeFormat(timeStamp) {
      timeStamp = timeStamp | 0; // |0 向下取整
      let minute = (timeStamp / 60) | 0; //取余得到分钟
      let second = timeStamp % 60; //取余得秒
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },

    //根据 拖放 进度条 传回的percent百分比值，修改歌曲的播放位置,通过audio的currentTIme可读写属性
    onProgressBarChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
      if (!this.playing) {
        //非播放状态，拖拽后播放，改变播放状态
        this.togglePlaying();
      }
      if (this.currentLyrics) {
        this.currentLyrics.seek(this.currentSong.duration * percent * 1000); //拖动进度，改变歌词位置
      }
    },

    //切换播放模式
    modeChange() {
      let mode = this.mode;
      mode++;
      mode > 2 ? (mode = 0) : mode;
      this.set_mode(mode);
      //切换播放列表
      let list = null;
      //顺序列表作为参数，使用洗牌函数得到随机播放列表
      if (mode == 2) {
        //随机播放
        list = this.shuffle(this.sequenceList);
      } else {
        //顺序播放、单曲循环
        // list = this.playList;
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list); //设置当前播放曲目索引，保证歌曲不会因为歌单的改变而切换
      this.set_playList(list); //将新的播放列表提交到state中
    },

    // 避免切换播放模式时候重新设置了currentSong，导致当前播放歌曲被切换
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.audio_id == this.currentSong.audio_id; //ES6函数，在新播放列表中根据歌曲audio_id找到当前曲目的新索引
      });
      this.set_currentIndex(index); //重新设置一遍index，这样保证查找到的歌曲是同一首，即currentSong不变
    },

    //洗牌函数的封装
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    shuffle(arr) {
      //不修改原数组
      let _arr = arr.slice();
      for (let i = 0; i < _arr.length; i++) {
        let j = this.getRandom(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
      }
      return _arr;
    },

    // 歌曲播放结束的end事件
    end() {
      //循环播放
      if (this.mode == 1) {
        this.loop();
      } else {
        //切换到下一首
        this.nextSong();
      }
    },

    //循环播放函数loop
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyrics) {
        this.currentLyrics.seek(0); //循环播放时，最后将歌词偏移到初始位置
      }
    },

    //lyric-parser 监听歌词改变的回调函数
    handleLyric(newLyricLine) {
      //每次歌词行改变，更新data的当前歌词行，在页面结构中，根据index等于当前行，显示高亮
      this.currentLineNum = newLyricLine.lineNum;
      //如果当前歌词行数超过5条，通过scroll滑动，实现歌词居中
      if (newLyricLine.lineNum < 5) {
        // <5行
        this.$refs.lyricList.scrollTo(0,0)
      } 
      else if (newLyricLine.lineNum > 5) {
        //大于5行，滚动到当前行数-5行的节点
        let lineEl = this.$refs.lyricLine[newLyricLine.lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        //五行之内，滚动到顶部即可
        this.$refs.lyricList.scrollToElement(0, 0, 1000);
      }
    },

    //图像/歌词滑动切换的效果
    middleTouchStart(e) {
      this.touch.initiated = true; //初始化
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        //纵轴上的偏移大于横轴上的位移，认为是纵向滚动，不切换
        return;
      }
      const left = this.currentShow === "img" ? 0 : -window.innerWidth; //为图像则不偏移，为歌词则向左移。
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth); //得到滑动的比例
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`; //vue组件无法直接访问节点，使用$el
      this.$refs.lyricList.$el.style.transform = `transformDuration:300ms`;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style.transform = `transformDuration:300ms`;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity; //从右向左滑
      if (this.currentShow == "img") {
        //滑动距离大于10%
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.$refs.middleL.style.opacity = opacity;
          this.$refs.middleL.style.transform = `transformDuration:300ms`;
          this.currentShow = "lyric"; //同时改变当前显示状态
        } else {
          offsetWidth = 0;
          opacity = 1;
          this.$refs.middleL.style.opacity = opacity;
          this.$refs.middleL.style.transform = `transformDuration:300ms`;
        }
      }
      //从左向右滑
      else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.$refs.middleL.style.opacity = opacity;
          this.$refs.middleL.style.transform = `transformDuration:300ms`;
          this.currentShow = "img";
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.$refs.middleL.style.opacity = opacity;
          this.$refs.middleL.style.transform = `transformDuration:300ms`;
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`; //vue组件无法直接访问节点，使用$el
      this.touch.initiated = false;
    },

    //显示playlist
    showPlayList() {
      // this.set_fullScreen(true);
      this.set_isShowPlayList(true);
    },

    //添加到喜欢列表
    myLove() {
      //不喜欢变喜欢
      if (this.isLove == "el-icon-star-off") {
        this.isLove = "el-icon-star-on";
        this.set_loveList(this.currentSong);
      } else {
        this.isLove = "el-icon-star-off";
        this.delete_loveList(this.currentSong);
      }
    }
  },
  computed: {
    ...mapGetters([
      "playing", //播放状态
      "fullScreen", //是否全屏
      "playList", //播放列表
      "currentSong", //当前歌曲
      "currentIndex", //当前索引
      "mode", //播放模式
      "sequenceList", //顺序列表
      "isShowPlayList", //playlist的显隐
      "currentSongIsLove" //当前歌曲是否喜欢
    ]),
    isShow() {
      if (this.playList) {
        if (this.playList.length) {
          //播放列表有歌曲，展开播放器，发起请求，请求点击歌曲的详细信息
          this._getKugouMusicPlay();
          return true;
        }
      } else {
        return false;
      }
    },
    percent() {
      return this.currentTime / this.currentSong.duration; //根据当前播放时间来计算进度条百分比
    },
    //播放状态样式
    iconMode() {
      //mode ： 0 顺序播放  1 单曲循环  2 随机播放
      return this.mode === 0
        ? "el-icon-refresh-left"
        : this.mode === 1
        ? "el-icon-refresh"
        : "el-icon-connection";
    }
  },
  watch: {
    fullScreen: function(newVal) {
      newVal == true
        ? (this.fullScreenStyle = "top:0;")
        : (this.fullScreenStyle = "bottom:0;height:0;"); //播放器全屏时的样式
    },
    currentSong(newSong, oldSong) {
      //当playingList或者index改变导致调用此监听，若audio_id不变，即currentSong不变，则不执行播放操作
      if (newSong.audio_id == oldSong.audio_id) {
        return;
      }
      if (this.currentLyrics) {
        this.currentLyrics.stop(); //歌曲改变，将之前的歌词播放定时器停止
      }
      //监听到currentSong数据变化，异步自动播放歌曲
      this.$nextTick(() => {
        if (this.playList.length != 0) {
          this.set_playing(true); //改变vuex中的播放状态
          this.$refs.audio.play(); //播放音乐
          window.scrollTo(0, 0); //将歌词滚动到顶部
        }
      });
      //做判断，如果喜欢列表有则。。。
      this.search_loveSong(this.currentSong.album_audio_id);
      if (this.currentSongIsLove) {
        this.isLove = "el-icon-star-on";
      } else {
        this.isLove = "el-icon-star-off";
      }
    },
    currentSongInfo(newSong, oldSong) {
      if (newSong.audio_id == oldSong.audio_id) {
        return;
      }
      //监听到currentSongInfo数据变化，异步自动播放歌曲
      this.$nextTick(() => {
        if (this.playList.length != 0) {
          this.set_playing(true); //改变vuex中的播放状态
          this.$refs.audio.play(); //播放音乐
          window.scrollTo(0, 0); //将歌词滚动到顶部
        }
      });

      //做判断，如果喜欢列表有则。。。
      this.search_loveSong(this.currentSong.album_audio_id);
      if (this.currentSongIsLove) {
        this.isLove = "el-icon-star-on";
      } else {
        this.isLove = "el-icon-star-off";
      }
    },
    playing(newPlaying) {
      const audio = this.$refs.audio; //缓存audio对象
      if (newPlaying) {
        //播放
        //播放时显示暂停图标  el-icon-video-pause
        this.$refs.togglePlaying.classList = "el-icon-video-pause";
        this.$refs.miniTogglePlaying.classList = "el-icon-video-pause";
        this.imageRotateStop = ""; //图片旋转
        this.$refs.audio.play();
      } else {
        //暂停
        //暂停时显示播放图标   el-icon-video-play
        this.$refs.togglePlaying.classList = "el-icon-video-play";
        this.$refs.miniTogglePlaying.classList = "el-icon-video-play";
        this.imageRotateStop = "animation-play-state: paused;"; //图片暂停旋转
        this.$refs.audio.pause();
      }
    }
  },
  components: {
    progressBar,
    Scroll,
    playlist
  }
};
</script>

<style lang="less" scoped>
.player {
  z-index: 999;
  position: fixed;
  // top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  color: white;
  .normalPlayer {
    text-align: center;

    .bgImage {
      position: absolute;
      z-index: -1;
      background-color: white;
      img {
        width: 100vw;
        height: 100vh;
        filter: blur(
          20px
        ); /* 模糊效果，与宽高搭配做适当调整，把白边推出边界隐藏掉 */
      }
    }

    // 顶部
    .top {
      height: 4.5rem;
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.6),
        rgba(0, 0, 0, 0)
      );
      .back {
        position: fixed;
        .icon-back {
          position: fixed;
          top: 0;
          left: 0.5rem;
          font-size: 2rem;
        }
      }

      .title {
        line-height: 2;
        font-size: 1.2rem;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .subtitle {
        font-size: 1rem;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    //  中部
    .middle {
      width: 202vw;
      .middle-l {
        width: 100vw;
        vertical-align: top;
        display: inline-block;
        transition: all 1s;
        .cd-wrapper {
          .cd {
            .image {
              width: 17rem;
              height: 17rem;
              border: 2px solid gray;
              border-radius: 50%;
              animation: imgRotate 20s linear infinite;
            }
          }
        }
      }
      .middle-r {
        width: 100vw;
        display: inline-block;
        transition: all 1s;
        .lyric-wrapper {
          .text {
            line-height: 2;
            color: rgba(255, 255, 255, 0.5);
            font-size: 1rem;
          }
          // 当前行歌词高亮
          .currentLine {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .wrapper {
        height: 63vh !important;
      }
    }

    // 底部
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 5rem;
      height: 3rem;
      line-height: 3rem;

      .dot-wrapper {
        display: flex;
        justify-content: center;

        .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: white;
          margin-right: 0.5rem;
        }
        .dot:nth-child(1) {
          margin-right: 0.25rem;
        }
        .dot:nth-child(2) {
          margin-left: 0.25rem;
        }
        .active {
          background-color: red;
        }
      }

      ul.operators {
        height: 3rem;
        line-height: 3rem;
        margin: 0 auto;
        display: inline-block;
        li.icon {
          float: left;
          margin-right: 2.5rem;
          font-size: 2rem;
          color: red;
        }
        li.icon:nth-last-child(1) {
          margin-right: 0;
        }
        .i-left {
          .icon-sequence {
          }
          .icon-prev {
          }
        }

        .i-center {
          .icon-play {
          }
        }

        .i-right {
          .icon-next {
          }
          .icon-not-facorite {
          }
        }
      }
      // 进度条和播放时间
      .progress-wrapper {
        display: flex;
        justify-content: space-around;
        color: black;
        .item {
          .item-l {
          }
          .item-r {
          }
        }
        .progress-bar-wrapper {
          flex: 0.8;
          position: relative;
        }
      }
    }
  }

  .miniPlayer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 3.5rem;
    padding-left: 0.5rem;
    background-color: white;
    border-top: 1px solid black;
    display: flex;
    justify-content: flex-start;

    .icon {
      display: block;
      img {
        display: block;
        border-radius: 50%;
        border: 1px solid gray;
        height: 3rem;
        width: 3rem;
        margin: 0.25rem 0;
        display: block;
        animation: imgRotate 20s linear infinite;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 1rem;
      color: black;

      .name {
        font-weight: normal;
        font-size: 1.25rem;
        line-height: 2;
        width: 25vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .desc {
        font-size: 0.8rem;
        width: 25vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: gray;
      }
    }
    .mini-icon {
      margin: auto 0;
      color: gray;
      font-size: 2rem;
      margin-left: 2rem;
    }
    // .mini-icon:nth-of-type(0) {
    //   margin-left: 2rem;
    // }
  }

  // 图片旋转动画
  @keyframes imgRotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  //正常播放器动画切换效果
  .normal-enter-active,
  .normal-leave-active {
    transition: all 1s;
    // .top,
    // .bottom {
    //   transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    // }
  }
  .normal-enter,
  .normal-leave-to {
    opacity: 0;
    // .top {
    //   transform: translate3d(0, -100px, 0);
    // }
    // .bottom {
    //   transform: translate3d(0, 100px, 0);
    // }
  }

  //迷你播放器动画切换效果
}
audio {
  width: 100%;
}
</style>