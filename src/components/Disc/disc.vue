<template>
  <div class="disc">
    <KugoumusicList
      :bgImage="this.$route.params.imgurl"
      :songs="disc.info"
      :title="this.$route.params.specialname"
    ></KugoumusicList>
  </div>
</template>

<script>
import KugoumusicList from "../../components/music-list/KugouMusic-list";
import { getKugouDiscList } from "../../api/kugouDisc"; //获取歌单下的歌曲

import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      specialid: this.$route.params.id, //传入的歌单id，以发送axios请求，获取该歌单下的所有歌曲
      kugouDiscList: []
    };
  },
  created() {
    this._getKugouDiscList();
  },
  methods: {
    async _getKugouDiscList() {
      if (!this.$route.params.imgurl && !this.$route.params.specialname) {
        //刷新页面导致params数据丢失，返回到推荐页
        this.$router.push("/home/recommend");
      }

      this.kugouDiscList = await getKugouDiscList(this.specialid);
      this.setDisc(this.kugouDiscList); //vuex设置歌单数据
    },

    //设置歌单
    ...mapMutations({
      setDisc: "set_disc" //设置歌单信息
    })
  },
  components: {
    KugoumusicList
  },
  computed: {
    ...mapGetters(["disc"])
  },

};
</script>

<style>
.disc {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  color: black;
  background-color: white;
}
</style>