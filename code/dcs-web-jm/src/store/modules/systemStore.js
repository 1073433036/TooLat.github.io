import * as actions from '../actions/systemAct'
import * as getters from '../getters/systemGetters'

import {
  STORE_REGION_DATA,
  STORE_LOGIN_USER,
  GOTO_LOGIN_PAGE,
  GOTO_USER_MANAGEMENT,
  SHOW_INFO_TIP,
  STORE_COLOR_TABLE,
  TOGGLE_LEGEND_POPUP
} from '../mutation-types';

const state = {
  title: '江门市气象应急决策服务平台v1.1.7',
  regionConfig: {
    province: '广东',
    city: '江门',
    county: '',
    cityId: 5,
    countyId: 0
  },
  regionData: [],
  currentRegion: {},
  loginPage: false,
  loginUser: null,
  userManagement: false,
  infoTip: {
    flag: Math.random(),
    text: '',
    type: 'warning'   //success/warning/info/error  element-ui>Message组件
  },
  colorTable: {
    isColorDelete: Math.random(),
    isColorAdd: Math.random(),
    deleteColorType: '',
    colorTypeData: {}
  },
  legendPopup: false
}

const mutations = {
  [STORE_REGION_DATA](state, { type, data }) {
    state.regionData.push({ type, data });

    if(type === 'county') {
      state.currentRegion = {
        cityName: state.regionConfig.city,
        countyName: data.county.trim().substring(0, 2),
        cityId: Number(data.cityid),
        countyId: Number(data.countyid),
        type
      };
    }
    else {
      if(state.regionConfig.county === '') {
        state.currentRegion = {
          cityName: data.city.trim().substring(0, 2),
          countyName: '',
          cityId: Number(data.cityid),
          countyId: null,
          type: 'city'
        };
      }
    }
  },

  [GOTO_LOGIN_PAGE](state, action) {
    state.loginPage = action
  },

  [STORE_LOGIN_USER](state, user) {
    state.loginUser = user
  },

  [GOTO_USER_MANAGEMENT](state,action) {
    state.userManagement = action
  },

  [SHOW_INFO_TIP](state, { text, type='warning' }) {
    if(!text.length)
      return;
    state.infoTip.text = text;
    state.infoTip.type = type;
    state.infoTip.flag = Math.random();
  },

  [STORE_COLOR_TABLE](state, colorData) {
    if(colorData.type === 'add') {
      state.colorTable.colorTypeData = colorData.data;
      state.colorTable.isColorAdd = Math.random();
    } else {
      state.colorTable.deleteColorType = colorData.data.type;
      state.colorTable.isColorDelete = Math.random();
    }
  },

  [TOGGLE_LEGEND_POPUP](state, bool) {
    state.legendPopup = bool;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
