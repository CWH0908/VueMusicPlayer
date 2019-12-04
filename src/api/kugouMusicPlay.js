import axios from 'axios';

let commonParams = {
    inCharset: 'utf-8',
    outCharset: 'utf-8'
}

export function getKugouMusicPlay(hash) {
  const url = '/kugouMusicAPI/getSongInfo'
  const data = Object.assign({}, commonParams, {
    hash:hash
  })

  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    console.log(res.data);
    return Promise.resolve(res.data.data)
  })
}
