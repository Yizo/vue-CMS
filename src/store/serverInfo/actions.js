/**
 * Created by isec on 2017/4/15.
 */

import * as API from "../../api/api";
import axios from "axios";

export default {
  getDncIpData(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.dynamic_ip,
      headers: {'Authorization': token},
      params: {
        page: params.page,
        limit: params.limit
      }
    }).then((res) => {
      store.commit('GET_DNCIP_DATA', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  addDncIpItem(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'POST',
      url: API.dynamic_ip_add,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('ADD_DNCIP_ITEM', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  deleteDncIpItem(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'POST',
      url: API.dynamic_ip_delete,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('DELETE_DNCIP_ITEM', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  updateDncIpItem(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'POST',
      url: API.dynamic_ip_update,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('UPDATE_DNCIP_ITEM', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  getPersonDetails(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.online_detail_get,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('GET_PERSON_DETAILS', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  getRegionDetails(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.online_detail_get,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('GET_REGION_DETAILS', res.data)
    }).catch((err) => {
      console.log(err)
    })
  },
  getRegionLineDetails(store, params){
    const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
    axios({
      method: 'GET',
      url: API.online_detail_get,
      headers: {'Authorization': token},
      params: params,
    }).then((res) => {
      store.commit('GET_REGION_lINE_DETAILS', res.data)
    }).catch((err) => {
      console.log(err)
    })
  }
}
