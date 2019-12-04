<template>
  <div id="app">
    <router-view name="Home"></router-view>
    <router-view name="SingerDetail"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
// @import "./src/common/style/base.less"
@import "./common/style/index.less";

#app {
  color: @color;
}

//vue transition 动画
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
.v-enter-active,
.v-leave-active {
  transition: all .25s ease;
}
</style>>

