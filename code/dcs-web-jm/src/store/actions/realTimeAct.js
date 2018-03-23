import * as types from '../mutation-types'

import { MeteoMonitor } from '../../util/MeteoMonitor'

export const initMeteoContainer = ({ commit }, container) => {
    commit(types.INIT_METEO_CONTAINER, container);
}

export const addMeteoStation = ({ commit, state }, { datetime, elements=undefined, city, county=undefined }) => {
    state.container.getStationsByDataunit(city, county)
      .then(data => {
        commit(types.ADD_REALTIME_STATION, { data, type: 'station' });
        return state.container.getStationRealByDataunit(datetime, city, elements, county);
      })
      .then(data => {
        commit(types.SET_STATION_REALDATA, data);
      });
}

export const removeMeteoStation = ({ commit }) => {
    commit(types.REMOVE_REALTIME_STATION, 'station');
    //commit(types.REMOVE_STATION_EVENT);
}

export const addNewSwanProduct = ({ commit, state }, { info, type, element, datetime, level = 3, time = 0 }) => {
  state.container.getNewSwanProduct(element, datetime, level, time)
    .then(layer => {
      if(!info.selected)
        return;
      commit(types.ADD_METEO_LAYER, {type, layer});
    });
}

export const addCloudLayer = ({ commit, state }, { info, type, datetime }) => {
    state.container.getCloudImage(datetime)
      .then((layer) => {
          if(!info.selected)
              return;
          commit(types.ADD_METEO_LAYER, {type, layer});
      });
}

export const addSwanProduct = ({ commit, state }, { info, type, datetime }) => {
    state.container.getSwanProduct(type, datetime)
      .then((layer) => {
          if(!info.selected)
            return;
          commit(types.ADD_METEO_LAYER, {type, layer});
      });
}

export const removeMeteoLayer = ({ commit }, type) => {
    commit(types.REMOVE_METEO_LAYER, type);
}

export const getStationRealData = ({ commit, state }, { datetime, elements=undefined, city, county=undefined }) => {
  state.container.getStationRealByDataunit(datetime, city, elements, county)
    .then((data) => {
        commit(types.SET_STATION_REALDATA, data);
    })
    .catch(e => {
        commit(types.SET_STATION_REALDATA, {});
    });
}

export const addAQIStation = ({ commit, state }, { datetime, city, county=undefined }) => {
    state.container.getAQIStation(city, county)
      .then(data => {
          commit(types.ADD_REALTIME_STATION, { data, type: 'aqiStation'});
          commit(types.ADD_AQI_STATION_EVENT);
      });
}

export const removeAQIStation = ({ commit }) => {
    commit(types.REMOVE_REALTIME_STATION, 'aqiStation');
    commit(types.REMOVE_AQI_STATION_EVENT);
}

export const getAQIStationData = ({ commit, state }, { datetime, city, county=undefined }) => {
    state.container.getAQIData(datetime, city, county)
      .then(data => {
          commit(types.SET_AQI_STATION_DATA, {data, datetime});
      })
      .catch(e => {
          commit(types.SET_AQI_STATION_DATA, {});
      });
}

export const hideAQIDetailPopup = ({ commit }) => {
    commit(types.HIDE_AQI_POPUP);
}

export const addWaterStation = ({ commit, state }, { datetime, cityId, countyId, isAdd = false }) => {
  state.container.getWaterStationReal(datetime, cityId, countyId)
    .then(response => {
      let data = response.data;
      let realData = {};
      for(let i in data) {
        if(data[i] === null || !data[i].length)
          continue;
        for(let d of data[i]) {
          if((!d.msg && !d.msgRsvr) || (!isAdd && !d.data))
            continue;
          let msg = d.msg || d.msgRsvr;
          let id = msg.stcd || msg.staid;
          if(!realData.hasOwnProperty(id)) {
            realData[id] = Object.assign({}, msg, d.data || {});
          } else {
            Object.assign(realData[id], d.data || {});
          }
        }
      }
      commit(types.ADD_WATER_STATION, { data: realData, isAdd });
    })
    .catch(err => {
      commit(types.ADD_WATER_STATION, { data: {}, isAdd });
    });
}

export const getWaterStationReal = ({ commit, state }, { datetime, cityId, countyId }) => {
    state.container.getWaterStationReal(datetime, cityId, countyId)
      .then(response => {
          let data = response.data;
          if(!data) {
              commit(types.ADD_WATER_STATION_REALDATA, {});
          }
          else {
              let realData = {};
              for(let i in data) {
                  if(data[i] === null || !data[i].length)
                      continue;
                  for(let d of data[i]) {
                      if(!d.msg || !d.data)
                        continue;
                      let id = d.msg.stcd;
                      if(!realData.hasOwnProperty(id)) {
                          realData[id] = Object.assign({}, d.msg, d.data);
                      } else {
                          Object.assign(realData[id], d.data);
                      }
                  }
              }
              commit(types.ADD_WATER_STATION_REALDATA, realData);
          }
      })
      .catch(err => {
          commit(types.ADD_WATER_STATION_REALDATA, {});
      });
}

export const removeWaterStation = ({ commit }) => {
    commit(types.REMOVE_WATER_STATION);
}

export const addShipModel = async ({ commit }, { $http, bounds }) => {
    let meteoMonitor = new MeteoMonitor($http);
    let data = await meteoMonitor.getShipInfo(bounds);
    if(data.result !== 'S_OK') {
      commit(types.REMOVE_SHIP_MODEL);
      return;
    }
    commit(types.ADD_SHIP_MODEL, data.tagObject);
    return data;
}

export const removeShipModel = ({ commit }) => {
    commit(types.REMOVE_SHIP_MODEL);
}

export const clearShipDetail = ({ commit }) => {
    commit(types.CLEAR_SHIP_DETAIL);
}

