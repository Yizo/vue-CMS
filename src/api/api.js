/**
 * Created by admin on 2017/3/28.
 */
/*开发服*/
/*export const url = 'https://xiaoguoqi.com'*/

export const phpUrl = 'https://mirror.limaojs.com'

/*测试服*/
export const url = 'https://staging.xiaoguoqi.com'
/*正式服*/
/*export const url = 'https://licatjsq.com'*/
/*登录接口:成功则返回token*/
export const login = url + '/api/manage/v1/auth'

/*渠道版本配置 - 分组列表*/
export const group_index = url + '/api/manage/v1/system_enums/group_index'

/*官网下载统计*/
/*获取访问总量和下载总量*/
export const website_sum = phpUrl + '/baas/v3/limaoservice/getWebStatSum'

/*按日期获取分页用户访问列表*/
export const website_list = phpUrl + '/baas/v3/limaoservice/getAccessPageListByDate'

/*获取下载量列表*/
export const website_download_list = phpUrl + '/baas/v3/limaoservice/getDownloadList'

/*users：用户基础信息*/
/*用户列表*/
export const base_list = url + '/api/manage/v1/users/base_list'
/*批量加钻*/
export const batch_diamond = url + '/api/manage/v1/users/batch_reward_coins'
/*账号详情-基础信息*/
export const u_base_info = url + '/api/manage/v1/user_details/{id}/base_info'
/*账号详情-连接请求*/
export const u_connection_logs = url + '/api/manage/v1/user_details/{id}/connection_logs'
/*账号详情-关联设备*/
export const u_devices = url + '/api/manage/v1/user_details/{id}/devices'
/*账号详情-操作路径*/
export const u_operation_logs = url + '/api/manage/v1/user_details/{id}/operation_logs'
/*账号详情-用户去向*/
export const u_access_logs = url + '/api/manage/v1/user_details/{id}/access_logs'
/*账号详情-充值信息*/
export const u_transaction_logs = url + '/api/manage/v1/user_details/{id}/transaction_logs'
/*账号详情-信息管理*/
export const u_profile = url + '/api/manage/v1/user_details/{id}/profile'
/*账号详情-消费信息*/
export const u_consumption_logs = url + '/api/manage/v1/user_details/{id}/consumption_logs'
/*账号详情-修改信息管理*/
export const u_up_profile = url + '/api/manage/v1/user_details/{id}/update_profile'

/*硬件统计*/
export const hardware_stat = url + '/api/manage/v1/users/hardware_stat'
/*硬件统计详情*/
export const hardware_stat_details = url + '/api/manage/v1/users/hardware_stat_details'
/*运营商统计*/
export const operator_stat = url + '/api/manage/v1/users/operator_stat'
/*运营商统计详情*/
export const operator_stat_details = url + '/api/manage/v1/users/operator_stat_details'
/*用户状态统计*/
export const status_stat = url + '/api/manage/v1/users/status_stat'
/*用户状态详情*/
export const status_stat_details = url + '/api/manage/v1/users/status_stat_details'
/*分享统计*/
export const share_stat = url + '/api/manage/v1/users/share_stat'
/*分享人数统计详情*/
export const share_users_stat_details = url + '/api/manage/v1/users/share_users_stat_details'
/*分享次数统计详情*/
export const share_count_stat_details = url + '/api/manage/v1/users/share_count_stat_details'


/*地域配置-列表*/
export const node_regions = url + '/api/manage/v1/node_regions'
/*地域配置*/
export const base_list_id = url + '/api/manage/v1/node_regions/{id}'
/*硬件统计*/
export const base_info = url + '/api/manage/v1/user_details/{id}/base_info'
/*硬件统计详情*/
export const connection_logs = url + '/api/manage/v1/user_details/{id}/connection_logs'

/*页面点击*/
//页面点击-列表
export const pageclick_list = url + '/api/manage/v1/user_operation_stats'
//页面点击-点击次数详情
export const pageclick_visit_details = url + '/api/manage/v1/user_operation_stats/visit_details'
//页面点击-用户详情
export const pageclick_user_details = url + '/api/manage/v1/user_operation_stats/user_details'

