/**
 * Created by admin on 2017/3/28.
 */

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  //用户基础数据
  base:{
    star:false,
    data:{}
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
