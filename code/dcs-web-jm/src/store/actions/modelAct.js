import * as types from '../mutation-types'

import { ModelAssess } from '../../util/modelAssess'
import { Helper } from '../../util/Helper'

export const toggleModelMenu = ({ commit }, key) => {
  commit(types.TOGGLE_MODEL_MENU, key);
}

export const setSelectedModel = ({ commit }, model) => {
  commit(types.SET_SELECTED_MODEL, model);
}

export const storeModelData = ({ commit }, data) => {
  commit(types.STORE_MODEL_DATA, data);
}

export const hideGeoSitePopup = ({ commit }) => {
  commit(types.HIDE_GEO_SITE_POPUP);
}

export const toggleGeoFilePopup = ({ commit }, bool) => {
  commit(types.TOGGLE_GEO_FILE_POPUP, bool);
}

export const updateGeoFileMsg = ({ commit }, params) => {
  commit(types.UPDATE_GEO_FILE_MSG, params);
}

//清除模型数据, 切换模型时调用
export const clearModelData = ({ commit }) => {
  commit(types.CLEAR_MODEL_DATA);
}

//通过镇ID匹配镇名与所属区县
export const matchTownsName = ({ commit, state }, { $http, regionObj, townIdList }) => {
  let modelData = state.modelData;
  let modelAssess = new ModelAssess($http, regionObj);

  if(townIdList.length && (modelData.countyData === null || modelData.townsData === null)) {
    modelAssess.getCounty()
      .then(response => {
        let data = response.data;
        let countyData = {};
        if(data.result !== 'S_OK' || !data.tagObject.length) {
          countyData = null;
        } else {
          console.log('success to get county info');
          for(let ct of data.tagObject) {
            countyData[ct.countyid] = ct;
          }
        }
        commit(types.STORE_MODEL_DATA, { attr: 'countyData', value: countyData });

        if(countyData === null) {
          commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: [] });
          return;
        }

        modelAssess.getTowns()
          .then(response => {
            let data = response.data;
            let townData = {};
            if(data.result !== 'S_OK' || !data.tagObject.length) {
              townData = null;
            } else {
              console.log('success to get towns info');
              for(let t of data.tagObject) {
                townData[t.townid] = t;
              }
            }
            commit(types.STORE_MODEL_DATA, { attr: 'townsData', value: townData });

            if(townData === null) {
              commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: [] });
              return;
            }

            const allLevelList = modelAssess.matchTownsName(townData, countyData, townIdList);
            console.log(allLevelList);
            commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: allLevelList });
          });
      });
  }
  else {
    const allLevelList = modelAssess.matchTownsName(modelData.townsData, modelData.countyData, townIdList);
    commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: allLevelList });
  }
}

//初始加载地质灾害评估结果
export const initGeolModel = ({ commit }, { model, datetime, $http, regionObj, ranges, bounds }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: true });

  let modelName = modelAssess.getModelName(model, false),
      fileName = modelAssess.getFilename(model, datetime, false);

  modelAssess.getNcInfo(modelName, fileName)
    .then(data => {
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: data });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: new Date(data.start) });

      modelAssess.getModelImage(data, { bounds })
        .then(imgData => {
          commit(types.ADD_MODEL_LAYER, imgData);
        })
        .catch(() => {
          commit(types.ADD_MODEL_LAYER, null);
        });
      //获取各个等级影响到的城镇,返回城镇id数组
      modelAssess.getEffectedTownsByRanges(ranges, data)
        .then((arr) => {
          commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: Array.isArray(arr) ? arr : [] });
        })
        .catch((err) => {
          console.error('Cannot get affectedTowns list...');
          commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: false });
        });
      modelAssess = null;
    })
    .catch(err => {
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: null });
      commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: [] });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: null });
      commit(types.ADD_MODEL_LAYER, null);
      modelAssess = null;
    });
}

//更新地质灾害模型评估结果
export const updateGeolModel = ({ commit }, { $http, regionObj, ncInfo, ranges, seledTime, bounds }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: true });
  let options = {
    seledVar: ncInfo.vars[0].name,
    seledTime,
    seledLevel: ncInfo.levels[0]
  };
  modelAssess.getModelImage(ncInfo, { area: options, bounds })
    .then(imgData => {
      commit(types.ADD_MODEL_LAYER, imgData);
    })
    .catch(() => {
      commit(types.ADD_MODEL_LAYER, null);
    });

  //获取各个等级影响到的城镇,返回城镇id数组
  modelAssess.getEffectedTownsByRanges(ranges, ncInfo, options)
    .then((arr) => {
      commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: Array.isArray(arr) ? arr : [] });
    })
    .catch((err) => {
      console.error('Cannot get affectedTowns list...');
      commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: false });
    });
  modelAssess = null;
}

