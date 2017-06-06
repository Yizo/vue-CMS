/**
 * Created by admin on 2017/3/28.
 */
import * as API from "../../api/api";
import axios from "axios";

export default {
  //筛选时间
  setTime: (store, parm) => {
    store.commit('SETTIME', parm)
  },
  //付费信息
  PAYINFO_ffInfo(store, parm) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.t_users_count_collects,
        headers: {'Authorization': token},
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('FFINFO', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //付费信息-图表数据
  PAYINFO_pay_char(store, parm) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.transaction_logs_chart,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('PAYINFO_pay_char', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //充值详情
  PAYINFO_pay_details(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.transaction_logs_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('PAYDETAILS', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //汇总
  PAYINFO_consume_coins_details(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.consume_coins_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('CONSUMECOINS', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },

}
