/**
 * Created by admin on 2017/3/28.
 */
import * as type from './types.js';

export default {

  [type.ACTIVEDAY_DAY](state,param){
    state.day_data = param.data;
  },
  [type.ACTIVEDAY_DAY_DETAILS](state,parm){
    state.day_details_data = parm
  },
  [type.ACTIVEDAY_MONTH](state,parm){
    state.month_data = parm
  },
  [type.ACTIVEDAY_MONTH_DETAILS](state,parm){
    state.month_details_data = parm
  }
}