//初始加载山洪、内涝模型评估信息
export const initDisasterModel = ({ commit, state, rootGetters }, { $http, regionObj, datetime, model, bounds, seledTime=0 }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  const modelName = modelAssess.getModelName(model, false);
  const fileNamePrefix = `${model === 'waterlogging' ? 'waterlog' : model}${datetime}`;
  modelAssess.getShapeImage(modelName, fileNamePrefix, bounds, seledTime)
    .then(data => {
      if(model !== state.modelData.selectedModel || datetime !== rootGetters.dateForModel)
        return;
      commit(types.ADD_MODEL_LAYER, Object.assign({ imgSrc: data }, bounds));
      let dt = `${datetime.substring(0, 4)}/${datetime.substring(4,6)}/${datetime.substring(6, 8)} ${datetime.substring(8, 10)}:00`;
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: { start: new Date(dt).getTime(), times: [0, 1, 2, 3] } });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: new Date(dt) });

      let helper = new Helper(viewer);
      if(!state.modelData.riverHandler) {
        let riverHandler = helper.getNewHandler();
        commit(types.STORE_MODEL_DATA, { attr: 'riverHandler', value: riverHandler });
        let preRequest = null;
        helper.setAction('mouseOver', riverHandler, null, (entity, index, movement) => {
          let pos = movement.endPosition;
          let pickedObj = viewer.scene.pick(pos);
          let style = { top: `${pos.y-12}px`, left: `${pos.x+10}px` };
          if(Zearth.defined(pickedObj)) {
            commit(types.STORE_RIVER_ROAD_TIP_DATA, { style, info: null });
            return;
          }
          let lnglat = helper.getDegByWinPos(pos);
          const fileName = modelAssess.getFilename(model, rootGetters.dateForModel, true);
          modelAssess.getRiverOrRoadPoint(lnglat[0], lnglat[1], fileName, (request) => {
            preRequest && preRequest.abort();
            preRequest = request;
          })
            .then(response => {
              preRequest = null;
              let pickedEntity = response.data;
              if(pickedEntity && pickedEntity !== 'null') {
                commit(types.TOGGLE_EARTH_CURSOR, { key: 'isImgGrab', value: false });
                commit(types.STORE_RIVER_ROAD_TIP_DATA, { style, info: pickedEntity });
              } else {
                commit(types.TOGGLE_EARTH_CURSOR, { key: 'isImgGrab', value: true });
                commit(types.STORE_RIVER_ROAD_TIP_DATA, { style, info: null });
              }
            })
            .catch(err => {
              preRequest = null;
              commit(types.TOGGLE_EARTH_CURSOR, { key: 'isImgGrab', value: true });
              commit(types.STORE_RIVER_ROAD_TIP_DATA, { style, info: null });
            });
        });
        helper.setAction('click', riverHandler, null, (entity, index, movement) => {
          let pos = movement.position;
          let pickedObj = viewer.scene.pick(pos);
          if(Zearth.defined(pickedObj)) {
            return;
          }
          let lnglat = helper.getDegByWinPos(pos);
          const fileName = modelAssess.getFilename(model, rootGetters.dateForModel, true);
          modelAssess.getRiverOrRoadPoint(lnglat[0], lnglat[1], fileName)
            .then(response => {
              let pickedEntity = response.data;
              if(pickedEntity && pickedEntity !== 'null') {
                commit(types.UPDATE_RIVER_ROAD_DATA, pickedEntity);
              } else {
                commit(types.UPDATE_RIVER_ROAD_DATA, null);
              }
            })
            .catch(err => {
              commit(types.UPDATE_RIVER_ROAD_DATA, null);
            });
        });
      }
    })
    .catch(err => {
      commit(types.ADD_MODEL_LAYER, null);
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: null });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: null });
    });
}

