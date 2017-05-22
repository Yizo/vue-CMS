/**
 * Created by isec on 2017/4/19.
 */


export default {
  nodeTypeNames(state){
    return state.node_type_name
  },
  areaTypeName(state){
    return state.area_type_name
  },
  token(state){
    return state.token = JSON.parse(window.sessionStorage.getItem('loginInfo')).token;
  }
}
