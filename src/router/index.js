import Vue from "vue";
import Router from "vue-router";

const login = resolve => {
  resolve(require("../components/login/login.vue"));
}
const index = resolve => {
  resolve(require("../components/index/index.vue"));
}
const userInfo = resolve => {
  resolve(require("../components/userInfo/userInfo.vue"));
}
const hardware = resolve => {
  resolve(require("../components/statistics/hardware/index.vue"));
}
const operator = resolve => {
  resolve(require("../components/statistics/operator/index.vue"));
}
const start = resolve => {
  resolve(require("../components/statistics/start/index.vue"));
}
const share = resolve => {
  resolve(require("../components/statistics/share/index.vue"));
}
const dynamicipStar = resolve => {
  resolve(require("../components/serverInfo/dynamicip/index.vue"))
}
const channelVersion = resolve => {
  resolve(require("../components/channelConfig/channelVersion/index.vue"))
}
/*失败信息*/
const connfail = resolve => {
  resolve(require("../components/userAction/connfail/index.vue"))
}
/*用户未操作*/
const unexe = resolve => {
  resolve(require("../components/userAction/unexe/index.vue"))
}
/*登录失败*/
const loginfail = resolve => {
  resolve(require("../components/userAction/loginfail/index.vue"))
}
/*封号日志*/
const lock = resolve => {
  resolve(require("../components/config/lock/index.vue"))
}
/*地域配置*/
const area = resolve => {
  resolve(require("../components/config/area/index.vue"))
}
/*服务器类型配置*/
const servertype = resolve => {
  resolve(require("../components/config/servertype/index.vue"))
}
/*动态IP配置*/
const dynamicip = resolve => {
  resolve(require("../components/config/dynamicip/index.vue"))
}
/*充值信息*/
const payInfo = resolve => {
  resolve(require("../components/Operative/payInfo/index.vue"))
}
/*用户类型配置*/
const usertype = resolve => {
  resolve(require("../components/config/userType/index.vue"))
}
/*套餐配置*/
const setMeal = resolve => {
  resolve(require("../components/config/setMeal/index.vue"))
}
/*用户反馈*/
const feedback = resolve => {
  resolve(require("../components/config/feedback/index.vue"))
}
/*服务器群组管理-服务器配置*/
const serverlist = resolve => {
  resolve(require("../components/config/serverlist/index.vue"))
}

/*服务器信息*/
const serverarea = resolve => {
  resolve(require("../components/serverInfo/serverarea/index.vue"))
}

/*登录IP*/
const loginip = resolve => {
  resolve(require("../components/userAction/loginip/index.vue"))
}
/*服务器详情信息表*/
const serverdetailed = resolve => {
  resolve(require("../components/serverInfo/serverdetailed/index.vue"))
}
/*去向IP*/
const dstip = resolve => {
  resolve(require("../components/userAction/dstip/index.vue"))
}

/*充值记录*/
const rechargelist = resolve => {
  resolve(require("../components/Operative/recharge/index.vue"))
}

/*参数配置*/
const config = resolve => {
  resolve(require("../components/config/config/index.vue"))
}

/*服务器在线人数*/
const online = resolve => {
  resolve(require("../components/serverInfo/online/index.vue"))
}

/*用户点击频率*/
const frequency = resolve => {
  resolve(require("../components/userAction/frequency/index.vue"))
}
/*使用时长*/
const usetime = resolve => {
  resolve(require("../components/userAction/usetime/index.vue"))
}

/*页面点击*/
const pageclick = resolve => {
  resolve(require("../components/userAction/pageclick/index.vue"))
}

/*日新增用户*/
const addday = resolve => {
  resolve(require("../components/Operative/addday/index.vue"))
}

/*日活跃用户*/
const activeday = resolve => {
  resolve(require("../components/Operative/activeday/index.vue"))
}

/*留存*/
const remain = resolve => {
  resolve(require("../components/Operative/remain/index.vue"))
}

/*后台管理*/
//后台权限类型配置
const Authorization = resolve => {
  resolve(require("../components/config/Authorization/index.vue"))
}
//后台管理员列表
const admin = resolve => {
  resolve(require("../components/config/admin/index.vue"))
}
//后台管理员操作日志
const manager = resolve => {
  resolve(require("../components/config/manager/index.vue"))
}


