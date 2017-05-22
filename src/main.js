import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import HighCharts from 'highcharts'
import ElementUI from 'element-ui'
import { Message } from 'element-ui';
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import './assets/css/reset.css'
import * as filters from './filter/filter'
Vue.prototype.$http = axios;
Vue.prototype.$HighCharts = HighCharts;

Vue.use(ElementUI)
Vue.use(router)

Vue.config.productionTip = false

for(var key in filters){
  Vue.filter(key,filters[key])
}

//请求拦截器
axios.interceptors.request.use(function(config){
  return config;
},function(err){
  return Promise.reject(err);
});
//响应拦截器
axios.interceptors.response.use(function(res){
  if(res.status == 200){
    if(res.data.success === false){
      if(res.data.error == 'InvalidToken'){
        Message.warning({
          showClose: true,
          message: '页面已过有效期,请退出重新登录!',
          type: 'warning'
        })
      }else if(res.data.error == 'AccessDenied'){
        Message.warning({
          showClose: true,
          message: '权限不足',
          type: 'warning'
        })
      }else{
        Message.warning({
          showClose: true,
          message: res.data.message[0],
          type: 'warning'
        })
      }
    }
  }else{
    Message.error({
      showClose: true,
      message: '网络异常',
      type: 'error'
    })
  }
  return res;
},function(err){
  //Do something with response error
  return Promise.reject(err);
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

