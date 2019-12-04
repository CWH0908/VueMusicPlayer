import axios from 'axios';

let commonParams = {
  inCharset: 'utf-8',
  outCharset: 'utf-8'
}

export function getKugouDiscList(specialid) {
  const url = `KugouMusicAPI/plist/list/${specialid}?json=true`
  const data = Object.assign({}, commonParams, {

  })
  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data.list.list)
  })
}
