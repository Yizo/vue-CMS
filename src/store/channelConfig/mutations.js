/**
 * Created by isec on 2017/4/14.
 */

import * as type from './types'

export default {
  [type.GET_CHANNEL_DATA](state, res){
    state.channelData = res.data
  },
  [type.ADD_CHANNEL](state, res){
    state.channelData['system_enums'].push(res.data);
  },
  [type.UPDATE_CHANNEL](state, res){

  },
  [type.DELETE_CHANNEL](state, res){

  },
}
