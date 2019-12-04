import axios from 'axios';

let commonParams = {
  inCharset: 'utf-8',
  outCharset: 'utf-8'
}

export function getBSwipper() {
  const url = '/BAPI/getBSlider'
  const data = Object.assign({}, commonParams, {

  })
  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data)
  })
}