//更新山洪、内涝模型评估信息
export const updateDisasterModel = ({ commit, state, rootGetters }, { $http, regionObj, datetime, model, bounds, seledTime }) => {
  let modelAssess = new ModelAssess($http, regionObj);
  const modelName = modelAssess.getModelName(model, false);
  const fileNamePrefix = `${model === 'waterlogging' ? 'waterlog' : model}${datetime}`;
  modelAssess.getShapeImage(modelName, fileNamePrefix, bounds, seledTime)
    .then(data => {
      if(model !== state.modelData.selectedModel || datetime !== rootGetters.dateForModel)
        return;
      commit(types.ADD_MODEL_LAYER, Object.assign({ imgSrc: data }, bounds));
      let dt = `${datetime.substring(0, 4)}/${datetime.substring(4,6)}/${datetime.substring(6, 8)} ${datetime.substring(8, 10)}:00`;
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: { start: new Date(dt).getTime(), times: [0, 1, 2, 3] } });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: new Date(dt) });
    })
    .catch(err => {
      commit(types.ADD_MODEL_LAYER, null);
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: null });
      commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: null });
    });
}

//添加河流流向箭头
export const addRiverDirectionArrow = ({ commit }, { $http, regionObj }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  modelAssess.getRiverPolyline()
    .then(response => {
      let data = response.data;
      if(data) {
        commit(types.ADD_RIVER_DIRECTION_ARROW, data);
      }
    });
  modelAssess = null;
}

//获取水库统计雨量信息
export const getReservoirStatRain = ({ commit }, { $http, regionObj, datetime }) => {
  let modelAssess = new ModelAssess($http, regionObj);
  const modelName = modelAssess.getModelName('reservoir', true),
        fileName = modelAssess.getFilename('reservoir', datetime, true);
  modelAssess.getPointJson(modelName, fileName)
    .then(data => {
      commit(types.STORE_RESERVOIR_STATRAIN, data);
    })
    .catch(err => {
      commit(types.STORE_RESERVOIR_STATRAIN, []);
    });
}

//初始化雷电监控信息
export const initThunderModel = ({ commit, state, rootGetters }, { $http, regionObj, datetime }) => {
  commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: true });

  let modelAssess = new ModelAssess($http, regionObj);

  const getThunderJson = (t) => {
    const modelName = modelAssess.getModelName('entitan', true),
          fileName = modelAssess.getFilename('entitan', new Date(datetime).Format('yyyyMMddHHmm00'), true);
    modelAssess.getPointJson(modelName, fileName)
      .then(data => {
        if(state.modelData.selectedModel !== 'thunder')
          return;
        modelAssess.getEnTitanImage(new Date(datetime).Format('yyyy-MM-dd HH:mm:00'))
          .then(imgData => {
            if(state.modelData.selectedModel !== 'thunder')
              return;
            commit(types.ADD_MODEL_LAYER, imgData);
          });
        let affectedTowns = [
          data['t00'],
          [...new Set(data['t10'].concat(data['t20'], data['t30']))],
          [...new Set(data['t40'].concat(data['t50'], data['t60']))]
        ];
        affectedTowns.forEach((el, index) => {
          affectedTowns[index] = el.filter(name => !name.includes('飞地') && !name.includes('争议地'));
        });
        commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: affectedTowns });
        commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: new Date(datetime) });
      })
      .catch(err => {
        if(state.modelData.selectedModel !== 'thunder')
          return;
        if(t === 4) {
          commit(types.ADD_MODEL_LAYER, null);
          commit(types.STORE_MODEL_DATA, { attr: 'affectedTownsList', value: [] });
          commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: false });
          commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: null });
          return;
        }
        t++;
        datetime = new Date(datetime).getTime() - 360000;
        getThunderJson(t);
      });
  }
  getThunderJson(0);
}

