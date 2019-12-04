import axios from 'axios';

let commonParams = {
    inCharset:'utf-8',
    outCharset:'utf-8'
}

export function getDiscList() {
  const url = '/QQMusicAPI/songList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

    return axios.get(url, {
      params: data
    }).then((res) => {//成功的回调
      console.log(res.data.data.list);
      return Promise.resolve(res.data.data.list)
    })
}
