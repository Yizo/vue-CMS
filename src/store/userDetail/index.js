/**
 * Created by admin on 2017/3/28.
 */

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  id: 0,
  //基础信息
  UD_base_info: {
    data: []
  },
  //连接请求
  UD_connection_logs: {
    data: []
  },
  //关联设备
  UD_devices: {
    data: []
  },
  //操作路径
  UD_operation_logs: {
    data: []
  },
  //操作路径分页数据
  UD_current: [],
  //用户去向
  UD_access_logs: {
    data: []
  },
  //充值信息
  UD_transaction_logs: {
    data: []
  },
  //信息管理
  UD_profile: {
    data: []
  },
  UD_consumption_logs: {
    data: []
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
