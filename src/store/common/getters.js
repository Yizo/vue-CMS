/**
 * Created by isec on 2017/4/19.
 */
import * as js from "../../assets/js/js";

export default {
  nodeTypeNames(state){
    return state.node_type_name
  },
  areaTypeName(state){
    return state.area_type_name
  },
  getLoading(state){
    return state.vue_loading
  },
  token(state){
    return state.token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
  },
  //全局开始与结束日期
  initDate: (state) => {
    return state.monthTime = js.monthTime();
  },
}
