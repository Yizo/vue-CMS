/**
 * Created by admin on 2017/3/28.
 */

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  //校验规则
  rules: {
    name: [
      {required: true, message: '请输入账号', trigger: 'blur'},
      {min: 3, message: '长度至少为5', trigger: 'blur'}
    ],
    psw: [
      {required: true, message: '请输入密码', trigger: 'blur'},
      {min: 3, message: '长度至少为6', trigger: 'blur'}
    ],
  },
  //登录数据
  LoginStatus: {
    star: false,//未登录
    data: null
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
