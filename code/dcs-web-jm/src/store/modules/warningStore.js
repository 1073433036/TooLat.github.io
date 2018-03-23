import * as actions from '../actions/warningAct'
import * as getters from '../getters/warningGetters'

import {
  TOGGLE_STATION_WARNING_ELEMENT,
  TOGGLE_STATION_WARNING_TIME,
  UPDATE_WARNING_STATUS,
  ADD_WARNING_IMAGE,
  STORE_WARNING_AREA_DATA,
  TOGGLE_WARNING_ANALYSIS_STATUS,
  CLEAR_WARNING_RESULT,
  TOGGLE_WARNING_STAT_TABLE,
  STORE_STATION_WARNING_SUM,
  TOGGLE_STATION_WARNING,
  ADD_WARNING_EXTREME,
  STORE_WARNING_DATA
} from '../mutation-types'

import { Helper } from '../../util/Helper'

const state = {
  elements: {
    rain: {
      key: 'rain',
      text: '降雨量',
      selected: true,
      times: [
        'RH01', 'RH03', 'RH06', 'RH12', 'RH24', 'RH48', 'RH72'
        /*{ key: 'RH01', text: '1h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH03', text: '3h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH06', text: '6h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH12', text: '12h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH24', text: '24h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH48', text: '48h', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
        { key: 'RH72', text: '72h', selected: false, isWarning: false, effectedTowns: [], stationList: [] }*/
      ]
    },
    //wind10: { key: 'Wind10', text: '平均风', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    windMax: { key: 'WindMax', text: '极大风', selected: false, times: ['WM01', 'WM03', 'WM06', 'WM12', 'WM24', 'WM48', 'WM72'] }
  },
  warningTimes: [
    { text: '1', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '3', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '6', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '12', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '24', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '48', selected: false, isWarning: false, effectedTowns: [], stationList: [] },
    { text: '72', selected: false, isWarning: false, effectedTowns: [], stationList: [] }
  ],
  warningTownsData: [],
  isWarningAnalysis: false,
  statTableShow: false,
  stationWarningShow: false,
  stationWarningSum: 0
}

const mutations = {
  [TOGGLE_STATION_WARNING_ELEMENT](state, key) {
    let elements = state.elements;

    if(elements[key].selected)
      return;

    for(let i in elements) {
      elements[i].selected = i === key;
    }
  },

  [TOGGLE_STATION_WARNING_TIME](state, index) {
    state.warningTimes.forEach((t, i) => {
      t.selected = index === i;
    });
  },

  [STORE_WARNING_DATA](state, data) {
    state.warningData = data;
  },

  [UPDATE_WARNING_STATUS](state, data) {
    let eles = state.elements,
        warningTimes = state.warningTimes;
    let keys = Object.keys(eles);

    for(let key of keys) {
      let el = eles[key];
      if(key === 'rain') {
        el.times.forEach((t, i) => {
          const lowerCaseKey = t.toLowerCase();
          if(data !== null && data.hasOwnProperty(lowerCaseKey)) {
            warningTimes[i].isWarning = data[lowerCaseKey];
            warningTimes[i].effectedTowns = data[`${lowerCaseKey}_Town`] ? data[`${lowerCaseKey}_Town`].split(',') : [];
            warningTimes[i].stationList = data[`list${t}`];
          } else {
            warningTimes[i].isWarning = false;
            warningTimes[i].effectedTowns = [];
            warningTimes[i].stationList = [];
          }
        });
      } else {
        if(data !== null && data.hasOwnProperty(key)) {
          el.isWarning = data[key];
          el.effectedTowns = data[`${key}_Town`] ? data[`${key}_Town`].split(',') : [];
          el.stationList = data[`list${el.key}`];
        } else {
          el.isWarning = false;
          el.effectedTowns = [];
          el.stationList = [];
        }
      }
    }
  },

  [ADD_WARNING_IMAGE](state, { url, bounds }) {
    let helper = new Helper(window['viewer']);
    if(state.warningLayer) {
      helper.removeImgLayer(state.warningLayer);
      delete state.warningLayer;
    }

    if(typeof url === 'string')
      state.warningLayer = helper.addImgLayer(url, bounds);
    helper = null;
  },

  [ADD_WARNING_EXTREME](state, data) {
    let helper = new Helper(window['viewer']);
    if(state.extremeLabel) {
      helper.removeEntity(state.extremeLabel);
      delete state.extremeLabel;
    }
    if(data !== null && state.warningLayer) {
      state.extremeLabel = helper.addLabel(data.val ? data.val.toFixed(1) : '0', [data.lon, data.lat], .8, 'red', 'center',
        'center', [0,0], true, 'extreme_label', 'both', 4);
    }
    helper = null;
  },

  [STORE_WARNING_AREA_DATA](state, type) {
    if(type === null) {
      state.warningTownsData = [];
      return;
    }

    let thresholdKey;
    let eleKey = type.toLowerCase();
    if(eleKey.includes('rm') || eleKey.includes('rh')) {
      let key = eleKey.includes('rm') ? eleKey.replace('rm', '') : eleKey.replace('rh', '');
      thresholdKey = `rain_threshold_${Number(key)}h`;
    } else {
      thresholdKey = 'wind_threshold_max';
    }

    let eleData = {
      stationList: state.warningData[`list${type}`],
      effectedTowns: state.warningData[`${eleKey}_Town`] ? state.warningData[`${eleKey}_Town`].split(',') : []
    };

    if(!eleData.stationList.length || !eleData.effectedTowns.length) {
      state.warningTownsData = [];
      return;
    }
    let townsData = [];
    eleData.effectedTowns.forEach((town, index) => {
      let stationInfo = eleData.stationList[index];
      if(stationInfo === null)
        return true;
      townsData.push(Object.assign({
        townName: town,
        threshold: stationInfo[thresholdKey].toFixed(1),
        value: stationInfo[eleKey].toFixed(1),
        station: `${stationInfo['stationID']}-${stationInfo.name}`
      }, eleData.stationList[index]));
    });
    state.warningTownsData = townsData;
  },

  [TOGGLE_WARNING_ANALYSIS_STATUS](state, bool) {
    state.isWarningAnalysis = bool;
  },

  [CLEAR_WARNING_RESULT](state) {
    let helper = new Helper(viewer);
    if(state.warningLayer) {
      helper.removeImgLayer(state.warningLayer);
      delete state.warningLayer;
    }
    if(state.extremeLabel) {
      helper.removeEntity(state.extremeLabel);
      delete state.extremeLabel;
    }
    /*
    for(let i in state.elements) {
      if(i === 'rain') {
        for(let tm of state.elements[i].times) {
          if(tm.selected)
            tm.selected = false;
        }
      }
      state.elements[i].selected = false;
    }*/
    state.warningTownsData = [];
    state.isWarningAnalysis = false;
    state.statTableShow = false;
    helper = null;
  },

  [TOGGLE_WARNING_STAT_TABLE](state, bool) {
    state.statTableShow = bool;
  },

  [TOGGLE_STATION_WARNING](state) {
    state.stationWarningShow = !state.stationWarningShow;
  },

  [STORE_STATION_WARNING_SUM](state, sum) {
    state.stationWarningSum = sum;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
