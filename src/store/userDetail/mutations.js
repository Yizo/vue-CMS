/**
 * Created by admin on 2017/3/28.
 */
import * as type from "./types.js";

export default {
  SETID: (state, parm) => state.id = parm,
  /*账号详情-基础信息*/
  [type.u_base_info]: (state, parm) => state.UD_base_info = parm,
  /*账号详情-连接请求*/
  [type.u_connection_logs]: (state, parm) => state.UD_connection_logs = parm,
  /*账号详情-关联设备*/
  [type.u_devices]: (state, parm) => state.UD_devices = parm,
  /*账号详情-操作路径*/
  [type.u_operation_logs]: (state, parm) => state.UD_operation_logs = parm,
  u_current: (state, parms) => {
    let logs = state.UD_operation_logs.data.logs;
    let data = [];
    let parm = {
      total: logs ? logs.length : 0,
      current: parms.current,
      pageSize: parms.pageSize
    }

    if (parm.total == 0) {
      state.UD_current = data
      return data
    } else {
      if (parm.current == 1) {
        data = logs.filter((item, index, array) => {
          return index >= 0 && index < parm.pageSize
        })
      } else {
        let x = (parseInt(parm.current) - 1) * parseInt(parm.pageSize);
        let y = x + parseInt(parm.pageSize);
        data = logs.filter((item, index, array) => {
          return index >= x && index < y
        })
      }
      state.UD_current = data
      return data
    }
  },
  /*账号详情-用户去向*/
  [type.u_access_logs]: (state, parm) => state.UD_access_logs = parm,
  /*账号详情-充值信息*/
  [type.u_transaction_logs]: (state, parm) => state.UD_transaction_logs = parm,
  /*账号详情-信息管理*/
  [type.u_profile]: (state, parm) => state.UD_profile = parm,
}
