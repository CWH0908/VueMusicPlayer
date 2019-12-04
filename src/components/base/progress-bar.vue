<template>
  <!-- 最外层总的长条 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <!-- 里层进度条 -->
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        @touchstart="progressTouchStart"
        @touchmove="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <!-- 按钮-拖动 -->
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //进度条百分比，由播放歌曲的时间得出百分比
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    //维护同一个touch对象,不同回调函数中共享数据
    this.touch = {};
    this.touch.initiated = false;//初始化为 已初始状态，保证歌曲刚加载的时候进度条会走
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && this.touch.initiated == false) {
        //非拖动时进度条随歌曲播放而进行
        const barWidth = this.$refs.progressBar.clientWidth - 16; //减去按钮的宽度
        const offsetWidth = newPercent * barWidth; //得到偏移的宽度

        this._offset(offsetWidth);
      }
    }
  },
  methods: {
    //拖拽进度条
    progressTouchStart(e) {
      this.touch.initiated = true; //表示已初始化
      this.touch.startX = e.touches[0].pageX; //横向坐标
      this.touch.left = this.$refs.progress.clientWidth; //记录按钮偏移位置
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return; //未初始化
      }
      const deltaX = e.touches[0].pageX - this.touch.startX; //偏移量
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - 16,
        Math.max(0, this.touch.left + deltaX)
      ); // 0~this.touch.left+deltaX
      this._offset(offsetWidth);
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      this.triggerPercent();
    },
    //点击进度条
    progressClick(e) {
      //当点击了 按钮本身时，offsetX获取错误，不能取e.offsetX
      // this._offset(e.offsetX);
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      this.triggerPercent();
    },
    //设置偏移量
    _offset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + "px"; //进度条进行偏移
      this.$refs.progressBtn.style.left = offsetWidth + 8 + "px"; //按钮进行偏移
    },
    //联动到歌曲播放进度改变
    triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - 16; //减去按钮的宽度
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent); //拖动完成时抛出 百分比改变的时间，联动到歌曲播放进度改变
    }
  }
};
</script>

<style lang="less" scoped>
.progress-bar {
  position: relative;
  height: 30px;
  top: 0.5rem;
  .bar-inner {
    position: absolute;
    width: 100%;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.8);
    .progress {
      position: absolute;
      height: 100%;
      background-color: red;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      //   left: 0;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        touch-action: 7px;
        top: 0.4rem;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid red;
        border-radius: 50%;
        background-color: red;
      }
    }
  }
}
</style>