/*失败信息*/
/*连接失败*/
export const connection_failed_logs = url + '/api/manage/v1/connection_failed_logs'
/*连接失败详情*/
export const connection_failed_detail = url + '/api/manage/v1/connection_failed_logs/detail'
/*连接失败图表*/
export const connection_failed_chart = url + '/api/manage/v1/connection_failed_logs/chart'
/*登录失败*/
export const loginfail = url + '/api/manage/v1/user_signin_failed_logs'
/*登录失败图表*/
export const loginfail_chart = url + '/api/manage/v1/user_signin_failed_logs/chart'
/*登录失败详情*/
export const loginfail_detail = url + '/api/manage/v1/user_signin_failed_logs/detail'
/*用户未操作*/
export const unext = url + '/api/manage/v1/user_no_operation_logs'
/*用户未操作图表*/
export const unext_chart = url + '/api/manage/v1/user_no_operation_logs/chart'
/*未操作详情*/
export const unext_detail = url + '/api/manage/v1/user_no_operation_logs/detail'

/*封号日志*/
export const user_status_logs = url + '/api/manage/v1/user_status_logs'

/*动态服务器IP*/
export const dynamic_ip = url + '/api/manage/v1/dynamic_servers';
/*添加动态服务器IP*/
export const dynamic_ip_add = url + '/api/manage/v1/dynamic_servers';
/*删除动态服务器IP*/
export const dynamic_ip_delete = url + '/api/manage/v1/dynamic_servers{id}';
/*更新动态服务器IP*/
export const dynamic_ip_update = url + '/api/manage/v1/dynamic_servers{id}';

/*版本渠道配置*/
/*列表*/
export const config_channel_list = url + '/api/manage/v1/system_enums';
/*创建*/
export const config_channel_add = url + '/api/manage/v1/system_enums';
/*删除*/
export const config_channel_delete = url + '/api/manage/v1/system_enums/{id}';
/*更新*/
export const config_channel_update = url + '/api/manage/v1/system_enums/{id}';

/*服务器类型配置*/
/*列表-创建*/
export const server_node_types = url + '/api/manage/v1/node_types';
/*删除-更新*/
export const server_node_types_update = url + '/api/manage/v1/node_types/';

/*地域配置*/
/*列表-创建*/
export const area_node_regions = url + '/api/manage/v1/node_regions';
/*更新*/
export const area_update = url + '/api/manage/v1/node_regions/';

/*动态IP配置*/
/*列表-更新-删除*/
export const dynamic_servers = url + '/api/manage/v1/dynamic_servers';
/*动态IP配置-推送*/
export const dynamic_servers_push = url + '/api/manage/v1/dynamic_servers/push';

/*用户类型配置*/
/*列表-创建*/
export const user_types_get = url + '/api/manage/v1/user_groups';
/*用户类型配置-更新*/
export const user_types_updata = url + '/api/manage/v1/user_groups/{id}';

/*付费信息*/
/*人数统计*/
export const t_users_count_collects = url + '/api/manage/v1/transaction_logs/users_count_collects';
/*充值信息图表数据*/
export const transaction_logs_chart = url + '/api/manage/v1/transaction_logs/details_chart';
/*充值详情*/
export const transaction_logs_details = url + '/api/manage/v1/transaction_logs/details';
/*充值金额信息详情*/
export const t_recharge_amount_details = url + '/api/manage/v1/transaction_logs/recharge_amount_details';
/*充值人数信息详情*/
export const t_recharge_user_details = url + '/api/manage/v1/transaction_logs/recharge_user_details';
/*消费钻石信息详情*/
export const t_consume_coins_details = url + '/api/manage/v1/transaction_logs/consume_coins_details';
/*充值金额汇总/消费钻石汇总/充值人数汇总*/
export const consume_coins_details = url + '/api/manage/v1/transaction_logs/collects';

/*充值记录*/
export const recharge_list_get = url + '/api/manage/v1/transaction_logs';
/*充值记录-支付方式统计*/
export const recharge_payment_method_collects = url + '/api/manage/v1/transaction_logs/payment_method_collects';

