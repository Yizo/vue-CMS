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
Vue.prototype.$http = axios;
Vue.prototype.$HighCharts = HighCharts;

Vue.use(ElementUI)
Vue.use(router)

Vue.config.productionTip = false

for (var key in filters) {
  Vue.filter(key, filters[key])
}

axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
},

//请求拦截器
  axios.interceptors.request.use(function (config) {

    return config;
  }, function (err) {
    return Promise.reject(err);
  });
//响应拦截器
axios.interceptors.response.use(function (res) {
  if (!res.data.success) {
    if (res.data.error == 'InvalidToken') {
      Message.warning({
        duration: 1000,
        message: '页面已过有效期,请退出重新登录!',
        type: 'warning'
      })
    } else if (res.data.error == 'AccessDenied') {
      Message.warning({
        duration: 1000,
        message: "没有权限访问此页面",
        type: 'warning'
      })
    } else if (res.data.error == 'InvalidParameter') {
      Message.warning({
        duration: 1000,
        message: "请填必需参数",
        type: 'warning'
      })
    } else if (res.data.error == 'ResourceNotFound') {
      Message.warning({
        duration: 1000,
        message: "记录未找到",
        type: 'warning'
      })
    } else {
      console.log(res.data.messages[0])
      let meg = res.data.messages[0];
      Message.warning({
        duration: 1000,
        message: meg,
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

