/**
 * Created by admin on 2017/3/28.
 */
import * as API from '../../api/api'
import axios from 'axios'

export default {
  //登录
    LOGIN_login: function (store,parm) {
      return new Promise( (resoleve,reject) => {
        axios({
          method:'POST',
          url:API.login,
          data:{
            username:parm.UserForm.name,
            password:parm.UserForm.psw
          },
        }).then(function(res){
          if(res.status == 200){
            store.commit('LOGIN_LOGIN',res.data);
          }else{
            store.commit('LOGIN_LOGIN',res.data)
          }
          if(!!parm.fn && typeof parm.fn === 'function'){
            parm.fn(store)
          }
          resoleve(res)
        })
      })
   }
}
