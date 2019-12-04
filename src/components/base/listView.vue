<template>
  <!-- 此处的：data为scroll绑定的watch属性，监听到data的变化而调用scroll的refresh函数 -->
  <scroll
    class="listView"
    :data="data"
    ref="listView"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul class="listViewUl">
      <li ref="listGroup" class="listViewLi" v-for="item in data" :key="item.title">
        <h3 class="itemTitle">{{item.title}}</h3>
        <ul>
          <li
            @click="goTo(childItem)"
            v-for="childItem in item.items"
            :key="childItem.id"
            :data-id="item.Fsinger_id"
          >
            <img v-lazy="childItem.picUrl" />
            <span>{{childItem.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 右侧字母导航条 -->
    <nav class="rightBarNav">
      <ul
        class="rightBarUl"
        @touchstart="touchShortCut"
        @touchmove.stop.prevent="touchmoveShortCut"
      >
        <li
          v-for="(item,index) in shortCutList"
          :key="item.title"
          :data-index="index"
          :class="{'currentIndex':currentIndex===index}"
        >
          <span :data-index="index" class="itemTitle">{{item.title.charAt(0)}}</span>
        </li>
      </ul>
    </nav>
  </scroll>
</template>

<script>
import scroll from "../../components/base/scroll";
import { getDomData } from "../../api/getDomData"; //引入获取dom节点自定义属性的函数
export default {
  created() {
    //由于不需要观测touch初始值的变换，所以不用把touch放到data里，而是在created周期时获取一次即可
    this.touch = {}; //中间变量，让touchShortCut函数和touchShortCut函数之间 touch 数据 可以沟通

    this.listenScroll = true;

    this.listHeight = []; //每个li的高度

    this.probeType = 3; //不节流的滑动方式，包含swipper
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0 //默认 li[0] 高亮
    };
  },
  props: {
    data: {
      //负责从父组件中接收歌手信息
      type: Array,
      default: []
    }
  },
  components: {
    scroll
  },
  methods: {
    //触摸导航条事件
    touchShortCut(e) {
      let liIndex = getDomData(e.target, "index");

      let firstToucch = e.touches[0]; //初始touch的位置
      this.touch.y1 = firstToucch.pageY; //保存在this.touch中
      this.touch.liIndex = liIndex; //初始锚点
      this._scrollTo(liIndex);
    },
    //滑动导航条事件
    touchmoveShortCut(e) {
      //根据滚动距离来确定滚动到的位置
      let firstToucch = e.touches[0]; //初始touch的位置
      this.touch.y2 = firstToucch.pageY; //保存在this.touch中
      let delta = ((this.touch.y2 - this.touch.y1) / 18).toFixed(0); //滑动导航条，y轴上偏移的距离
      //根据每个锚点的高度来确定偏移距离偏移了多少个li,这里导航条每个li的高度是18px,toFixed函数四舍五入
      //注意，转成Number类型
      let liIndex = parseInt(this.touch.liIndex) + parseInt(delta); //根据初始的锚点加上偏移的锚点数，得到偏移后的锚点
      //   this.$refs.listView.scrollToElement(this.$refs.listGroup[liIndex], 0); //滚动
      this._scrollTo(liIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
      this.currentIndex = parseInt(index);
    },
    scroll(pos) {
      //触摸滚动事件
      this.scrollY = pos.y; //获取better-scroll 滚动的y轴的距离
    },
    //计算每个字母歌手组li的高度clientHeight
    _calculateHeight() {
      this.listHeight = []; //每次调用重新初始化每个li的高度(data数据变化)
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height); //初始高度为0
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        //由于字母排序，li的高度应该是累加的，即之前li的高度要加上去，所以每次得到li的高度，都要存进listHeight数组
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    goTo(singer) {
      //点击的li传出，以供父组件调用
      this.$emit("goTo", singer);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight(); //data数据得到后，延迟调用计算高度的函数，确保数据能得到
      }, 20);
    },
    scrollY(newY, oldY) {
      //对比scrollY和listHeight就可以得到liIndex的值
      const listHeight = this.listHeight; //先保留数据
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]; //下限 0
        let height2 = listHeight[i + 1]; //上限 最后一个li(最大高度)
        //-newY才是正值!height2 ||
        if (-newY > height1 && -newY < height2) {
          //代表在区间范围内滚动(在height1和height2区间内)
          this.currentIndex = i;
          return;
        }
        // this.currentIndex = 0;
      }
    }
  },
  computed: {
    shortCutList() {
      return this.data;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../common/style/variable.less";
.listView {
  .listViewUl {
    .listViewLi {
      list-style-type: none;
      .itemTitle {
        position: sticky;
        height: 30px;
        line-height: 1.5;
        padding-left: 0.8rem;
        font-weight: normal;
        // margin: 0.8rem 0;
        // background-color: rgba(0, 0, 0, 0.8);
        background-color: #e20000;
        color: white;
      }
      ul {
        li {
          list-style-type: none;
          box-sizing: border-box;
          height: 80px;
          padding: 0.3rem 0.8rem;
          img {
            display: inline-block;
            vertical-align: middle;
            width: 20%;
            border-radius: 50%;
          }
          span {
            padding-left: 1rem;
          }
        }
      }
    }
  }
}
.rightBarNav {
  position: absolute;
  top: 10%;
  right: 0;

  .rightBarUl {
    li {
      width: 1.5rem;
      line-height: 1.5;
      height: 18px;
      text-align: center;
      font-size: 0.2rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
    }
  }
}
//右侧字母导航条li高亮
.currentIndex {
  background-color: rgba(255, 0, 0, 0.8) !important;
}
</style>