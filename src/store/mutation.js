//mutation 代表改变，只可以通过这里面定义的函数来提交数据
const mutations = {
  //所有函数传入的第一个参数为 state (状态)
  set_singer(state, singer) {
    state.singer = singer;
  },

  // playing: false, //播放状态
  // fullScreen: false, //是否全屏
  // playList: [], //播放列表
  // sequenceList: [], //顺序列表
  // mode: 0, //0 顺序播放  1 单曲循环  2 随机播放
  // currentIndex :-1,//当前播放曲目
  set_playing(state, playing) {
    state.playing = playing;
  },
  set_fullScreen(state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  set_playList(state, playList) {
    state.playList = playList;
  },
  set_sequenceList(state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  set_mode(state, mode) {
    state.mode = mode;
  },
  set_currentIndex(state, currentIndex) {
    state.currentIndex = currentIndex;
  },

  //歌单数据 disc
  set_disc(state, disc) {
    state.disc = disc;
  },

  //排行榜歌单数据 rankList
  setRankList(state, rankList) {
    state.rankList = rankList;
  },

  //搜索历史数据
  set_searchHistory(state, searchHistory) {
    //已存在该搜索条目，将其先弹出，然后推入
    if (state.searchHistory.length > 0 && state.searchHistory.includes(searchHistory)) {
      for (let i = 0; i < state.searchHistory.length; i++) {
        if (state.searchHistory[i] == searchHistory) {
          state.searchHistory.splice(i, 1)
        }
      }
      state.searchHistory.push(searchHistory);
      return;
    }
    //超过7条数据，弹出
    if (state.searchHistory.length > 6) {
      state.searchHistory.reverse(); //反转数组
      state.searchHistory.pop();
      state.searchHistory.reverse(); //反转数组
    }
    state.searchHistory.push(searchHistory);
  },

  //删除历史数据
  delete_searchHistory(state, value) {
    for (let i = 0; i < state.searchHistory.length; i++) {
      if (state.searchHistory[i] == value) {
        state.searchHistory.splice(i, 1); //删除数据
      }
    }
  },

  //清空历史数据
  deleteAll_searchHistory(state) {
    state.searchHistory = [];
  },

  //设置playlist显隐
  set_isShowPlayList(state, value) {
    state.isShowPlayList = value;
  },

  //设置喜欢列表
  set_loveList(state, item) {
    //如果喜欢的歌曲已存在，不插入
    if (state.loveList.length > 0) {
      for (let i = 0; i < state.loveList.length; i++) {
        if (item.album_audio_id == state.loveList[i].album_audio_id) {
          return;
        } else if (i == state.loveList.length - 1) {
          state.loveList.push(item);
        }
      }
    } else { //不存在，直接插入
      state.loveList.push(item);
    }
  },

  //查询歌曲是否喜欢
  search_loveSong(state, album_audio_id) {
    if (state.loveList.length > 0) {
      for (let i = 0; i < state.loveList.length; i++) {
        if (album_audio_id == state.loveList[i].album_audio_id) {
          state.currentSongIsLove = true;
          return;
        } else if (i == state.loveList.length - 1) {
          state.currentSongIsLove = false;
        }
      }
    } else { //没有歌曲表示未添加到喜欢
      state.currentSongIsLove = false;
    }
  },

  //删除喜欢的歌曲
  delete_loveList(state, item) {
    for (let i = 0; i < state.loveList.length; i++) {
      if (item.album_audio_id == state.loveList[i].album_audio_id) { //找到歌曲，删除
        state.loveList.splice(i, 1)
        return;
      }
    }
  }

}

export default mutations;
