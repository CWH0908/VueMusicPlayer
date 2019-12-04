import axios from 'axios';

let commonParams = {
  inCharset: 'utf-8',
  outCharset: 'utf-8'
}

//歌手数据
export function getSingerList() {
  const url = '/QQMusicAPI/singerList'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    // console.log(res.data.data.list);
    return Promise.resolve(res.data.data.list)
  })
}


//歌手详情数据
export function getSingerDetail(singerId) {
  const url = '/QQMusicAPI/singerDetail'
  const data = Object.assign({}, commonParams, {
    format: 'jsonp',
    notice: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    order: "listen",
    begin: 0,
    num: 100,
    songstatus: 1,
    g_tk: 5381,
    singermid: singerId, //根据传入的歌手id发起不同请求，获取歌手详情
  })

  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data.data.list)
  })
}


