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
  },
  //更新版本和渠道
  upChannerVerion (state) {
    let s = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    s.app_channels.unshift({name: "全部渠道"});
    s.app_versions.unshift({name: "全部版本"});
    state.channerVerion = s
  }

}
