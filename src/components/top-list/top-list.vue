<template>
  <div class="top-list">
    <KugoumusicList
      :bgImage="this.$route.params.imgurl"
      :songs="kugouRankList"
      :title="this.$route.params.specialname"
    ></KugoumusicList>
  </div>
</template>

<script>
import KugoumusicList from "../../components/music-list/KugouMusic-list";
import { getKugouRankDetailList } from "../../api/kugouRank"; //获取排行榜歌单的歌曲

import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      specialid: this.$route.params.id, //传入的歌单id，以发送axios请求，获取该排行榜歌单下的所有歌曲
      kugouRankList: []
    };
  },
  created() {
    this._getKugouDiscList();
  },
  methods: {
    async _getKugouDiscList() {
      if (!this.$route.params.imgurl && !this.$route.params.specialname) {
        //刷新页面导致params数据丢失，返回到排行榜
        this.$router.push("/home/rank");
      }

      this.kugouRankList = await getKugouRankDetailList(this.specialid);
      this.kugouRankList = this.kugouRankList.list;

      this.setRankList(this.kugouRankList); //vuex设置歌单数据
    },

    //设置歌单
    ...mapMutations({
      setRankList: "setRankList" //设置歌单信息
    })
  },
  components: {
    KugoumusicList
  },
  computed: {
    //   所需参数已用路由传递，此处可忽略
    ...mapGetters(["rankList"])
  }
};
</script>

