/**
 * Created by admin on 2017/3/28.
 */
import * as type from './types.js';

export default {
  /*日期*/
  [type.SETTIME](state,param){
    state.time = param;
  },
  //付费信息
  [type.FFINFO](state,param){
    state.ff_data = param.data;
  },
  [type.PAYDETAILS](state,parm){
    state.pay_details_data = parm
  },
  [type.CONSUMECOINS](state,parm){
    state.summary_data = parm
  }
}