//初始化大风、暴雨模型数据
export const initRainAndWindModel = async ({ commit, state }, { $http, regionObj, datetime, model, ranges, bounds }) => {
  let data = {
    gridNcInfo: null,
    ncInfo: null,
    imgLayerData: null,
    effectedTown: null
  };

  commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: true });

  let modelAssess = new ModelAssess($http, regionObj);
  let modelName, fileName, seledVar, seledTime;
  if(model === 'rain') {
    modelName = 'grid_nc';
    fileName = `grid${datetime}.nc`;
    seledVar = 'data';
    seledTime = 6;
    try {
      let ncInfo = await modelAssess.getNcInfo(modelName, fileName);
      data.gridNcInfo = ncInfo;
    }
    catch(err) {
      let dt = `${datetime.substring(0, 4)}/${datetime.substring(4,6)}/${datetime.substring(6, 8)} ${datetime.substring(8, 10)}:${datetime.substring(10, 12)}`;
      dt = new Date(dt).getTime() -  12*60000;
      fileName = `grid${new Date(dt).Format('yyyyMMddHHmm00')}.nc`;
    }
  } else {
    modelName = 'meteohist_nc';
    fileName = `meteohist${datetime}.nc`;
    seledVar = 'maxwind';
    seledTime = 1;
  }

  try {
    if(!data.gridNcInfo) {
      data.gridNcInfo = await modelAssess.getNcInfo(modelName, fileName);
      if(state.modelData.selectedModel !== model)
        return false;
    }
    data.ncInfo = await modelAssess.getNcInfo('meteocast_nc', `meteocast${datetime.substring(0, 10)}0000.nc`);
    if(state.modelData.selectedModel !== model)
      return false;
    //gird_nc的时次为[过去24小时, 过去12小时, 过去6小时, 过去3小时, 过去2小时, 过去1小时, 当前, 未来30分钟, 未来1小时, 未来2小时, 未来3小时],
    //所以seledTime: 6等于当前时次的数据
    data.imgLayerData = await modelAssess.getModelImage(data.gridNcInfo, { seledVar, seledTime, bounds, contourLabel: model === 'rain' });
    if(state.modelData.selectedModel !== model)
      return;
    let townsData = await modelAssess.getEffectedTownsByRanges(ranges, data.gridNcInfo, { seledVar, seledTime });
    if(state.modelData.selectedModel !== model)
      return;
    commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: townsData });
    commit(types.STORE_MODEL_DATA, { attr: 'seledTime', value: 0 });
    commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: data.ncInfo });
    commit(types.STORE_MODEL_DATA, { attr: 'gridNcInfo', value: data.gridNcInfo });
    commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: new Date(data.gridNcInfo.start) });
    commit(types.ADD_MODEL_LAYER, data.imgLayerData);
  }
  catch (err) {
    if(state.modelData.selectedModel !== model)
      return;
    commit(types.ADD_MODEL_LAYER, null);
    commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: false });
    commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: null });
    commit(types.STORE_MODEL_DATA, { attr: 'startTime', value: null });
    commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: [] });
  }
}

//更新大风、暴雨模型数据
export const updateRainAndWindModel = ({ commit }, { $http, regionObj, ncInfo, bounds, seledTime, seledVar, ranges }) => {
  commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: true });

  let modelAssess = new ModelAssess($http, regionObj);
  modelAssess.getModelImage(ncInfo, { seledVar, seledTime, bounds, contourLabel: seledVar === 'data' || seledVar === 'rain' })
    .then(data => {
      commit(types.ADD_MODEL_LAYER, data);
      return modelAssess.getEffectedTownsByRanges(ranges, ncInfo, { seledVar, seledTime });
    })
    .then(data => {
      commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: data });
    })
    .catch(err => {
      commit(types.STORE_MODEL_DATA, { attr: 'townsIdList', value: [] });
      commit(types.STORE_MODEL_DATA, { attr: 'ncInfo', value: null });
      commit(types.STORE_MODEL_DATA, { attr: 'isAnalyzing', value: false });
    });
}

//加载道路名称图层
export const initRoadNameLabels = ({ commit }) => {
  Zearth.loadJson('/static/json/shendao_name.json')
    .then(data => {
      commit(types.ADD_ROAD_NAME_LABELS, { key: 'shendao', data });
    });
  Zearth.loadJson('/static/json/guodao_name.json')
    .then(data => {
      commit(types.ADD_ROAD_NAME_LABELS, { key: 'guodao', data });
    });
  Zearth.loadJson('/static/json/other_name.json')
    .then(data => {
      commit(types.ADD_ROAD_NAME_LABELS, { key: 'other', data });
    });
}

//渲染河道或者道路的雨量柱状图
export const renderRiverRoadChart = ({ commit }, data) => {
  commit(types.RENDER_RIVER_ROAD_CHART, data);
}

//显示\隐藏水库面雨量统计表格
export const toggleReservoirStatTable = ({ commit }) => {
  commit(types.TOGGLE_RESERVOIR_STAT_TABLE);
}

//显示\隐藏内涝点面雨量统计表格
export const toggleWaterlogStatTable = ({ commit }) => {
  commit(types.TOGGLE_WATERLOG_STAT_TABLE);
}

