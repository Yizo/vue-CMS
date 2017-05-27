/**
 * Created by isec on 2017/4/14.
 */

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  channelData: {},
  addChannelItem: {},
  saveChannelSuccess: false
};

export default {
  state,
  getters,
  actions,
  mutations
}
