import * as types from '../mutation-types'

import { ModelAssess } from '../../util/modelAssess'
import { MeteoMonitor } from '../../util/MeteoMonitor'
import { Helper } from '../../util/Helper'
import toModelTime from '../../util/toModeltime'

//添加地质灾害隐患点
export const initGeologySites = ({ commit, state }, { $http, regionObj }) => {
  const MODELNAME = 'geology';
  let modelAssess = new ModelAssess($http, regionObj);

  modelAssess.getDisasterSites(MODELNAME)
    .then(data => {
      console.log('success to get geology poi');
      //初始化时设置默认状态为无影响
      for (let p of data) {
        p.modelLevel = '无影响';
        p.modelColor = 'green';
      }
      commit(types.ADD_MODEL_SITES, { data, model: MODELNAME });
      addModelPoiEvent({ commit, state });   //添加隐患点点击事件
    });

  modelAssess = null;
}
//获取地质灾害隐患点过去72小时雨量
export const getRainPast = ({ commit }, { eleDom, $http, regionObj, datetime, lng, lat }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  const fileName = `meteohist${new Date(datetime).Format('yyyyMMddHH')}0000.nc`;
  modelAssess.getNcInfo('meteohist_nc', fileName)
    .then(data => {
      if(!data) {
        return;
      }
      return modelAssess.getPointValue(data, lng, lat);     //根据经纬度获取单点过去72小时累积雨量
    })
    .then(response => {
      let data = response.data;
      if(!data || !data.length)
        return;
      let date = new Date(datetime).getTime();
      let xAxis = [];
      let values = {
        point: [],   //存储逐小时雨量值
        stat: []     //存储累积雨量值
      };
      for(let i = 0; i < data.length; i++){
        let dt = date - (i + 1) * 3600000;
        xAxis.push(new Date(dt).Format("MM-dd HH:00"));

        if(i > 0 && data[i] < data[i-1])
          data[i] = data[i-1];
        let v = parseFloat(data[i].toFixed(1));
        values.stat.push(v);
        if(i==0){
          values.point.push(v);
          continue;
        }
        let value = parseFloat((data[i] - data[i-1]).toFixed(1));
        value = value<=0 ? 0 : value;
        values.point.push(value);
      }
      //xAxis.reverse();
      //values.point.reverse();
      //console.log(values);
      //渲染过去72小时雨量图表
      commit(types.RENDER_GEO_RAIN_CHART, { key: 'rainPastChart', eleDom, xArr: xAxis, values, title: '过去雨量' });
    });
}
//获取地质灾害隐患点未来72小时雨量
export const getRainFst = ({ commit }, { eleDom, $http, lng, lat, starttime }) => {
  const dFmt = `yyyy-MM-dd HH:00:00`;
  let endtime = starttime.getTime() + 72*60*60*1000;  //未来72小时
  starttime = new Date(starttime).Format(dFmt);
  endtime = new Date(endtime).Format(dFmt);
  let modelTime = toModelTime(starttime, endtime);

  let meteoMonitor = new MeteoMonitor($http);
  meteoMonitor.getModelSingleFst(lng, lat, modelTime.starttime, modelTime.endtime)
    .then(response => {
      let data = response.data;
      if(typeof(data) === 'string' && /DB_ERROR/.test(data) || !data.length)
        return;
      let rains = data[0].rain;
      let diff = new Date(starttime).getTime() - (new Date(modelTime.starttime).getTime() + 8*60*60*1000);
      let sIndex = diff/3600000;
      let eIndex = sIndex + 72;
      let values = {
        point: rains.slice(sIndex, eIndex),
        stat: []
      };
      let xAxis = [];
      for(let i = 0; i < 72; i++) {
        let v = values.point[i];
        if(v && [999998, 9999, 99999, 999999, -999, -999.9, -9999].includes(Number(v))){
          v = 0;
          values.point[i] = 0;
        }
        values.stat.push(i ? v + values.stat[i-1] : v);

        let t = new Date(starttime).getTime() + i*3600000;
        xAxis.push(new Date(t).Format("MM-dd HH:00"));
      }
      //console.log(values);
      commit(types.RENDER_GEO_RAIN_CHART, { key: 'rainFstChart', eleDom, xArr: xAxis, values, title: '未来雨量' });
    });
}