/*新增用户*/
/*日新增用户-列表*/
export const addday_day_list = url + '/api/manage/v1/new_user_stats/day_index';
/*日新增用户-图表*/
export const addday_day_chart = url + '/api/manage/v1/new_user_stats/day_chart';
/*日新增用户-详情*/
export const addday_day_details = url + '/api/manage/v1/new_user_stats/day_details';
/*月新增用户-列表*/
export const addday_month_list = url + '/api/manage/v1/new_user_stats/month_index';
/*月新增用户-图表*/
export const addday_month_chart = url + '/api/manage/v1/new_user_stats/month_chart';
/*月新增用户-详情*/
export const addday_month_details = url + '/api/manage/v1/new_user_stats/month_details';

/*活跃用户*/
/*日活跃用户-列表*/
export const activeday_day_list = url + '/api/manage/v1/active_user_stats/day_index';
/*日活跃-图表*/
export const activeday_day_chart = url + '/api/manage/v1/active_user_stats/day_chart';
/*日活跃用户-详情*/
export const activeday_day_details = url + '/api/manage/v1/active_user_stats/day_details';
/*月活跃用户-列表*/
export const activeday_month_list = url + '/api/manage/v1/active_user_stats/month_index';
/*月活跃-图表*/
export const activeday_month_chart = url + '/api/manage/v1/active_user_stats/month_chart';
/*月活跃用户-详情*/
export const activeday_month_details = url + '/api/manage/v1/active_user_stats/month_details';

/*留存*/
/*留存-列表*/
export const remain_list = url + '/api/manage/v1/user_retention_rates';
/*留存-图表*/
export const remain_chart = url + '/api/manage/v1/user_retention_rates/chart';
/*留存-当日新增详情*/
export const remain_details = url + '/api/manage/v1/user_retention_rates/details';
/*留存-留存数详情*/
export const remain_retention_details = url + '/api/manage/v1/user_retention_rates/retention_details';

/*服务器信息*/
/*当前在线人数*/
export const server_online_list_get = url + '/api/manage/v1/nodes/online_users';
/*当前在线人数-在线用户详情*/
export const online_detail_get = url + '/api/manage/v1/nodes/online_details';
/*当前在线人数-地域连接人数详情*/
export const server_region_details = url + '/api/manage/v1/nodes/region_details';
/*当前在线人数-地域连接人数详情 - 在线人数详情*/
export const server_region_user_details = url + '/api/manage/v1/nodes/region_user_details';
/*当前在线人数-历史记录*/
export const server_online_users_stat = url + '/api/manage/v1/nodes/online_users_stat';
/*当前在线人数-历史记录-图表*/
export const server_online_users_stat_chart = url + '/api/manage/v1/nodes/online_users_stat_chart';
/*当前在线人数-历史记录-日期详情*/
export const server_online_users_stat_details = url + '/api/manage/v1/nodes/online_users_stat_details';
/*当前在线人数-历史记录-总计在线详情*/
export const server_online_users_stat_second_details = url + '/api/manage/v1/nodes/online_users_stat_second_details';
/*服务器信息-历史记录/列表*/
export const server_proxy_list = url + '/api/manage/v1/nodes/proxy_server_status_stat';
/*服务器信息-图表*/
export const server_proxy_char = url + '/api/manage/v1/nodes/proxy_server_status_stat_chart';
/*服务器信息-日期详情*/
export const server_proxy_details = url + '/api/manage/v1/nodes/proxy_server_status_stat_details';


/*服务器详情信息表*/
export const server_details_info = url + '/api/manage/v1/nodes/details'
/*动态IP状态*/
/*列表*/
export const dynamic_status = url + '/api/manage/v1/dynamic_servers/status';
/*详情*/
export const dynamic_status_details = url + '/api/manage/v1/dynamic_servers/{id}/status_details';

/*登录IP-地域分析*/
export const loginip_region_stat = url + '/api/manage/v1/user_signin_logs/region_stat'
/*登录IP-时间段分析*/
export const loginip_period_stat = url + '/api/manage/v1/user_signin_logs/period_stat'
/*登录IP-时间段分析*/
export const loginip_period_stat_char = url + '/api/manage/v1/user_signin_logs/period_stat_chart'
/*登录IP*/
export const loginip = url + '/api/manage/v1/user_signin_logs'

