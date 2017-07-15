/**
 * Created by admin on 2017/3/28.
 */

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
  time: {
    year: '',
    month: ''
  },
  payChart: [],
  ff_data: [],//付费数据
  pay_details_data: null,//详情数据
  summary_data: null,//汇总数据
}

export default {
  state,
  getters,
  mutations,
  actions
}