//初始化模型关注点: 山洪、内涝
export const initDisasterSites = ({ commit, state }, { $http, regionObj, model }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  modelAssess.getDisasterSites(model)
    .then(data => {
      for(let p of data) {
        p.modelColor = 'green';
        p.modelLevel = 'green';
        p.threshold = JSON.parse(p.threshold);
      }
      commit(types.ADD_MODEL_SITES, { data, model });
      addModelPoiEvent({ commit, state });
    });
  modelAssess = null;
}

//更新山洪、内涝关注点数据
export const updateDisasterSites = ({ commit, state }, { $http, regionObj, datetime, model}) => {
  let modelAssess = new ModelAssess($http, regionObj);
  let dateTime = datetime.getTime() - datetime.getTime()%360000;
  (function getNcInfo(t) {
    let ms = new Date(dateTime).getTime() - t*360000;
    let filename = `grid${new Date(ms).Format('yyyyMMddHHmm00')}.nc`;
    modelAssess.getNcInfo('grid_nc', filename)
      .then(ncInfo => {
        updateModelSiteFstData({ commit, state }, { $http, regionObj, ncInfo, model });
        modelAssess = null;
      })
      .catch(err => {
        if(t > 4) {
          commit(types.UPDATE_MODEL_SITE_FSTDATA, null);
          modelAssess = null;
          return;
        }
        t++;
        getNcInfo(t);
      });
  })(0);
}

//更新模型关注点预报数据
export const updateModelSiteFstData = ({ commit, state }, { $http, regionObj, ncInfo, model }) => {
  if(ncInfo === null || ncInfo === 'null') {
    commit(types.UPDATE_MODEL_SITE_FSTDATA, null);
    updateModelSites({ commit }, { model: model === 'geology' ? 'geology_nc' : model });
    return;
  }
  let modelAssess = new ModelAssess($http, regionObj);

  let st = setInterval(() => {
    if(Object.keys(state.modelPoiData.info).length) {
      clearInterval(st);
      const points = state.modelPoiData.info;
      let pointArray = [];
      for(let i in points) {
        let p = points[i];
        pointArray.push({ x: Number(p.lon || p.longitude), y: Number(p.lat || p.latitude) });
      }

      modelAssess.getMultiPointValue(ncInfo, pointArray)
        .then(response => {
          commit(types.UPDATE_MODEL_SITE_FSTDATA, response.data);
          updateModelSites({ commit }, { model: model === 'geology' ? ncInfo.modelName : model });
        })
        .catch(err => {
          commit(types.UPDATE_MODEL_SITE_FSTDATA, null);
          updateModelSites({ commit }, { model: model === 'geology' ? ncInfo.modelName : model });
        });
    }
  }, 500);
}

export const updateModelSites = ({ commit }, { model, seledTime=0 }) => {
  if(model === 'geology_nc' || model === 'geodisaster') {
    commit(types.UPDATE_GEO_SITES, { seledTime, model });
  } else if(model === 'waterlogging') {
    commit(types.UPDATE_WATERLOG_SITES);
  } else if(model === 'torrent') {
    commit(types.UPDATE_TORRENT_SITES);
  }
}

export const renderWaterlogRainChart = ({ commit }, { eleDom, data }) => {
  commit(types.RENDER_WATERLOG_RAIN_CHART, { eleDom, data });
}

export const addRainOrWindPoi = ({ commit, state }, { $http, regionObj, datetime, model }) => {
  let modelAssess = new ModelAssess($http, regionObj);

  modelAssess.getDisasterSites('tide')
    .then(poiData => {
      if (model === 'wind') {
        for (let item of poiData) {
          let thArray = [];
          for(let i = 0; i < 72; i++) {
            thArray.push(Number(item['windThreshold']));
          }
          item.threshold = thArray;
          item.modelColor = 'normal';
        }
      } else {
        let tempThreshold;
        for (let i = 0; i < poiData.length; i++) {
          let thArray = [];
          tempThreshold = JSON.parse(poiData[i]['rainThreshold']);
          let initNum = 0;
          for (let key in tempThreshold) {
            let parsedNum = Number(key.replace('r', ''));
            for (let j = initNum; j < parsedNum; j++) {
              thArray.push(tempThreshold[key]);
              initNum++;
            }
          }
          poiData[i].threshold = thArray;
          poiData[i].modelColor = 'normal';
        }
      }
      commit(types.ADD_MODEL_SITES, { data: poiData, model });
      updateRainAndWindPoi({ commit }, { $http, data: poiData, type: model, datetime });
      addModelPoiEvent({ commit, state });
    });
  modelAssess = null;
}

