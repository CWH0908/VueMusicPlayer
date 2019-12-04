//state 代表状态，把需要存储的数据定义在这里
const state = {
  singer: {}, //定义QQ音乐 歌手 信息的对象 

  //播放器内核 数据状态
  playing: false, //播放状态
  fullScreen: false, //是否全屏
  playList: [], //播放列表
  sequenceList: [], //顺序列表
  mode: 0, //0 顺序播放  1 单曲循环  2 随机播放
  currentIndex: -1, //当前播放曲目

  disc: {}, //歌单对象

  rankList: {}, //排行榜歌单对象

  searchHistory: [], //搜索历史数组

  isShowPlayList: false, //显示playlist组件

  loveList: [], // 喜欢列表

  currentSongIsLove:false,//当前歌曲是否喜欢
}

export default state;
