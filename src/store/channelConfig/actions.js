/**
 * Created by isec on 2017/4/14.
 */

import * as API from '../../api/api'
import axios from 'axios'

export default {
  //获取渠道列表
  getChannelData (store, params){
    return new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'GET',
        url: API.config_channel_list,
        headers: {'Authorization': token},
        params: params
      }).then(function (res) {
        if(res.status == 200){
          store.commit('GET_CHANNEL_DATA', res.data)
          resolve(res)
        }else{
          reject(res)
        }
      }).catch((error) => error)
    })
  },
  //新增渠道
  addChannel(store, params){
    return new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method: 'POST',
        url: API.config_channel_add,
        headers: {'Authorization': token},
        params: params
      }).then(function (res) {
        if(res.status == 200){
          store.commit('ADD_CHANNEL', res.data)
          resolve(res)
        }else{
          reject(res)
        }
      }).catch((error) => error)
    })
  },
  //更新渠道
  updateChannel(store, params){
    return new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      let address = API.config_channel_update.replace(/{id}/g,params.id);
      axios({
        method: 'PATCH',
        url: address,
        headers: {'Authorization': token},
        params: params
      }).then(function (res) {
        if(res.status == 200){
          resolve(res)
          store.commit('UPDATE_CHANNEL', res.data)
        }else{
          reject(res)
        }
      }).catch((error) => error)
    })
  },
  //删除渠道
  deleteChannel(store, params){
    return new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      let address = API.config_channel_delete.replace(/{id}/g,params.id);
      axios({
        method: 'DELETE',
        url: address,
        headers: {'Authorization': token},
        params: params
      }).then(function (res) {
        if(res.status == 200){
          resolve(res)
          store.commit('UPDATE_CHANNEL', res.data)
        }else{
          reject(res)
        }
      }).catch((error) => error)
    })
  }
}