export const updateRainAndWindPoi = ({ commit }, { $http, data, type, datetime }) => {
  if(!Array.isArray(data) || !data.length)
    return;
  let lonArr = [],
      latArr = [];
  for(let poi of data) {
    lonArr.push(poi.lon);
    latArr.push(poi.lat);
  }

  const dFmt = `yyyy-MM-dd HH:00:00`;
  let endtime = datetime.getTime() + 72*60*60*1000;  //未来72小时
  let starttime = datetime.Format(dFmt);
  endtime = new Date(endtime).Format(dFmt);
  let modelTime = toModelTime(starttime, endtime);  //转换成模式时间

  const url = `http://10.148.10.80:8111/grid/modeldata/SerialMultiPos/grapes9km,${type === 'rain' ? 'lspe' : 'wind'},`
    + `${type === 'rain' ? 0 : 1000},${lonArr.join(';')},${latArr.join(';')},${modelTime.starttime},${modelTime.endtime}/JSONP/`;
  $http.jsonp(url)
    .then(res => {
      let resData = res.data;
      if(!Array.isArray(resData) || !resData.length)
        return;

      let fstData = resData[0];
      let elKey = type === 'rain' ? 'lspe' : 'wind_vel';
      if(!fstData.hasOwnProperty(elKey))
        return;

      fstData = fstData[elKey];
      let diff = new Date(starttime).getTime() - (new Date(modelTime.starttime).getTime() + 8*60*60*1000);
      let sIndex = diff/3600000;   //起始index
      let eIndex = sIndex + 72;    //结束index
      if(type === 'rain')
        sIndex = sIndex ? (sIndex - 1) : sIndex;   //模式预报雨量数据是累增, 需减去前一个值得到逐小时雨量

      fstData.forEach((values, index, arr) => {
        values.shift(); //去除第一个无效值, 模式预报数据第一个值为无效值
        if(type === 'rain') {
          let sliceArr = values.slice(sIndex, eIndex);
          let newArr = [];
          for(let i = 1; i < sliceArr.length; i++) {
            let val = sliceArr[i],
                preVal = sliceArr[i - 1];
            if(val === (-999.9) || preVal === (-999.9)) {
              newArr.push(0);
              continue;
            }
            val -= preVal;
            newArr.push(val <= 0 ? 0 : Number(val.toFixed(1)));
          }
          arr[index] = newArr;
        } else {
          arr[index] = values.slice(sIndex, eIndex);
        }
      });
      commit(types.UPDATE_MODEL_SITE_FSTDATA, fstData);
      commit(types.UPDATE_RAIN_AND_WIND_POI);
    })
    .catch(err => {
      commit(types.UPDATE_MODEL_SITE_FSTDATA, null);
      commit(types.UPDATE_RAIN_AND_WIND_POI);
    });
}

export const addModelPoiEvent = ({ commit, state }) => {
  let modelPoiData = state.modelPoiData;

  if(modelPoiData.handler === null) {
    let helper = new Helper(viewer);
    modelPoiData.handler = helper.getNewHandler();

    helper.setAction('leftClick', modelPoiData.handler, null, (entity, index, movement) => {
      let pickedObj = viewer.scene.pick(movement.position);
      if(Zearth.defined(pickedObj) && typeof pickedObj.id === 'string'){
        let strArr = pickedObj.id.split("_");
        if(strArr.length < 2 || strArr[1] in modelPoiData.info === false)
          return;

        let poi = modelPoiData.info[strArr[1]];
        const model = modelPoiData.currentModel;
        switch (model) {
          case 'geology':
            commit(types.FILL_GEOL_SITE_POPUP, poi);
            break;
          case 'waterlogging':
            commit(types.FILL_WATERLOG_SITE_POPUP, poi);
            break;
          case 'torrent':
            commit(types.FILL_TORRENT_POI_POPUP, poi);
            break;
          case 'rain':
          case 'wind':
            commit(types.SHOW_RAIN_AND_WIND_POPUP, poi);
            break;
        }
      }
    });
  }
}

export const renderTorrentRainChart = ({ commit }, { eleDom, data }) => {
  commit(types.RENDER_TORRENT_RAIN_CHART, { eleDom, data });
}

export const clearModelSites = ({ commit }) => {
  commit(types.CLEAR_MODEL_SITES);
}

export const closeModelSitePopup = ({ commit }, model) => {
  commit(types.CLOSE_MODEL_SITE_POPUP, model);
}

export const closeRainAndWindPopup = ({ commit }) => {
  commit(types.CLOSE_RAIN_AND_WIND_POPUP);
}
