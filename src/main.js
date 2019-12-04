// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MintUI from 'mint-ui'
Vue.use(MintUI)
import 'mint-ui/lib/style.css'

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';

//引入vant
import { List ,Icon} from 'vant';
Vue.use(List);
Vue.use(Icon);

import store from "./store";
// import VueLazyload from '_vue-lazyload@1.3.3@vue-lazyload'

//引入图片懒加载
// VueLazyload没效果，改用vant的懒加载组件
// import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload, {
//   loading: require('../src/common/images/loading.gif') //加载中图片，一定要有，不然会一直重复加载占位图
// });
import { Lazyload } from 'vant';
Vue.use(Lazyload,{
  loading: require('../src/common/images/loading.gif')
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  store
})
