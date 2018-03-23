import * as actions from '../actions/typhAct'
import * as getters from '../getters/typhGet'

import {
  TOGGLE_TYPH_TIMELINE_STATUS,
  CHANGE_TYPH_CURRENT_YEAR,
  CHANGE_TYPH_CURRENT_NAME,
  STORE_TYPH_DATA,
  SELECT_TYPH,
  DELETE_HISTORY_TYPH,
  TOGGLE_CLICK_POPUP,
  INITIAL_TYPH_DATA,
  TOGGLE_CURRENT_TYPH_FLAG,
  TOGGLE_TYPH_MATCHING_POPUP,
  CHANGE_TYPH_CLICK_POINT_INDEX,
  CHANGE_TYPH_CLICK_POPUP_POS,
  STORE_TYPH_CLICK_FST_TIME,
  STORE_BEFOFE03_TYPH_IDS,
  SELECT_MATCHING_TYPH,
  TOGGLE_TYPH_REPORT_POPUP,
  TOGGLE_TYPH_OVER_POPUP,
  STORE_TYPH_OVER_POPUP_DATA,
  STORE_TYPH_OVER_POPUP_POS,
  STORE_TYPHOON_DATA
} from '../mutation-types'

const state = {
  typhoonData: null,
  selectedModel: null,
  currentTyphFlag: false,
  matchingPopup: false,
  selectedMatchingTyph: null,
  reportPopup: false,
  tideModel: {
    timeLineStatus: 'search',
    currentYear: null,
    currentTyphName: null,
    selectedTyph: null,
    containedTyphData: [],
    historyTyphIdArray: [],  //保存1949-2002年的台风tsid
  },
  typhClickData: {
    popupShow: false,
    popupPos: null,
    index: null,
    fstTime: null,
  },
  mouseOverData: {
    show: false,
    position: null,
    details: null
  },
  mouseOverPopup: false,
  clickPopup: false,
  clickIndex: null,

  grapesElementType: null,
}

const mutations = {
  [STORE_TYPHOON_DATA](state, data) {
    state.typhoonData = data;
  },

  [TOGGLE_TYPH_TIMELINE_STATUS](state, status) {
    state.tideModel.timeLineStatus = status;
  },

  [CHANGE_TYPH_CURRENT_YEAR](state, year) {
    state.tideModel.currentYear = year;
  },

  [CHANGE_TYPH_CURRENT_NAME](state, name) {
    state.tideModel.currentTyphName = name;
  },

  [STORE_TYPH_DATA](state, data, isNewData = false) {
    let arr = state.tideModel.containedTyphData.filter(el => el.tsId === data.tsId && el.id === data.id);
    if(arr.length)
      return;
    state.tideModel.containedTyphData.push(data);
  },

  [SELECT_TYPH](state, id) {
    state.tideModel.selectedTyph = id;
  },

  [DELETE_HISTORY_TYPH](state, id) {
    let ctnedHtyTyphData = state.tideModel.containedTyphData;

    ctnedHtyTyphData.forEach((el, index) => {
      if(el.tsId === id) {
        ctnedHtyTyphData.splice(index, 1);
        if (id === state.tideModel.selectedTyph)
          state.tideModel.selectedTyph = null;
        return;
      }
    });
  },

  [TOGGLE_CLICK_POPUP](state, action) {
    state.typhClickData.popupShow = action;
  },

  [INITIAL_TYPH_DATA](state) {
    state.tideModel = {
      timeLineStatus: 'search',
      currentYear: null,
      currentTyphName: null,
      selectedTyph: null,
      containedTyphData: [],
    };
  },

  [TOGGLE_CURRENT_TYPH_FLAG](state, action) {
    state.currentTyphFlag = action;
  },

  [TOGGLE_TYPH_MATCHING_POPUP](state, action) {
    state.matchingPopup = action;
  },

  [SELECT_MATCHING_TYPH](state, id) {
    state.selectedMatchingTyph = String(id);
  },

  [TOGGLE_TYPH_REPORT_POPUP](state, action) {
    state.reportPopup = action;
  },

  [CHANGE_TYPH_CLICK_POINT_INDEX](state, index) {
    state.typhClickData.index = index;
  },

  [CHANGE_TYPH_CLICK_POPUP_POS](state, pos) {
    state.typhClickData.popupPos = pos;
  },

  [STORE_TYPH_CLICK_FST_TIME](state, fstTime) {
    state.typhClickData.fstTime = fstTime;
  },

  [STORE_BEFOFE03_TYPH_IDS](state, data) {
    state.tideModel.historyTyphIdArray = Array.isArray(data) ? data : [];
  },

  [TOGGLE_TYPH_OVER_POPUP](state, bool) {
    state.mouseOverData.show = bool;
  },

  [STORE_TYPH_OVER_POPUP_DATA](state, data) {
    state.mouseOverData.details = data;
  },

  [STORE_TYPH_OVER_POPUP_POS](state, pos) {
    state.mouseOverData.position = pos;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
