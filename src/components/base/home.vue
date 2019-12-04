<template>
  <div>
    <m-header v-show="isShowHeader"></m-header>
    <Tab></Tab>
    <player></player>
  </div>
</template>

<script>
import MHeader from "../../components/base/m-header";
import Tab from "../../components/base/tab";
import player from "../../components/player/player";
export default {
  data() {
    return {
      isShowHeader: true
    };
  },
  watch: {
    $route(newVal) {
      if (newVal.name == "rankList") {
        this.isShowHeader = false;
      } else {
        this.isShowHeader = true;
      }
    }
  },
  components: {
    MHeader,
    Tab,
    player
  }
};
</script>

<style>
</style>