// 此函数  定义  需要取得的数据的名称，通过传入 state 状态库，然后返回特定的数据。
export const singer = (state) => {
  return state.singer
};

// playing: false, //播放状态
// fullScreen: false, //是否全屏
// playList: [], //播放列表
// sequenceList: [], //顺序列表
// mode: 0, //0 顺序播放  1 单曲循环  2 随机播放
// currentIndex :-1,//当前播放曲目
export const playing = (state) => {
  return state.playing
};
export const fullScreen = (state) => {
  return state.fullScreen
};
export const playList = (state) => {
  return state.playList
};
export const sequenceList = (state) => {
  return state.sequenceList
};
export const mode = (state) => {
  return state.mode
};
export const currentIndex = (state) => {
  return state.currentIndex
};
//由计算得来当前播放曲目 currentSong
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
};

//返回 歌单 列表信息
export const disc = (state) => {
  return state.disc || {}
};

//返回 排行榜歌单 列表信息
export const rankList = (state) => {
  return state.rankList || {}
};

//返回 搜索历史 信息
export const searchHistory = (state) => {
  return state.searchHistory || []
};

//返回playlist显隐状态
export const isShowPlayList =(state)=>{
  return state.isShowPlayList;
}

//返回loveList 数组
export const loveList =(state)=>{
  return state.loveList;
}

export const currentSongIsLove =(state)=>{
  return state.currentSongIsLove;
}


