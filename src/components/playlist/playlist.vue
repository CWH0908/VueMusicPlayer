<template>
  <transition appear mode="out-in">
    <div class="playlist" v-show="isShowPlayList" @click.self="set_isShowPlayList(false);">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i @click="modeChange" :class="iconMode"></i>
            <span class="text">{{modeType}}</span>
            <span class="clear" @click.stop="deleteAll">
              <i class="el-icon-delete"></i>
            </span>
          </h1>
        </div>

        <scroll :data="sequenceList" ref="listContent">
          <div class="list-content">
            <transition-group tag="ul" appear mode="out-in" name="listClass">
              <li
                ref="listItem"
                class="item"
                v-for="(item,index) in playList"
                :key="index+item.album_id"
                :style="isRedStyle(item)"
                @click="selectItem(item,index)"
              >
                <span class="play">
                  <i style="vertical-align:top;" :class="getCurrentIcon(item)"></i>
                </span>
                <span class="text">{{item.filename}}</span>
                <span class="like" @click.stop="myLove(item,index)">
                  <i
                    :data-currentSong="JSON.stringify(item)"
                    :data-index="index"
                    ref="isLoveSong"
                    class="el-icon-star-off"
                    style="color:red"
                  ></i>
                </span>
                <span class="delete" @click.stop="deleteOne(item)">
                  <i class="el-icon-circle-close"></i>
                </span>
              </li>
            </transition-group>
          </div>
        </scroll>

        <div class="list-close" @click="set_isShowPlayList(false);">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import scroll from "../base/scroll";

export default {
  props: {},
  data() {
    return {
      modeType: "",
      isLove: "el-icon-star-off" //默认不喜欢
    };
  },
  methods: {
    //切换播放模式
    modeChange() {
      this.$emit("modeChange");
    },

    //关闭
    ...mapMutations({
      set_isShowPlayList: "set_isShowPlayList",
      set_currentIndex: "set_currentIndex",
      set_playing: "set_playing",
      set_playList: "set_playList",
      set_loveList: "set_loveList",
      search_loveSong: "search_loveSong",
      delete_loveList: "delete_loveList"
    }),
    ...mapActions({
      deleteSong: "deleteSong",
      deleteSongList: "deleteSongList"
    }),

    //根据当前播放歌曲显示播放图标
    getCurrentIcon(item) {
      if (item.album_audio_id == this.currentSong.album_audio_id) {
        return "el-icon-video-pause";
      } else {
        return "el-icon-video-play";
      }
    },

    //根据当前播放歌曲 标红
    isRedStyle(item) {
      if (item.album_audio_id == this.currentSong.album_audio_id) {
        return "color:#DAA520;";
      }
    },

    //点击歌曲跳转播放
    selectItem(item, index) {
      //随机播放
      if (this.mode == 2) {
        //找到当前歌曲在播放列表中的 索引
        index = this.playList.findIndex(song => {
          return song.album_audio_id == item.album_audio_id;
        });
      }
      this.set_currentIndex(index); //设置歌曲索引
      this.set_playing(true); //设置播放状态为true(暂停状态下切歌)
    },

    //将列表滚动到当前播放歌曲
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.album_audio_id == song.album_audio_id;
      });
      this.$nextTick(() => {
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300); //滚动到指定li
      });
    },

    //删除播放列表的一首歌曲
    deleteOne(item) {
      this.deleteSong(item);
    },

    //清空播放列表
    deleteAll() {
      this.$confirm("是否清空播放列表?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info ",
        center: true,
        showClose: false,
        customClass: "mystyle"
      }).then(() => {
        this.deleteAll_playlist(); //清空播放列表
        this.$message({
          type: "success",
          message: "已清空!"
        });
      });
    },

    deleteAll_playlist() {
      this.deleteSongList();
    },

    //添加到喜欢列表
    myLove(item, index) {
      let isLoveSong = this.$refs.isLoveSong;
      //不喜欢变喜欢
      if (isLoveSong[index].classList.contains("el-icon-star-off")) {
        isLoveSong[index].classList.remove("el-icon-star-off");
        isLoveSong[index].classList.add("el-icon-star-on");
        this.set_loveList(item);
      } else {
        isLoveSong[index].classList.remove("el-icon-star-on");
        isLoveSong[index].classList.add("el-icon-star-off");
        this.delete_loveList(item);
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
      "isShowPlayList", //playList的显隐
      "loveList",
      "currentSongIsLove" //当前歌曲是否喜欢
    ]),

    //播放状态样式
    iconMode() {
      //mode ： 0 顺序播放  1 单曲循环  2 随机播放
      if (this.mode === 0) {
        this.modeType = "顺序播放";
        return "el-icon-refresh-left";
      } else if (this.mode === 1) {
        this.modeType = "单曲循环";
        return "el-icon-refresh";
      } else {
        this.modeType = "随机播放";
        return "el-icon-connection";
      }
    }
  },

  components: {
    scroll
  },

  watch: {
    playList(newVal) {
      //根据loveList喜欢歌曲列表，将喜欢的歌曲的 * 设为选中。
      this.$nextTick(() => {
        let isLoveSong = this.$refs.isLoveSong;
        for (let i = 0; i < isLoveSong.length; i++) {
          let currentSong = JSON.parse(
            isLoveSong[i].getAttribute("data-currentSong")
          );
          this.search_loveSong(currentSong.album_audio_id);
          if (this.currentSongIsLove) {
            isLoveSong[i].classList.remove("el-icon-star-off");
            isLoveSong[i].classList.add("el-icon-star-on");
          } else {
            isLoveSong[i].classList.remove("el-icon-star-on");
            isLoveSong[i].classList.add("el-icon-star-off");
          }
        }
      });
    },
    loveList() {
      //根据loveList喜欢歌曲列表，将喜欢的歌曲的 * 设为选中。
      this.$nextTick(() => {
        let isLoveSong = this.$refs.isLoveSong;
        for (let i = 0; i < isLoveSong.length; i++) {
          let currentSong = JSON.parse(
            isLoveSong[i].getAttribute("data-currentSong")
          );
          this.search_loveSong(currentSong.album_audio_id);
          if (this.currentSongIsLove) {
            isLoveSong[i].classList.remove("el-icon-star-off");
            isLoveSong[i].classList.add("el-icon-star-on");
          } else {
            isLoveSong[i].classList.remove("el-icon-star-on");
            isLoveSong[i].classList.add("el-icon-star-off");
          }
        }
      });
    },
    //切换歌曲时，将播放列表滚动到当前歌曲
    currentSong(newSong, oldSong) {
      if (newSong.album_audio_id == oldSong.album_audio_id) {
        //单曲循环时不变
        return;
      } else {
        this.scrollToCurrent(newSong);
        this.$refs.listContent.refresh();
      }
    },
    isShowPlayList(newVal) {
      this.$nextTick(() => {
        this.scrollToCurrent(this.currentSong);
        this.$refs.listContent.refresh();
      });
    }
  }
};
</script>

