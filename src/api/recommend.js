import jsonp from '../common/js/jsonp.js'; // 引入jsonp函数
import {
  commonParams,
  option
} from '../api/config.js'; //请求访问API接口所需的公共参数的文件

//getRecommend函数用于从API接口中获取 轮播图歌单 的 数据
export function getRecommend() {
  //访问QQ音乐API的推荐歌单列表数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // ES6 新函数 assign ，用于对象的深拷贝
  const data = Object.assign({}, commonParams, {
    //另外一些请求所需的参数
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, option);
}

