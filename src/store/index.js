/**
 * Created by admin on 2017/3/28.
 */
import Vue from "vue";
import Vuex from "vuex";
import LOGIN from "./login/index";
import USERINFO from "./userInfo/index";
import CHANNELCONFIG from "./channelConfig/index";
import SERVERINFO from "./serverInfo/index";
import PAYINFO from "./payInfo/index";
import COMMON from "./common/index";
import USERDETAIL from "./userDetail/index";
import ADDDAY from "./addday/index";
import ACTIVEDAY from "./activeday/index";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    LOGIN, USERINFO, CHANNELCONFIG, SERVERINFO, PAYINFO, COMMON, USERDETAIL, ADDDAY, ACTIVEDAY
  }
});
