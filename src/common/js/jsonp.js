//封装jsonp 函数

import originJSONP from 'jsonp';//引入jsonp

export default function jsonp(url,data,option){//暴露jsonp函数用以发起跨域请求

    //使用请求参数来调用param函数，以此返回带参数的url字符串。其中如果url地址不带 ？ 则添加？拼接，否则直接使用 & 拼接参数
    url += (url.indexOf('?')<0? '?':'&') +param(data);

    return new Promise((resolve,reject)=>{
        originJSONP(url,option,(err,data)=>{
            if(!err){//成功请求
                resolve(data);
            }else{
                reject(err);//请求失败
            }
        })
    })
}

//该函数，将 data 数据 拼接到 url 地址中
function param(data){
    let url = '';
    for(var i in data){
        //将url地址 转成字符 存到 value中
        let value = data[i] !== undefined ? data[i]:'';//已定义，设置为当前值，未定义则赋值为空字符串
        //url拼接 请求 的参数(ES6语法)
        url +=`&${i} = ${encodeURIComponent(value)}`
    }
    return url?url.substring(1):"";//url不为空则返回url字符串，为空则返回空字符串

}