import Vue from "vue";
import Router from "vue-router";
import {getChannelVerion} from "../assets/js/js";
import store from "../store";

const login = resolve => {
  resolve(require('../components/login/login.vue'))
}
const index = resolve => {
  resolve(require('../components/index/index.vue'))
}
const userInfo = resolve => {
  resolve(require('../components/userInfo/userInfo.vue'))
}
const hardware = resolve => {
  resolve(require('../components/statistics/hardware/index.vue'))
}
const operator = resolve => {
  resolve(require('../components/statistics/operator/index.vue'))
}
const start = resolve => {
  resolve(require('../components/statistics/start/index.vue'))
}
const share = resolve => {
  resolve(require('../components/statistics/share/index.vue'))
}
const website = resolve => {
  resolve(require('../components/statistics/website/index.vue'))
}
const dynamicipStar = resolve => {
  resolve(require('../components/serverInfo/dynamicip/index.vue'))
}
const channelVersion = resolve => {
  resolve(require('../components/channelConfig/channelVersion/index.vue'))
}
const connfail = resolve => {
  resolve(require('../components/userAction/connfail/index.vue'))
}
const unexe = resolve => {
  resolve(require('../components/userAction/unexe/index.vue'))
}
const loginfail = resolve => {
  resolve(require('../components/userAction/loginfail/index.vue'))
}
const lock = resolve => {
  resolve(require('../components/config/lock/index.vue'))
}
const area = resolve => {
  resolve(require('../components/config/area/index.vue'))
}
const servertype = resolve => {
  resolve(require('../components/config/servertype/index.vue'))
}
const dynamicip = resolve => {
  resolve(require('../components/config/dynamicip/index.vue'))
}
const operation = resolve => {
  resolve(require('../components/config/operation/index.vue'))
}
const payInfo = resolve => {
  resolve(require('../components/Operative/payInfo/index.vue'))
}
const usertype = resolve => {
  resolve(require('../components/config/userType/index.vue'))
}
const setMeal = resolve => {
  resolve(require('../components/config/setMeal/index.vue'))
}
const feedback = resolve => {
  resolve(require('../components/config/feedback/index.vue'))
}
const serverlist = resolve => {
  resolve(require('../components/config/serverlist/index.vue'))
}
const serverarea = resolve => {
  resolve(require('../components/serverInfo/serverarea/index.vue'))
}
const loginip = resolve => {
  resolve(require('../components/userAction/loginip/index.vue'))
}
const serverdetailed = resolve => {
  resolve(require('../components/serverInfo/serverdetailed/index.vue'))
}
const dstip = resolve => {
  resolve(require('../components/userAction/dstip/index.vue'))
}
const rechargelist = resolve => {
  resolve(require('../components/Operative/recharge/index.vue'))
}
const config = resolve => {
  resolve(require('../components/config/config/index.vue'))
}
const online = resolve => {
  resolve(require('../components/serverInfo/online/index.vue'))
}
const frequency = resolve => {
  resolve(require('../components/userAction/frequency/index.vue'))
}
const usetime = resolve => {
  resolve(require('../components/userAction/usetime/index.vue'))
}

const pageclick = resolve => {
  resolve(require('../components/userAction/pageclick/index.vue'))
}
const addday = resolve => {
  resolve(require('../components/Operative/addday/index.vue'))
}
const activeday = resolve => {
  resolve(require('../components/Operative/activeday/index.vue'))
}
const remain = resolve => {
  resolve(require('../components/Operative/remain/index.vue'))
}
const Authorization = resolve => {
  resolve(require('../components/config/Authorization/index.vue'))
}
const admin = resolve => {
  resolve(require('../components/config/admin/index.vue'))
}
const manager = resolve => {
  resolve(require('../components/config/manager/index.vue'))
}

const help = resolve => {
  resolve(require('../components/config/help/index.vue'))
}

