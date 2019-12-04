<template>
  <div>
    <ul class="navBar" v-show="isShowNav">
      <router-link :to="{name:'Recommend'}" tag="li">推荐</router-link>
      <router-link :to="{name:'Singer'}" tag="li">歌手</router-link>
      <router-link :to="{name:'Rank'}" tag="li">排行</router-link>
      <router-link :to="{name:'Search'}" tag="li">搜索</router-link>
    </ul>
    <keep-alive>
      <transition appear mode="out-in">
        <router-view name="Recommend"></router-view>
        <router-view name="Rank"></router-view>
        <router-view name="Singer"></router-view>
        <router-view name="Search"></router-view>
        <router-view name="Test"></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import Test from "../../components/test";

export default {
  data() {
    return {
      isShowNav:true
    };
  },
  watch: {
    $route(newVal) {
      if (newVal.name == "rankList") {
        this.isShowNav = false;
      } else {
        this.isShowNav = true;
      }
    }
  },
  components: {
    Test
  }
};
</script>

<style lang="less" scoped>
.navBar {
  height: 4vh;
  line-height: 1;
  margin: 8px 0;
}
.navBar li {
  float: left;
  width: 24%;
  box-sizing: border-box;
  margin-right: 1%;
  padding-bottom: 4px;
  line-height: 1.5;
  list-style-type: none;
  text-align: center;
}
.navBar li:nth-last-child(1) {
  // 不起效果
  margin-right: 0;
}
</style>