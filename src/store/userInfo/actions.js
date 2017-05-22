/**
 * Created by admin on 2017/3/28.
 */
import * as API from '../../api/api'
import axios from 'axios'

export default {

  //获取用户列表
   USERINFO_getUsers(store,parm){
     const token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
     return new Promise((resolve,reject)=>{
          axios({
          method:'GET',
          url:API.base_list,
          headers: {'Authorization': token},
          params:parm
          }).then(function(res){
          if(res.status == 200){
            store.commit('USERINFO_GETUSERS',res.data.data);
            resolve(res)
          }
          //登录异常
          }).catch(function(err){
            reject(err)
          })
      })

   }

}
