import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import axios from "axios";
import HighCharts from "highcharts";
import ElementUI, {Message, Notification} from "element-ui";
import "element-ui/lib/theme-default/index.css";
import "./assets/css/reset.css";
import * as filters from "./filter/filter";
import * as JS from "./assets/js/js";
Vue.prototype.$http = axios;
Vue.prototype.$HighCharts = HighCharts;

Vue.use(ElementUI)
Vue.use(router)

Vue.config.productionTip = false;

let date1 = null;
let date2 = null;
let time = null

for (var key in filters) {
  Vue.filter(key, filters[key])
}
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
},

//请求拦截器
  axios.interceptors.request.use(function (config) {
    /*请求前参数配置*/
    config.params = JS.paramsConfig(config)
    //全局loading
    date1 = new Date().getTime();
    store.commit('submitLoading', true)
    return config;
  }, function (err) {
    return Promise.reject(err);
  });
//响应拦截器
axios.interceptors.response.use(function (res) {
  if (res.status == 200 && res.data.success || res.data.status == 1) {
    date2 = new Date().getTime();
    clearTimeout(time)
    if (date2 - date1 < 800) {
      time = setTimeout(() => {
        store.commit('submitLoading', false)
      }, 800)
    } else {
      store.commit('submitLoading', false)
    }
    return Promise.resolve(res)
  }
  if (!res.data.success) {
    date2 = new Date().getTime();
    clearTimeout(time)
    if (date2 - date1 < 800) {
      time = setTimeout(() => {
        store.commit('submitLoading', false)
      }, 800)
    } else {
      store.commit('submitLoading', false)
    }
    if (res.status == 500) {
      Message.warning({
        duration: 2000,
        message: '服务器错误',
        type: 'error'
      })
      return false
    }
    if (res.data.error == 'InvalidToken') {
      Message.warning({
        duration: 1500,
        message: '页面已过有效期,请退出重新登录!',
        type: 'warning'
      })
    } else if (res.data.error == 'AccessDenied') {
      Message.warning({
        duration: 1500,
        message: "没有权限访问此页面",
        type: 'warning'
      })
    } else if (res.data.error == 'InvalidParameter') {
      Message.warning({
        duration: 1500,
        message: "请填必需参数",
        type: 'warning'
      })
    } else if (res.data.error == 'ResourceNotFound') {
      Message.warning({
        duration: 1500,
        message: "记录未找到",
        type: 'warning'
      })
    } else {
      Message.warning({
        duration: 1500,
        message: res.data.messages[0],
        type: 'warning'
      })
    }
  }
  return res;
}, function (err) {
  return Promise.reject(err);
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

