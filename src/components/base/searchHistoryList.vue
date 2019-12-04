<template>
  <div class="historyList">
    <div class="text">
      搜索历史
      <span>
        <i class="el-icon-delete" @click="deleteAll"></i>
      </span>
    </div>
    <ul>
      <li v-for=" (item,index) in histyList" :key="index" @click="selectHistorySong(item)">
        {{item}}
        <span>
          <i class="el-icon-circle-close" @click.stop="delete_searchHistory(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    searchHistory: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      histyList: []
    };
  },
  created() {
    let list = JSON.parse(JSON.stringify(this.searchHistory));
    list.reverse();
    for (let i = 0; i < list.list; i++) {
      //打字太快请求空数据
      if (list[i].length == 0) {
        list.splice(i, 1);
      }
    }
    this.histyList = list;
  },
  watch: {
    searchHistory() {
      let list = JSON.parse(JSON.stringify(this.searchHistory));
      list.reverse();
      for (let i = 0; i < list.list; i++) {
        //打字太快请求空数据
        if (list[i].length == 0) {
          list.splice(i, 1);
        }
      }
      this.histyList = list;
    }
  },
  methods: {
    deleteAll() {
      this.$confirm("是否清空搜索历史?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info ",
        center: true,
        showClose: false,
        customClass: "mystyle"
      }).then(() => {
        this.deleteAll_searchHistory(); //清空搜索历史
        this.$message({
          type: "success",
          message: "已清空!"
        });
      });
    },
    //选择搜索这首历史歌曲
    selectHistorySong(item){
      this.$emit("selectHistorySong",item)
    },
    ...mapMutations(["delete_searchHistory", "deleteAll_searchHistory"])
  }
};
</script>

<style lang="less" >
.historyList {
  .text {
    position: relative;
    span {
      position: absolute;
      right: 1rem;
      font-size: 1rem;
    }
  }
  ul {
    li {
      height: 3.3rem;
      line-height: 3.3rem;
      text-align: left;
      padding-left: 0.8rem;
      border-bottom: 1px solid gray;
      position: relative;
      span {
        position: absolute;
        right: 1rem;
        font-size: 1rem;
      }
    }
  }
}
.mystyle {
  padding-bottom: 30px;
  margin-top: 10% !important;
  width: 70%;
}
</style>