/**
 * Created by isec on 2017/4/19.
 */
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

const state = {
  node_type_name: [],
  area_type_name: [],
  monthTime: {},
  vue_loading: false
};

export default {
  state,
  getters,
  mutations,
  actions
}
