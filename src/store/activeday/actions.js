/**
 * Created by admin on 2017/3/28.
 */
import * as API from "../../api/api";
import axios from "axios";

export default {
  //日活跃列表
  ACTIVEDAY_DAY(store, parm) {
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.activeday_day_list,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ACTIVEDAY_DAY', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //日活跃用户-详情
  ACTIVEDAY_DAY_DETAILS(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.activeday_day_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ACTIVEDAY_DAY_DETAILS', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //月活跃用户-列表
  ACTIVEDAY_MONTH(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.activeday_month_list,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ACTIVEDAY_MONTH', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  //月活跃用户-详情
  ACTIVEDAY_MONTH_DETAILS(store, parm){
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.activeday_month_details,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('ACTIVEDAY_MONTH_DETAILS', res.data.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
}