/*去向IP*/
/*去向IP列表*/
export const dstip_list = url + '/api/manage/v1/user_connection_logs'
/*域名描述配置 - 快捷更新*/
export const dstip_quick_update = url + '/api/manage/v1/domain_enums/quick_update'
/*去向IP-地域分析详情*/
//查看每个国家访问指定域名的人数
export const dstip_domain_country_details = url + '/api/manage/v1/user_connection_logs/domain_country_details'
/*去向IP-地域分析详情*/
//查看指定域名的地域、人数、占比
export const dstip_domain_region_details = url + '/api/manage/v1/user_connection_logs/domain_region_details'
/*去向IP-访问次数详情*/
export const dstip_visit_details = url + '/api/manage/v1/user_connection_logs/visit_details'
/*去向IP-访问用户数详情*/
export const dstip_user_details = url + '/api/manage/v1/user_connection_logs/user_details'

/*用户使用频率*/
/*列表*/
export const frequency_list = url + '/api/manage/v1/node_connection_logs/count_scope_index'
/*详情*/
export const frequency_details = url + '/api/manage/v1/node_connection_logs/count_scope_details'

/*套餐配置*/
export const set_meal_get = url + '/api/manage/v1/plans';

/*添加一条配置*/
export const set_meal_add = url + '/api/manage/v1/plans';

/*删除一条套餐配置*/
export const set_meal_delete = url + '/api/manage/v1/plans/';

/*更新一条数据*/
export const set_meal_update = url + '/api/manage/v1/plans/';


/*用户反馈 获取*/
export const feedback_get = url + '/api/manage/v1/feedbacks';
/*用户反馈 更新*/
export const feedback_update = url + '/api/manage/v1/feedbacks/';

/*服务器配置列表 获取信息*/
export const server_list_get = url + '/api/manage/v1/nodes';
/*服务器配置列表 添加*/
export const server_list_add = url + '/api/manage/v1/nodes';
/*服务器配置列表 更新*/
export const server_list_update = url + '/api/manage/v1/nodes/{id}';

/*参数配置*/
/*列表-创建*/
export const system_settings = url + '/api/manage/v1/system_settings'
/*删除-更新*/
export const system_settings_up = url + '/api/manage/v1/system_settings/{id}'
/*系统参数配置*/
/*列表*/
export const system_service = url + '/api/manage/v1/service_settings'
/*更新*/
export const system_service_up = url + '/api/manage/v1/service_settings/update_multiple'


/*权限组管理*/
/*管理权限组管理-列表-创建*/
export const admin_roles = url + '/api/manage/v1/admin_roles'
/*管理权限组管理-删除-更新*/
export const admin_roles_up = url + '/api/manage/v1/admin_roles/{id}'
/*管理员操作日志*/
export const operation_logs = url + '/api/manage/v1/admins/operation_logs'
/*管理员钻石操作日志*/
export const coin_operation_logs = url + '/api/manage/v1/admins/coin_operation_logs'


/*管理员管理*/
/*管理员管理-列表-创建*/
export const admins = url + '/api/manage/v1/admins'
/*管理员管理-禁用*/
export const admins_disable = url + '/api/manage/v1/admins/{id}/disable'
/*管理员管理-启用*/
export const admins_enable = url + '/api/manage/v1/admins/{id}/enable'
/*管理员管理-更新*/
export const admins_up = url + '/api/manage/v1/admins/{id}'

/*帮助问答*/
/*列表*/
export const help_list = url + '/api/manage/v1/help_manuals'
/*创建*/
export const help_create = url + '/api/manage/v1/help_manuals'
/*删除*/
export const help_del = url + '/api/manage/v1/help_manuals/{id}'
/*更新*/
export const help_up = url + '/api/manage/v1/help_manuals/{id}'
/*导航设置*/
/*列表*/
export const help_navigations_list = url + '/api/manage/v1/website_navigations'
/*创建*/
export const help_navigations_create = url + '/api/manage/v1/website_navigations'
/*删除*/
export const help_navigations_del = url + '/api/manage/v1/website_navigations/{id}'
/*更新*/
export const help_navigations_up = url + '/api/manage/v1/website_navigations/{id}'


/*客户端去向日志*/
export const client_connection_logs = url + '/api/manage/v1/client_connection_logs'
