import * as types from '../mutation-types'
import GeoPoi from '../../util/GeoPoi'
import { ModelAssess } from '../../util/modelAssess'

export const addGeoCollection = ({ commit }, {$http, type, subType, teamType, cityId, countyId=undefined}) => {
  let geoPoi = new GeoPoi($http);
  geoPoi.getPois(type, cityId, countyId, teamType)
    .then(data => {
      let dataHolder = {};
      for(let poi of data) {
        if(type === 'rescueteam') {
          let poiId = poi['pointid'];
          if(poiId in dataHolder === false)
            dataHolder[poiId] = [];
          dataHolder[poiId].push(poi);
        } else {
          dataHolder[poi.id] = poi;
        }
      }
      commit(types.ADD_GEO_COLLECTION, {type, subType, data: dataHolder});
      commit(types.ADD_POI_CLICK_EVENT, $http);
    });
  geoPoi = null;
}

export const removeGeoCollection = ({ commit }, {type, subType}) => {
  commit(types.REMOVE_GEO_COLLECTION, {type, subType});
  commit(types.REMOVE_POI_CLICK_EVENT);
}

//获取单个水库的雨量统计
export const getReservoirRain = async ({ commit}, { $http, regionObj, position }) => {
  try {
    let modelAssess = new ModelAssess($http, regionObj);
    let datetime = await modelAssess.getLatestNcFile('grid_nc');
    if(datetime) {
      datetime = `${datetime.substring(0, 4)}/${datetime.substring(4, 6)}/${datetime.substring(6, 8)} ${datetime.substring(8, 10)}:${datetime.substring(10, 12)}:00`;
      let ms = new Date(datetime).getTime();
      if(Math.abs(new Date().getTime() - ms) <= 3600000) {
        let ncInfo = await modelAssess.getNcInfo('grid_nc', `grid${new Date(datetime).Format('yyyyMMddHHmm00')}.nc`);
        let rainResponse = await modelAssess.getMultiPointValue(ncInfo, position);
        commit(types.UP_RESERVOIR_RAINFALL, rainResponse.data);
        return rainResponse.data;
      }
    }
    return Promise.reject();
  }
  catch(err) {
    commit(types.UP_RESERVOIR_RAINFALL, null);
    throw 'failed to get reservoir rain data';
  }
}

export const showMaterialList = ({ commit }, key) => {
    commit(types.SHOW_MATERIAL_LIST, key);
}

export const hidePoiDetailPopup = ({ commit }) => {
    commit(types.HIDE_POI_DETAIL_POPUP);
}

export const addGeoPoiSet = ({ commit }, { $http, type, subType, data}) => {
    commit(types.ADD_GEO_COLLECTION, { type, subType, data });
    commit(types.ADD_POI_CLICK_EVENT, $http);
}

export const clearAllGeoPoi = ({ commit }) => {
    commit(types.REMOVE_ALL_GEOPOI);
}
