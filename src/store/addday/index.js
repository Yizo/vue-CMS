/**
 * Created by admin on 2017/3/28.
 */

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {

  day_data: [],
  day_chart: [],
  day_details_data: [],
  month_data: [],
  month_chart: [],
  month_details_data: []

}

export default {
  state,
  getters,
  mutations,
  actions
}
