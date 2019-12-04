<template>
  <div>
    <music-list :bgImage="singer.picUrl" :songs="songs" :title="singer.name"></music-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; //vuex取数据的语法糖
import { mapMutations } from "vuex";

import { getSingerDetail } from "../../api/singer";

import { getSongVkey, createSong } from "../../api/song";

import musicList from "../../components/music-list/music-list";

import axios from "axios";

export default {
  created() {
    this._getSingerDetail();
  },
  data() {
    return {
      songs: [],
      picUrl: ""
    };
  },
  methods: {
    async _getSingerDetail() {
      if (!this.singer.id) {
        //当用户刷新页面时，歌手的id被清除，路由调回歌手页面
        this.$router.push("/singer");
      } else {
        // let songData = await getSingerDetail(this.singer.id);
        this.songs = this._normalizeSongs(
          await getSingerDetail(this.singer.id)
        ); //将请求的歌手的歌曲信息格式化
      }
    },
    //格式化请求回来的歌曲信息
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(async item => {
        let musicData = item.musicData;
        //------------- 更新的加上vkey
        let res = await getSongVkey(musicData.songmid);
        const songVkey = res.data.items[0].vkey;
        //这两个id是必须的，有这两个id值才创建一个歌曲条目// && songVkey != ""
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, songVkey));
        }
      });
      console.log(ret);
      return ret;
    },
    //改变vuex中singer的picUrl的大小
    ...mapMutations({
      setSinger: "set_singer"
    })
  },
  watch: {
    $route() {
      if (
        this.$route.path == "/home/singer" ||
        this.$route.path == "/home/rank" ||
        this.$route.path == "/home/search" ||
        this.$route.path == "/home/recommend"
      ) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  },
  computed: {
    ...mapGetters(["singer"])
  },
  mounted() {
    //调用函数，改变vuex中singer对象的picUrl属性
    var reg = /150x150/g;
    this.singer.picUrl = this.singer.picUrl.replace(reg, "300x300");
    this.setSinger(this.singer);
    console.log("打印singer");
    console.log(this.singer);
    console.log(this.$store.state.singer);
  },
  components: {
    "music-list": musicList
  }
};
</script>

<style lang="less" scoped>

</style>