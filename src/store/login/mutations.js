/**
 * Created by admin on 2017/3/28.
 */
import * as type from "./types.js";


export default {
  //登录
  [type.LOGIN_LOGIN](state, param){
    state.LoginStatus.data = param.data;
    window.sessionStorage.setItem('loginInfo', JSON.stringify(param.data));
    JSON.parse(window.sessionStorage.getItem('loginInfo'))
  },
  //登录请求是否成功
  [type.LOGIN_ISLOGINREQUEST](state, param){
    state.LoginStatus.success = param;
  }
}
