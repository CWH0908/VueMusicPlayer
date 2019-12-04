import axios from 'axios';
import jsonp from '../common/js/jsonp.js'; // 引入jsonp函数
//设计成歌曲列表类，方便后续播放器的使用
export default class Song {
  constructor({
    id, //歌曲id
    mid, //歌曲mid
    singer, //歌手信息
    name, //歌曲名称
    album, //专辑名称
    duration, //歌曲时长
    image, //歌曲图片
    url //歌曲的真实路径
  }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

//工厂方式处理musicData
export function createSong(musicData, vkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, //播放时长
    image: "https://y.gtimg.cn/music/photo_new/T002R300x300M000" + musicData.albummid + ".jpg?max_age=2592000",
    // url: "http://ws.stream.qqmusic.qq.com" + musicData.songid + ".m4a?fromtag=46"
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${vkey}&guid=2180150330&uin=0&fromtag=66`


  })
}

//处理多个歌手名称，用  /  将歌手名称隔开
function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach((item) => {
    ret.push(item.name);
  })
  return ret.join('/')
}


//获取vkey
export function getSongVkey(songmid) {
  const url = '/QQMusicAPI/getSongVkey'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 2515145957,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 2515145957,
    guid: 5931742855,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then((res) => { //成功的回调
      res = res.data.slice(18, -1)
      resolve(JSON.parse(res))
    })
  })

}
