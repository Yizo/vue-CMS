/**
 * Created by admin on 2017/3/28.
 */
import * as type from "./types.js";


export default {
  //获取用户基础信息
  [type.USERINFO_GETUSERS](state, param){
    state.base.data = param;
  }
}
