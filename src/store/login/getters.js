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
    let sx = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    sx.app_channels.unshift({name: "全部渠道"});
    sx.app_versions.unshift({name: "全部版本"})
    return sx;
  }
}