const connection = resolve => {
  resolve(require('../components/config/connection/index.vue'))
}

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: login
    },
    {
      path: '/index',
      component: index,
      children: [
        {
          path: '',
          name: 'userInfo',
          component: userInfo,
          meta: {requireAuth: true}
        },
        {
          path: '/statistics/hardware',
          name: 'hardware',
          component: hardware
        },

        {
          path: '/statistics/operator',
          name: 'operator',
          component: operator
        },

        {
          path: '/statistics/start',
          name: 'start',
          component: start
        },

        {
          path: '/statistics/share',
          name: 'share',
          component: share
        },
        {
          path: '/statistics/website',
          name: 'website',
          component: website
        },
        {
          path: '/serverInfo/online',
          name: 'online',
          component: online
        },

        {
          path: '/serverInfo/serverdetailed',
          name: 'serverdetailed',
          component: serverdetailed
        },
        {
          path: '/serverInfo/dynamicip',
          name: 'dynamicipStar',
          component: dynamicipStar
        },
        {
          path: '/userAction/loginip',
          name: 'loginip',
          component: loginip
        },
        {
          path: '/userAction/dstip',
          name: 'dstip',
          component: dstip
        },
        {
          path: '/userAction/frequency',
          name: 'frequency',
          component: frequency
        },
        {
          path: '/userAction/usetime',
          name: 'usetime',
          component: usetime
        },
        {
          path: '/userAction/pageclick',
          name: 'pageclick',
          component: pageclick
        },
        {
          path: '/userAction/loginfail',
          name: 'loginfail',
          component: loginfail
        },
        {
          path: '/userAction/connfail',
          name: 'connfail',
          component: connfail
        },
        {
          path: '/userAction/unexe',
          name: 'unexe',
          component: unexe
        },
        {
          path: '/Operative/payInfo',
          name: 'payInfo',
          component: payInfo
        },
        {
          path: '/Operative/recharge',
          name: 'recharge',
          component: rechargelist
        },
        {
          path: '/Operative/addday',
          name: 'addday',
          component: addday
        },
        {
          path: '/Operative/activeday',
          name: 'activeday',
          component: activeday
        },
        {
          path: '/Operative/remain',
          name: 'remain',
          component: remain
        },
        {
          path: '/config/usertype',
          name: 'usertype',
          component: usertype
        },
        {
          path: '/config/servertype',
          name: 'servertype',
          component: servertype
        },
        {
          path: '/config/setMeal',
          name: 'setMeal',
          component: setMeal
        },
        {
          path: '/config/Authorization',
          name: 'Authorization',
          component: Authorization
        },
        {
          path: '/config/admin',
          name: 'admin',
          component: admin
        },
        {
          path: '/config/manager',
          name: 'manager',
          component: manager
        },
        {
          path: '/config/operation',
          name: 'operation',
          component: operation
        },
        {
          path: '/config/lock',
          name: 'lock',
          component: lock
        },
        {
          path: '/config/connection',
          name: 'connection',
          component: connection
        },
        {
          path: '/config/feedback',
          name: 'feedback',
          component: feedback
        },
        {
          path: '/config/area',
          name: 'area',
          component: area
        },
        {
          path: '/config/serverlist',
          name: 'serverlist',
          component: serverlist
        },
        {
          path: '/config/dynamicip',
          name: 'c_dynamicip',
          component: dynamicip
        },
        {
          path: '/config/help',
          name: 'help',
          component: help
        },
        {
          path: '/config/config',
          name: 'config',
          component: config
        },
        {
          path: '/channelConfig/channelversion',
          name: 'channelversion',
          component: channelVersion
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = JSON.parse(window.sessionStorage.getItem('loginInfo'))

  if (to.path === '/login') {
    sessionStorage.removeItem('loginInfo')
  }

  if (!token && to.path != '/login') {
    next({path: '/login'})
  } else {
    next()
  }
  getChannelVerion().then((res) => {
    if (res.data.success) {
      let s = JSON.parse(window.sessionStorage.getItem('loginInfo'));
      let data = res.data.data;
      s.app_channels = [...data.channels]
      s.app_versions = [...data.versions]
      window.sessionStorage.removeItem('loginInfo')
      window.sessionStorage.setItem('loginInfo', JSON.stringify(s))
      store.commit('upChannerVerion')
    }
  })
})

export default router