Vue.use(Router)
const router = new Router({
  routes: [
    //登录
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: login
    },
    //首页
    {
      path: '/index',
      component: index,
      children: [
        /*用户基础信息*/
        /*用户列表*/
        {
          path: '',
          name: 'userInfo',
          component: userInfo,
          meta: {requireAuth: true},
        },
        /*统计表*/
        //硬件统计
        {
          path: '/statistics/hardware',
          name: 'hardware',
          component: hardware,
        },
        //运营商统计
        {
          path: '/statistics/operator',
          name: 'operator',
          component: operator,
        },
        //用户状态统计
        {
          path: '/statistics/start',
          name: 'start',
          component: start,
        },
        //分享统计
        {
          path: '/statistics/share',
          name: 'share',
          component: share,
        },
        /*用户行为*/
        /*服务器信息*/
        //当前在线人数
        {
          path: '/serverInfo/online',
          name: 'online',
          component: online,
        },
        //服务器详情信息表
        {
          path: '/serverInfo/serverdetailed',
          name: 'serverdetailed',
          component: serverdetailed,
        },
        //动态IP状态
        {
          path: '/serverInfo/dynamicip',
          name: 'dynamicipStar',
          component: dynamicipStar,
        },
        /*登录IP*/
        {
          path: '/userAction/loginip',
          name: 'loginip',
          component: loginip,
        },
        /*去向IP*/
        {
          path: '/userAction/dstip',
          name: 'dstip',
          component: dstip,
        },
        /*使用时长*/
        //用户点击使用频率
        {
          path: '/userAction/frequency',
          name: 'frequency',
          component: frequency,
        },
        //使用时长
        {
          path: '/userAction/usetime',
          name: 'usetime',
          component: usetime,
        },
        /*页面点击*/
        {
          path: '/userAction/pageclick',
          name: 'pageclick',
          component: pageclick,
        },
        /*失败信息*/
        //登录失败
        {
          path: '/userAction/loginfail',
          name: 'loginfail',
          component: loginfail,
        },
        //连接失败
        {
          path: '/userAction/connfail',
          name: 'connfail',
          component: connfail,
        },
        //用户未操作
        {
          path: '/userAction/unexe',
          name: 'unexe',
          component: unexe,
        },
        /*运营行为*/
        /*充值记录*/
        //付费信息
        {
          path: '/Operative/payInfo',
          name: 'payInfo',
          component: payInfo,
        },
        //充值记录
        {
          path: '/Operative/recharge',
          name: 'recharge',
          component: rechargelist,
        },
        /*新增用户*/
        //日新增用户
        {
          path: '/Operative/addday',
          name: 'addday',
          component: addday,
        },
        /*活跃用户*/
        //日活跃用户
        {
          path: '/Operative/activeday',
          name: 'activeday',
          component: activeday,
        },
        /*留存*/
        {
          path: '/Operative/remain',
          name: 'remain',
          component: remain,
        },
        /*配置管理*/
        /*收费管理*/
        //用户类型配置
        {
          path: '/config/usertype',
          name: 'usertype',
          component: usertype,
        },
        //服务器类型配置
        {
          path: '/config/servertype',
          name: 'servertype',
          component: servertype,
        },
        //套餐配置
        {
          path: '/config/setMeal',
          name: 'setMeal',
          component: setMeal,
        },
        /*后台管理*/
        //后台权限类型配置
        {
          path: '/config/Authorization',
          name: 'Authorization',
          component: Authorization,
        },
        //后台管理员列表
        {
          path: '/config/admin',
          name: 'admin',
          component: admin,
        },
        //后台管理员操作日志
        {
          path: '/config/manager',
          name: 'manager',
          component: manager,
        },
        /*用户管理*/
        //封号日志
        {
          path: '/config/lock',
          name: 'lock',
          component: lock,
        },
        //用户反馈
        {
          path: '/config/feedback',
          name: 'feedback',
          component: feedback,
        },
        /*服务器群组管理*/
        //地域配置
        {
          path: '/config/area',
          name: 'area',
          component: area,
        },
        //服务器配置
        {
          path: '/config/serverlist',
          name: 'serverlist',
          component: serverlist,
        },
        //动态IP配置
        {
          path: '/config/dynamicip',
          name: 'c_dynamicip',
          component: dynamicip,
        },
        /*参数配置*/
        {
          path: '/config/config',
          name: 'config',
          component: config,
        },
        /*渠道版本管理*/
        {
          path: '/channelConfig/channelversion',
          name: 'channelversion',
          component: channelVersion,
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  let token = JSON.parse(window.sessionStorage.getItem('loginInfo'));

  if (to.path == '/login') {
    sessionStorage.removeItem('loginInfo');
  }

  if (!token && to.path != '/login') {
    next({path: '/login'})
  } else {
    next()
  }

})

export default router
