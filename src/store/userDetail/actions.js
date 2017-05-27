/**
 * Created by admin on 2017/3/28.
 */
import * as API from "../../api/api";
import axios from "axios";

export default {
  /*设置账号ID*/
  UD_setId(store, parm){
    store.commit('SETID', parm);
  },
  /*账号详情-基础信息*/
  UD_base_info(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_base_info.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_base_info', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-连接请求*/
  UD_connection_logs(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_connection_logs.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_connection_logs', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-关联设备*/
  UD_devices(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_devices.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_devices', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-操作路径*/
  UD_operation_logs(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_operation_logs.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_operation_logs', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-用户去向*/
  UD_access_logs(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_access_logs.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_access_logs', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-充值信息*/
  UD_transaction_logs(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_transaction_logs.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_transaction_logs', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*账号详情-信息管理*/
  UD_profile(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_profile.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_profile', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  },
  /*修改信息管理*/
  UD_up_profile(store, parm){
    let id = window.sessionStorage.getItem('userId');
    let address = API.u_up_profile.replace(/{id}/g, id);
    return new Promise((resolve, reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'POST',
        url: address,
        headers: {'Authorization': token},
        params: parm
      }).then(function (res) {
        if (res.status == 200) {
          store.commit('u_profile', res.data);
          resolve(res)
        }
      }).catch(function (err) {
        reject(err)
        console.log(err)
      })
    })
  }
}