<style lang="less" >
.playlist {
  position: absolute;
  top: -100vh;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  color: #5f9ea0;
  z-index: 999;
  .list-wrapper {
    position: absolute;
    bottom: 0;
    height: 50vh;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    .list-header {
      .title {
        font-size: 1.2rem;
        height: 2rem;
        line-height: 2rem;
        padding-left: 1rem;
        .text {
        }
        .clear {
          position: absolute;
          right: 1rem;
        }
      }
    }
    .wrapper {
      height: 36vh !important;
    }
    .list-content {
      position: relative;

      transition-duration: 0ms;
      transform: translate(0px, 0px) scale(1) translateZ(0px);
      transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
      ul {
        overflow: hidden;
        li.item {
          height: 1.5rem;
          line-height: 1.5rem;
          padding-left: 0.2rem;
          .current {
          }
          .play {
            display: inline-block;
          }
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 75vw;
            display: inline-block;
          }
          .like {
            position: absolute;
            right: 1rem;
            margin-right: 2rem;
            color: white;
          }
          .delete {
            position: absolute;
            right: 1rem;
            color: white;
          }
        }
      }
    }

    // .list-operate {
    //   position: absolute;
    //   bottom: 3.2rem;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 100%;
    //   text-align: center;
    //   .add {
    //     .text {
    //       height: 2rem;
    //       line-height: 2rem;
    //       padding: 0.3rem 0.5rem;
    //       border-radius: 20px;
    //       border: 1px solid gray;
    //     }
    //   }
    // }

    .list-close {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 3.5rem;
      line-height: 3.5rem;
      text-align: center;
      font-size: 1.5rem;
      background-color: rgba(0, 0, 0, 0.8);
      span {
      }
    }
  }
}
//删除动画效果
.listClass-enter-active,
.listClass-leave-active {
  transition: all 0.1s;
}
.listClass-enter,
.listClass-leave-to {
  height: 0;
}
.mystyle {
  padding-bottom: 30px;
  margin-top: 10% !important;
  width: 70%;
}
</style>
