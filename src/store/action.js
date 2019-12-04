//此函数可以使用函数 传入 数据对象 来进行多个数据对象状态的提交
export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit("set_sequenceList", list);
  commit("set_playList", list); //传入播放列表，当播放列表数组的长度大于0时，则会显示音乐播放器player.vue组件
  commit("set_currentIndex", index);
  commit("set_fullScreen", true);
  commit("set_playing", true); //处于播放状态
}

//用于将搜索的歌曲添加到播放列表中，修改相应的数据
export const insertSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList;
  let sequenceList = state.sequenceList;
  let currentIndex = state.currentIndex;

  /////////////////////////////////////////////修改播放列表
  // 记录当前歌曲
  let currentSong = playList[currentIndex];

  //查找当前列表是否已存在待插入的歌曲，并返回索引
  let fpIndex = findIndex(playList, song);

  //插入歌曲，索引+1
  currentIndex++;
  playList.splice(currentIndex, 0, song);

  //索引大于-1，已存在，删除原来的歌曲
  if (fpIndex > -1) {
    //当前插入的序号大于被删除歌曲的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else { //反之
      playList.splice(fpIndex + 1, 1);
    }
  }

  /////////////////////////////////////////////修改顺序列表
  //找到当前歌曲在顺序列表的索引，+1，表示插入歌曲在顺序列表中应该处于的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;

  let fsIndex = findIndex(sequenceList, song);

  sequenceList.splice(currentSIndex, 0, song);

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  //上述不需要修改currentIndex,因为currentIndex是表示在playList中的索引位置，而我们在顺序列表中只需要将歌曲正确插入即可(保证歌曲唯一)

  //提交修改
  commit("set_sequenceList", sequenceList);
  commit("set_playList", playList);
  commit("set_currentIndex", currentIndex);

  //提交打开播放器操作
  commit("set_fullScreen", true);
  commit("set_playing", true); //处于播放状态
}

//判断搜索的歌曲是否已经存在于播放列表中
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.audio_id === song.audio_id
  })
}

//删除播放列表的歌曲
export const deleteSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playList, song); //找到索引
  playList.splice(pIndex, 1); //删除播放歌曲
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1); //删除顺序列表的歌曲

  //当前播放歌曲在删除歌曲之后,或删除最后一首歌
  if (currentIndex > pIndex || currentIndex == playList.length) {
    currentIndex--;
  }

  //提交修改
  commit("set_sequenceList", sequenceList);
  commit("set_playList", playList);
  commit("set_currentIndex", currentIndex);

  //整个列表都被删除完
  if(!playList.length){
    commit("set_playing", false); //不再是播放状态
  }else{
    commit("set_playing", true); //还有歌，应该处于播放状态
  }
}

//清空播放列表
export const deleteSongList =function({commit}){
    //提交修改
    commit("set_sequenceList", []);
    commit("set_playList", []);
    commit("set_currentIndex", -1);
    commit("set_playing", false); //不再是播放状态
    commit("set_fullScreen", false); 
}