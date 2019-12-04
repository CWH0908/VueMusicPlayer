import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 导入组件
import Home from "../components/base/home.vue"; //首页
import Rank from "../components/rank/rank.vue"; //排行页面
import Recommend from "../components/recommend/recommend"; //推荐页面
import Disc from "../components/Disc/disc.vue"; //歌单详情页面
import Search from "../components/search/search"; //搜索页面 
import Singer from "../components/singer/singer"; //歌手页面
import SingerDetail from "../components/singer/singer-detail"; //歌手-详情页
import topList from "../components/top-list/top-list"; //酷狗排行榜歌曲列表组件
import myLove from "../components/base/myLove"; //我喜欢

let router = new Router({
  routes: [{
      path: "/",
      redirect: "/home/recommend",
    },
    {
      path: '*',
      redirect: '/home/recommend'
    },
    {
      path: "/home",
      name: "Home",
      components: {
        // "Home": (resolve) => {
        //   require('../components/base/home.vue'), resolve
        // }
        //由于此路由直接重定向到 /home/recommend,所以此Home不会加载，
        //但是其余组件都是其子路由组件，所以都不会加载出来，所以Home组件不能使用懒加载
        Home
      },
      children: [{
          path: "recommend",
          name: "Recommend",
          components: { //按需加载
            'Recommend': (resolve) => {
              require(['../components/recommend/recommend.vue'], resolve)
            }
          },
          children: [{
            path: ":id",
            name: "Disc",
            components: {
              "Disc": resolve => {
                require(["../components/Disc/disc.vue"], resolve)
              }
            }
          }]
        }, {
          path: "singer",
          name: "Singer",
          components: {
            "Singer": resolve => {
              require(["../components/singer/singer"], resolve)
            }
          },
        }, {
          path: "rank",
          name: "Rank",
          components: {
            "Rank": resolve => {
              require(["../components/rank/rank.vue"], resolve)
            }
          },
          children: [{
            path: ":id",
            name: "rankList",
            components: {
              "topList": resolve => {
                require(["../components/top-list/top-list"], resolve)
              }
            }
          }]
        },
        {
          path: "search",
          name: "Search",
          components: {
            "Search": resolve => {
              require(["../components/search/search"], resolve)
            }
          }
        },
        {
          path: "user",
          name: "myLove",
          components: {
            "myLove": resolve => {
              require(["../components/base/myLove"],resolve)
            }
          }
        }
      ]
    },
    {
      path: "/home/singer/:id",
      name: "SingerDetail",
      components: {
        "SingerDetail": resolve => {
          require(["../components/singer/singer-detail"], resolve)
        }
      }
    },

  ],
  linkActiveClass: "myRouterClass", //配置路由地址激活时候的组件绑定的样式，默认为.router-link-active
})

export default router;
