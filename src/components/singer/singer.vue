<template>
  <div>
    <transition appear mode="out-in">
      <router-view name="SingerDetail"></router-view>
    </transition>
    <listView
      class="flexUl"
      v-loading="!singerData.length"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0.8)"
      element-loading-customClass="loadingCustomClass"
      style="position:relative;min-height:50vh;font-size:1rem"
      v-show="isShow"
      :data="singerData"
      @goTo="goToSingerDetail"
    ></listView>
  </div>
</template>

<script>
import axios from "axios";
import { getSingerList } from "../../api/singer";
import listView from "../base/listView";

import { getKugouSingerList } from "../../api/kugouSinger";

import { mapMutations } from "vuex"; //vuex提交数据的语法糖

export default {
  created() {
    this._getSingerList(); //获取qq音乐歌手列表
    this._getKugouSingerList(); //获取酷狗的歌手列表
  },
  watch: {
    singerLister() {
      this.normalizeSinger(this.singerLister);
    },
    $route(to, from) {
      /*
        当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。
        因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
        不过，这也意味着组件的生命周期钩子不会再被调用。
        复用组件时，想对路由参数的变化作出响应的话，
        可以简单地 watch (监测变化) $route 对象：
      */
      // if (from.path !== "/home/singer") {
      //   //表示从别的路由跳到/singer，显示歌手信息
      //   this.isShow = true;
      // } else {
      //   //表示从/singer跳到别的路由，隐藏歌手信息
      //   this.isShow = false;
      // }
    }
  },
  data() {
    return {
      singerLister: [],
      hot: [],
      zimu: [],
      singerData: [], //用于存放hot和zimu的合并数组
      isShow: true
    };
  },
  methods: {
    //获取酷狗的歌手列表
    async _getKugouSingerList() {
      this.kugouSingerLister = await getKugouSingerList();
    },

    async _getSingerList() {
      this.singerLister = await getSingerList();
    },

    //格式化请求回来的歌手数据，重新封装好我们所需要的数据的格式
    normalizeSinger(list) {
      let map = {
        hot: {
          //热门数据
          title: "热门",
          items: []
        }
      };

      list.forEach((item, index) => {
        //遍历list，将数据填充到热门歌手的数组里
        if (index < 10) {
          //把前10条数据作为热门歌手的数据
          map.hot.items.push({
            id: item.Fsinger_mid, //歌手id
            name: item.Fsinger_name, //歌手名称
            picUrl:
              "http://y.gtimg.cn/music/photo_new/T001R150x150M000" +
              item.Fsinger_mid +
              ".jpg?max_age=2592000" //歌手头像地址
          });
        }

        //歌手开头字母
        const key = item.Findex;
        if (!map[key]) {
          //用来存储歌手开头字母A、B、C......的歌手信息
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push({
          id: item.Fsinger_mid, //歌手id
          name: item.Fsinger_name, //歌手名称
          picUrl:
            "http://y.gtimg.cn/music/photo_new/T001R150x150M000" +
            item.Fsinger_mid +
            ".jpg?max_age=2592000" //歌手头像地址
        });
      });

      //由于这种直接在data中添加的map是一个对象，而对象的遍历是无序的，无法得到A~Z的排列，所以需要对其进行排序处理
      // this.map = map;
      let hot = [];
      let zimu = [];
      for (let item in map) {
        if (map[item].title == "热门") {
          hot.push(map[item]);
        } else if (map[item].title.match(/[a-zA-Z]/)) {
          //是字母的
          zimu.push(map[item]);
        }
      }
      //对字母数组数据进行排序,用title做比较
      zimu.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      this.hot = hot;
      this.zimu = zimu;
      this.singerData = this.hot.concat(this.zimu); //合并数据
    },

    goToSingerDetail(singer) {
      this.isShow = false; //隐藏歌手列表
      //编程式路由跳转
      this.$router.push({
        name: "SingerDetail",
        // path:'/singer/:'+singer.id,
        params: {
          id: singer.id
        }
      });
      this.setSinger(singer); //使用mutation(改变),将数据提交到 state (状态库)
    },

    ...mapMutations({
      setSinger: "set_singer"
    })
  },
  components: {
    listView
  }
};
</script>

<style lang="less" scoped>
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