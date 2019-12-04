import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from "./action";
import * as getters from "./getters";
import state from "./state";
import mutations from "./mutation";

import createLogger from 'vuex/dist/logger';//查看vuex日志

Vue.use(Vuex);//注册vuex

const debug = process.env.NODE_ENV !== 'production';//在!production环境下(开发模式)使用debug调试

//Store 表示 储存库，用来存储数据的状态
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    plugins:debug?[createLogger()]:[],//判断debug是否开启查看日志
})
