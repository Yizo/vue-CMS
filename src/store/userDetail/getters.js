/**
 * Created by admin on 2017/3/28.
 */
export default {
  /*获取ID*/
  getId: (state) => state.id,
  /*账号详情-基础信息*/
  UD_base_info: (state) => state.UD_base_info.data,
  /*账号详情-连接请求*/
  UD_connection_logs: (state) => state.UD_connection_logs.data,
  /*账号详情-关联设备*/
  UD_devices: (state) => state.UD_devices.data,
  /*账号详情-操作路径*/
  UD_operation_logs: (state) => state.UD_operation_logs.data,
  /*账号详情-用户去向*/
  UD_access_logs: (state) => state.UD_access_logs.data,
  /*账号详情-充值信息*/
  UD_transaction_logs: (state) => state.UD_transaction_logs.data,
  /*账号详情-信息管理*/
  UD_profile: (state) => state.UD_profile.data,
  /*消费信息*/
  UD_consumption_logs: (state) => state.UD_consumption_logs.data,
  UD_current: (state) => state.UD_current

}
