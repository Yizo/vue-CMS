/**
 * Created by admin on 2017/3/28.
 */
import * as API from '../../api/api'
import axios from 'axios'

export default {

  /*获取服务器类型*/
  getNodeType(store,parm){
    return  new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method:'GET',
        url:API.server_node_types,
        headers: {'Authorization': token},
        params:parm,
      }).then(function(res){
        if(res.status == 200){

          store.commit('NODETYPENAME',res.data);
          resolve(res)
        }else{
          reject(res)
        }
      })
    })
  },

  /*获取地域信息*/
  getArea(store,parm){
    return  new Promise( (resolve,reject) => {
      const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
      axios({
        method:'GET',
        url:API.area_node_regions,
        headers: {'Authorization': token},
        params:parm,
      }).then(function(res){
        if(res.status == 200){
          store.commit('AREATYPENAME',res.data);
          resolve(res)
        }else{
          reject(res)
        }
      })
    })
  }
}
