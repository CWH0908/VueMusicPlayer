<template>
  <div class="search">
      <search-box @inputValue="inputValue"></search-box>
  </div>
</template>

<script>
import searchBox from "../base/search-box"

export default {
  components:{
    searchBox,
  },
  methods: {
    inputValue(newVal){
      // console.log("查找",newVal)
    }
  },
}
</script>

<style>

</style>