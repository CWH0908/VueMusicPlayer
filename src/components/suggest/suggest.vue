<template>
  <scroll
    class="suggest"
    :data="searchList"
    :pullup="true"
    :beforeScroll="true"
    @beforeScroll="listScroll"
    @scrollToEnd="searchMore"
  >
    <ul class="suggest-list" :style="setPaddingBottom">
      <li
        v-show="searchList.length>0"
        class="suggest-item"
        v-for="(item,index) in searchList"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i class="el-icon-video-play"></i>
        </div>
        <div class="name">
          <p class="text">{{item.filename}}</p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script>
import scroll from "../base/scroll";
import { mapGetters } from "vuex";

export default {
  props: {
    searchList: {
      type: Array,
      default: () => {}
    }
  },
  components: {
    scroll
  },
  methods: {
    searchMore() {
      this.$emit("searchMore");
    },
    selectItem(item) {
      this.$emit("selectItem", item);
    },
    listScroll() {
      this.$emit("blurInput");
    }
  },
  watch: {
    fullScreen: function(newVal) {
      newVal == true
        ? (this.setPaddingBottom = "")
        : (this.setPaddingBottom = "padding-bottom:3.5rem");
    }
  },
  computed: {
    ...mapGetters(["playList", "fullScreen"]),
    setPaddingBottom: {
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
.suggest {
  height: 77vh !important;
  .suggest-list {
    padding-bottom: 4.5rem;
    .suggest-item {
      text-align: left;
      height: 3rem;
      padding-left: 1rem;
      .icon {
        display: inline-block;
        vertical-align: top;
      }
      .name {
        display: inline-block;
        width: 80vw;
        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>