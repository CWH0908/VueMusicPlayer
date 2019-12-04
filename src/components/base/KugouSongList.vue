<template>
  <div class="songList">
    <ul v-if="songs" :style="isPaddingBottom">
      <li @click="selectItem(item,index)" v-for="(item,index) in songs" :key="'info-'+index">
        <div class="container">
          <h2 class="name">
            <span v-if="$route.params.rank" class="rankSpan">
              <img v-if="index==0" src="../../common/images/first.png" />
              <img v-if="index==1" src="../../common/images/second.png" />
              <img v-if="index==2" src="../../common/images/third.png" />
              <span style="font-weight:bold;" v-if="index>2">{{index+1 | indexFilter}}</span>
            </span>
            <span style="font-weight:bold;" v-else>{{index+1 | indexFilter}}&nbsp;&nbsp;</span>
            {{item.filename}}
          </h2>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    songs: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index); //让父组件去处理
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
  },
  watch: {
    //   使用路由参数时，例如从 /user/foo 导航到 /user/bar，
    //   原来的组件实例会被复用。因为两个路由都渲染同个组件，
    //   比起销毁再创建，复用则显得更加高效。
    //   不过，这也意味着组件的生命周期钩子不会再被调用。
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
    ...mapGetters(["playList", "fullScreen"]),
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
  }
};
</script>

<style lang="less" scoped>
.songList {
  .container {
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid gray;
    .name {
      width: 90vw;
      font-weight: normal;
      line-height: 1.5;
      font-size: 1.2rem;
      // margin-bottom: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .rankSpan {
        width: 3rem;
        display: inline-block;
        text-align: left;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: gray;
    }
  }
}
.songListUl {
  padding-bottom: 4.5rem; //迷你播放器时歌单歌曲列表留出4.5rem的内下边距，防止被遮挡
}
</style>