import axios from 'axios';

let commonParams = {
  inCharset: 'utf-8',
  outCharset: 'utf-8'
}

export function getKugouHotKeywords() {//热门关键词
  const url = 'KugouHotKeywordsAPI/v3/search/hot?format=json&plat=0&count=30'
  const data = Object.assign({}, commonParams, {

  })
  return axios.get(url, {
    params: data
  }).then((res) => { //成功的回调
    return Promise.resolve(res.data.data.info)
  })
}

export function getKugousearchList(keyword,page) {//搜索列表
    const url = `KugouHotKeywordsAPI/v3/search/song?format=json&keyword=${keyword}&page=${page}&pagesize=20&showtype=1`
    const data = Object.assign({}, commonParams, {
  
    })
    return axios.get(url, {
      params: data
    }).then((res) => { //成功的回调
      return Promise.resolve(res.data.data)
    })
  }