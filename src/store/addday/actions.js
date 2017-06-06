/**
 * Created by admin on 2017/3/28.
 */
import * as API from "../../api/api";
import axios from "axios";

export default {
  //日新增列表
  ADDDAY_DAY(store, parm) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_day_list,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_DAY', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //日新增图表
  ADDDAY_DAY_CHART(store, parm) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_day_chart,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_DAY_CHART', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //日新增用户-详情
  ADDDAY_DAY_DETAILS(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_day_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_DAY_DETAILS', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //月新增用户-列表
  ADDDAY_MONTH(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_month_list,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_MONTH', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //月新增用户-图表
  ADDDAY_MONTH_CHART(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_month_chart,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_MONTH_CHART', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //月新增用户-详情
  ADDDAY_MONTH_DETAILS(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.addday_month_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ADDDAY_MONTH_DETAILS', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
}
