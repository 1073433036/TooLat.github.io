import * as types from '../mutation-types'

import { ModelAssess } from '../../util/modelAssess'

export const toggleWarningElement = ({ commit }, index) => {
  commit(types.TOGGLE_STATION_WARNING_ELEMENT, index);
}

export const toggleWarningTime = ({ commit }, index) => {
  commit(types.TOGGLE_STATION_WARNING_TIME, index);
}

export const updateWarningStatus = async ({ commit }, { $http, regionObj, datetime }) => {
  let flag;
  try {
    let modelAssess = new ModelAssess($http, regionObj);
    const filename = modelAssess.getFilename('flowConv', datetime, true),
      modelname = modelAssess.getModelName('flowConv', true);
    let data = await modelAssess.getPointJson(modelname, filename);
    flag = true;
    commit(types.STORE_WARNING_DATA, data);
    modelAssess = null;
    return true;
  }
  catch(e) {
    if(flag)
      return;
    commit(types.STORE_WARNING_DATA, null);
  }
}

export const addWarningImage = async ({ commit }, { $http, regionObj, datetime, type, bounds, seledTime }) => {
  let modelAssess = new ModelAssess($http, regionObj);
  let filename, modelname, options;
  if(type.includes('RH') || type.includes('WM')) {
    filename = `${type}${datetime.Format('yyyyMMddHHmm00')}.nc`;
    modelname = `${type}_nc`;
    options = {};
  } else if(type === 'meteoWater') {
    filename = `st_pptn_r${datetime.Format('yyyyMMddHH0000')}.nc`;
    modelname = 'st_pptn_r_nc';
    options = { seledVar: 'data', seledTime };
  }

  let ncInfo;
  try {
    ncInfo = await modelAssess.getNcInfo(modelname, filename);
    let data = await modelAssess.getModelImage(ncInfo, Object.assign({ bounds }, options));
    commit(types.ADD_WARNING_IMAGE, { url: data.imgSrc, bounds });
    commit(types.STORE_WARNING_AREA_DATA, type);
  } catch(err) {
    commit(types.ADD_WARNING_IMAGE, { url: null, bounds });
    commit(types.STORE_WARNING_AREA_DATA, null);
    throw 'failed to add warning image';
  }

  try {
    let extremeRes = await modelAssess.getModelExtreme(ncInfo, options);
    commit(types.ADD_WARNING_EXTREME, Array.isArray(extremeRes.data) ? extremeRes.data[0] : null);
  } catch(e) {
    commit(types.ADD_WARNING_EXTREME, null);
    throw 'failed to add warning extreme';
  }

  modelAssess = null;

  return true;
}

export const toggleAnalysisStatus = ({ commit }, bool) => {
  commit(types.TOGGLE_WARNING_ANALYSIS_STATUS, bool);
}

export const clearWarningResult = ({ commit }) => {
  commit(types.CLEAR_WARNING_RESULT);
}

export const toggleWarningStatTable = ({ commit }, bool) => {
  commit(types.TOGGLE_WARNING_STAT_TABLE, bool);
}

export const toggleStationWarning = ({ commit }) => {
  commit(types.TOGGLE_STATION_WARNING);
}

export const storeStationWarningSum = ({ commit }, sum) => {
  commit(types.STORE_STATION_WARNING_SUM, sum);
}
