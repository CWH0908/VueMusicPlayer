<template>
  <div ref="wrapper" class="wrapper" :style="heightStyle">
    <!-- 需要滚动的节点放置在此插槽中 -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      //监听滚动事件=》导航条联动，当前li高亮
      type: Boolean,
      default: false
    },
    pullup: {
      //上拉加载
      type: Boolean,
      default: false
    },
    beforeScroll: {
      //滚动时取消搜索框的焦点
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      heightStyle: "height:88vh;",
      isRankList: false //是否是排行歌单歌曲组件
    };
  },
  mounted() {
    //定时器确保页面节点已渲染完成
    setTimeout(() => {
      this._initScroll();
    }, 20);
    if (this.playList) {
      if (this.playList.length) {
        this.fullScreen
          ? (this.heightStyle = "height:88vh;")
          : (this.heightStyle = "height:77vh;");
      }
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      if (this.listenScroll) {
        //监听scroll的滚动事件
        let _this = this; //保存vue实例的this
        this.scroll.on("scroll", pos => {
          _this.$emit("scroll", pos);
        });
      }

      //拓展，上拉加载
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            //即将拉到底时触发
            this.$emit("scrollToEnd");
          }
        });
      }

      //拓展，取消搜索框焦点
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      //刷新，重新计算高度
      this.scroll && this.scroll.refresh();
    },

    //拓展，可以滚动到指定高度
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      //观察data变化，refresh函数重新计算scroll
      setTimeout(() => {
        this.refresh();
      }, 20);
    },
    fullScreen: function(newVal) {
      newVal
        ? (this.heightStyle = "height:88vh;")
        : (this.heightStyle = "height:78vh;");
    },
    playList:function(newVal){
      if(newVal.length==0){
        this.heightStyle = "height:88vh;"
      }else{
        this.heightStyle = "height:78vh;"
      }
    }
  },
  computed: {
    ...mapGetters(["playList", "fullScreen"])
  }
};
</script>

<style scoped>
.wrapper {
  /* position: absolute;
  left: 0;
  top: 13vh; */
  overflow: hidden;
  width: 100%;
  /* height: 88vh; */
}
</style>