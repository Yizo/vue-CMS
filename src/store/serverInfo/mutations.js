/**
 * Created by isec on 2017/4/15.
 */

import * as type from "./types";

export default {
  [type.GET_DNCIP_DATA](state, data){
    state.dncIpData = data.data;
  },
  [type.ADD_DNCIP_ITEM](state, data){
  },
  [type.DELETE_DNCIP_ITEM](state, data){
  },
  [type.UPDATE_DNCIP_ITEM](state, data){
  },
  [type.GET_PERSON_DETAILS](state, data){
    state.personDetails = data.data;
  },
  [type.GET_REGION_DETAILS](state, data){
    state.regionDetails = data.data;
  },
  [type.GET_REGION_lINE_DETAILS](state, data){
    state.regionLineDetails = data.data;
  },
  [type.GET_REGION_AREA_DETAILS](state, data){
    state.regionAreaDetails = data.data;
  },
  [type.GET_REGION_AREA_USER_DETAILS](state, data){
    state.regionAreaUserDetails = data.data;
  }
}
