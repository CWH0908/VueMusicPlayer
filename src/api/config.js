//暴露一些 访问 API 接口 所需要的公共参数，省去每次请求API都需要配置一堆相同的参数。
//此公共配置文件暴露的参数对应QQ音乐 API 的推荐音乐列表
export const commonParams ={
    g_tk:5391,
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    format:'jsonp'
}

export const option ={
    param :'jsonpCallback'
}

export const ERR_OK = 0