/**
 * Created by admin on 2017/3/28.
 */
export default {
  //更新服务器类型
  NODETYPENAME:(state,param)=>{state.node_type_name = param.data.node_types},
  //更新地域类型
  AREATYPENAME:(state,param)=>{state.area_type_name = param.data.regions},
}
