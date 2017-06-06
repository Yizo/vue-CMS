/**
 * Created by admin on 2017/3/28.
 */
export default {
  rules: function (state) {
    return state.rules
  },
  LoginStatus: function (state) {
    return state.LoginStatus
  },
  versions: function (state) {
    let s = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    s.app_channels.unshift({name: "全部渠道"});
    s.app_versions.unshift({name: "全部版本"})
    return s;
  }
}
