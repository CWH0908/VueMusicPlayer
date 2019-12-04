<template>
  <div id="headerBar" class="headerBar">
    <img class="header_logo" src="../../common/images/musicLogo.png" alt="天天好听~" />
    <div class="header_text">myMusic</div>
    <router-link class="myLove" :to="{name:'myLove'}" tag="div" exact>
      <i class="el-icon-star-on"></i>
    </router-link>
    <router-view name="myLove"></router-view>
  </div>
</template>

<script>
import Tab from "../../components/base/tab";
export default {
  data() {
    return {};
  },
  components: {
    Tab
  }
};
</script>

<style lang="less" scoped>
@import "../../common/style/variable.less";
.headerBar {
  position: relative;
  line-height: 2.2;
  height: 6vh;
  margin: 0 auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: @color;
}
.header_logo {
  width: 30px;
  vertical-align: middle;
}
.header_text {
  display: inline-block;
  font-family: "幼圆";
  font-size: @font-size-medium;
  color: white;
}
.goBack {
  display: inline-block;
  position: absolute;
  top: 0.5rem;
  left: 0;
  font-size: 1.5rem;
  color: white;
}

.myLove {
  font-size: 2rem;
  position: absolute;
  top: -1rem;
  right: 0;
  color: red;
}

//vue transition 动画
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.25s ease;
}
</style>