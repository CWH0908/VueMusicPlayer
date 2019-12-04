import axios from 'axios';

let commonParams = {
  inCharset: 'utf-8',
  outCharset: 'utf-8'
}

export function getKugouRank() {//排行榜单
  const url = 'KugouMusicAPI/rank/list&json=true'
  const data = Object.assign({}, commonParams, {

  })
  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data.rank.list)
  })
}

export function getKugouRankDetailList(rankid) {//排行榜详细歌曲信息
  const url = `KugouMusicAPI/rank/info/?rankid=${rankid}&page=1&json=true`
  const data = Object.assign({}, commonParams, {

  })
  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data.songs)
  })
}
