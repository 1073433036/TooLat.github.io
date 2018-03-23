import * as actions from '../actions/modelPoiAct'
import * as getters from '../getters/modelPoiGetters'

import {
  ADD_MODEL_SITES,
  UPDATE_GEO_SITES,
  UPDATE_WATERLOG_SITES,
  CLEAR_MODEL_SITES,
  CLOSE_MODEL_SITE_POPUP,
  FILL_GEOL_SITE_POPUP,
  FILL_WATERLOG_SITE_POPUP,
  RENDER_GEO_RAIN_CHART,
  UPDATE_MODEL_SITE_FSTDATA,
  RENDER_WATERLOG_RAIN_CHART,
  UPDATE_TORRENT_SITES,
  RENDER_TORRENT_RAIN_CHART,
  FILL_TORRENT_POI_POPUP,
  UPDATE_RAIN_AND_WIND_POI,
  SHOW_RAIN_AND_WIND_POPUP,
  CLOSE_RAIN_AND_WIND_POPUP
} from '../mutation-types'

import { Helper } from '../../util/Helper'
import { setRainChart, renderRainChart, renderTorrentChart } from '../../util/charts'

const state = {
  modelPoiData: {
    currentModel: '',
    info: {},
    fstData: [],
    //collection: null,
    handler: null
  },

  geoPopup: {
    show: false,
    title: '',
    info: {},
    images: [],
    rainPastChart: null,
    rainFstChart: null,
    params: {
      modelLevel: { text: '影响等级', value: '' },
      address: { text: '地址', value: ''},
      lnglat: { text: '经纬度', value: '' },
      type: { text: '灾害类型', value: '' },
      scale: { text: '灾害规模(m³)', value: '' },
      level: { text: '灾害等级', value: '' },
      stability: { text: '稳定性', value: '' },
      risk: { text: '危险性', value: '' },
      factor: { text: '诱发因素', value: '' },
      people: { text: '威胁人员(人)', value: '' },
      gdp: { text: '潜在损失(万元)', value: '' },
      responsible: { text: '责任人', value: '' },
      telephone: { text: '责任人电话', value: '' },
      measure: { text: '防治对策', value: '' }
    }
  },

  waterlogPopup: {
    show: false,
    title: '',
    info: {},
    rainChart: null,
    rainTimes: [3, 4, 5, 6, 8, 9, 10],  //对应雨量时次在数组中的index: [过去3小时,2小时,1小时, 当前雨量, 未来1小时,2小时,3小时]
    params: {
      address: { text: '地址', value: '' },
      manager: { text: '负责人', value: '' },
      phoneNum: { text: '电话', value: '' },
      detail: { text: '内涝点详情', value: '' },
      cause: { text: '内涝成因', value: '' },
      rain: { text: '雨量(实况)', value: '' },
    },
    threshold: {
      red: { text: '等级一阈值', value: '' },
      orange: { text: '等级二阈值', value: '' },
      yellow: { text: '等级三阈值', value: '' },
      blue: { text: '等级四阈值', value: '' }
    }
  },

  torrentPopup: {
    show: false,
    title: '',
    info: {},
    rainChart: null,
    params: {
      area: { text: '所属区域', value: '' },
      river: { text: '山洪沟', value: '' },
      //height: { text: '海拔高度(m)', value: '' },
      //drainage: { text: '流域面积(㎡)', value: '' }
    }
  },

  rainAndWindPopup: {
    show: false,
    poiAddress: '',
    poiData: {},
  }
}

const mutations = {
  [ADD_MODEL_SITES](state, { data, model }) {
    let modelPoiData = state.modelPoiData;
    let helper = new Helper(viewer);

    modelPoiData.currentModel = model;

    let collection = helper.billboardCollection(),
        poiInfo = {};
    for(let poi of data) {
      poiInfo[poi.id] = poi;
      let billboard = helper.billboard([Number(poi.lon || poi.longitude), Number(poi.lat || poi.latitude)],
        `./static/img/modelIcon/${model}/${poi.modelColor}.png`, `${model}_${poi.id}`, 'bottom');
      collection.add(billboard);
    }
    helper.addCollection(collection);
    modelPoiData.collection = collection;
    modelPoiData.info = poiInfo;
    helper = null;
  },

  [UPDATE_MODEL_SITE_FSTDATA](state, data) {
    let modelPoints = state.modelPoiData.info;
    let count = 0;
    let fstData = [];
    for(let i in modelPoints) {
      let poi = modelPoints[i];
      if(data === null) {
        poi.fstData = [];
      } else {
        let arr = data[count];
        arr.forEach((v, index) => {
          arr[index] = Number(v ? v.toFixed(1) : 0);
        });
        poi.fstData = arr;
      }
      fstData.push(poi);
      count++;
    }
    state.modelPoiData.fstData = fstData;
  },

  [UPDATE_GEO_SITES](state, { seledTime, model }) {
    let collection = state.modelPoiData.collection,
        modelPoints = state.modelPoiData.info;
    const len = collection.length;

    const levelObj = [['Ⅳ级', 'blue'], ['III级', 'yellow'], ['Ⅱ级', 'orange'], ['I级', 'red']];
    const rangesObj = { 'geology_nc': [15, 30, 100, 250], 'geodisaster': [1, 2, 3, 4] };
    let ranges = rangesObj[model];

    for(let i = 0; i < len; i++) {
      let billboard = collection.get(i);
      let id = billboard.id.split("_")[1];
      let poi = modelPoints[id];
      let fstData = poi.fstData;
      let v = fstData.length ? fstData[seledTime] : 0;
      let flag = false;
      ranges.forEach((r, i, arr) => {
        if(flag)
          return;
        let levelInfo = levelObj[i];
        if(i === (ranges.length - 1)) {
          if(v > r) {
            poi.modelLevel = levelInfo[0];
            poi.modelColor = levelInfo[1];
            flag = true;
          }
        } else {
          if(v > r && v <= arr[i+1]) {
            poi.modelLevel = levelInfo[0];
            poi.modelColor = levelInfo[1];
            flag = true;
          }
        }
      });
      if(!flag) {
        poi.modelLevel = '无影响';
        poi.modelColor = 'green';
      }
      const imgStrArr = billboard.image.split("/");
      imgStrArr.pop();
      imgStrArr.push(`${poi.modelColor}.png`);
      billboard.image = imgStrArr.join('/');
    }
  },

  [FILL_GEOL_SITE_POPUP](state, poiInfo) {
    let geoInfo = state.geoPopup;

    geoInfo.info = poiInfo;

    for(let i in geoInfo.params) {
      let item = geoInfo.params[i];
      if(i === 'lnglat') {
        item.value = `${poiInfo.longitude.substring(0,6)}°E, ${poiInfo.latitude.substring(0,5)}°N`;
      } else {
        item.value = poiInfo[i] || '';
      }
    }

    geoInfo.title = `地质灾害风险隐患点（${poiInfo.address}）`;
    geoInfo.show = true;
  },

  [UPDATE_WATERLOG_SITES](state) {
    const rainTimes = state.waterlogPopup.rainTimes;
    let collection = state.modelPoiData.collection,
        modelPoints = state.modelPoiData.info;

    const len = collection.length;
    for(let i = 0; i < len; i++) {
      let billboard = collection.get(i);
      let id = billboard.id.split("_")[1];
      let poi = modelPoints[id];
      let fstData = poi.fstData.filter((v, index) => rainTimes.includes(index));
      let mv = Math.max.apply(null, fstData);
      for(let l in poi.threshold) {
        if(mv > poi.threshold[l]) {
          poi.modelLevel = l;
          poi.modelColor = l;
          break;
        } else {
          if(l === 'blue') {
            poi.modelLevel = 'green';
            poi.modelColor = 'green';
          }
        }
      }
      const imgStrArr = billboard.image.split("/");
      imgStrArr.pop();
      imgStrArr.push(`${poi.modelColor}.png`);
      billboard.image = imgStrArr.join('/');
    }
  },

  [FILL_WATERLOG_SITE_POPUP](state, poiInfo) {
    let waterlogPopup = state.waterlogPopup;

    waterlogPopup.info = poiInfo;
    waterlogPopup.title = `内涝点（${poiInfo.name}）`;

    for(let i in waterlogPopup.params) {
      waterlogPopup.params[i].value = poiInfo[i] || '--';
    }

    for(let i in waterlogPopup.threshold) {
      waterlogPopup.threshold[i].value = poiInfo.threshold[i] || '';
    }

    waterlogPopup.show = true;
  },

  [UPDATE_TORRENT_SITES](state) {
    let collection = state.modelPoiData.collection,
        modelPoints = state.modelPoiData.info;

    const len = collection.length;
    for(let i = 0; i < len; i++) {
      let billboard = collection.get(i);
      let id = billboard.id.split("_")[1];
      let poi = modelPoints[id];
      let fstData = poi.fstData;
      if(fstData.length > 10) { //fstData: [过去24、12、6、3、2、1小时, 实况, 未来30分钟、1、2、3小时]
        fstData.splice(7, 1);   //删除qpf30分钟数据
      }
      for(let index = 0; index < fstData.length; index++) {
        let threshold = poi.threshold[index];
        let keys = Object.keys(threshold);
        if(fstData[index] > threshold[keys[0]]) {
          poi.modelLevel = 'red';
          poi.modelColor = 'red';
          break;
        }
        if(index === 9) {
          poi.modelLevel = 'green';
          poi.modelColor = 'green';
        }
      }

      const imgStrArr = billboard.image.split("/");
      imgStrArr.pop();
      imgStrArr.push(`${poi.modelColor}.png`);
      billboard.image = imgStrArr.join('/');
    }
  },

  [RENDER_WATERLOG_RAIN_CHART](state, { eleDom, data }) {
    const xArr = ['过去3小时', '过去2小时', '过去1小时', '实况', '未来1小时', '未来2小时', '未来3小时'];
    state.waterlogPopup.rainChart = renderRainChart(eleDom, xArr, data, '雨量信息');
  },

  [FILL_TORRENT_POI_POPUP](state, poiInfo) {
    let torrentPopup = state.torrentPopup;

    torrentPopup.info = poiInfo;
    torrentPopup.title = `山洪预警点-（${poiInfo.name}）`;

    for(let i in torrentPopup.params) {
      if(i === 'area') {
        torrentPopup.params[i].value = `${poiInfo.county}${poiInfo.town}${poiInfo.village || ''}`;
      } else {
        torrentPopup.params[i].value = poiInfo[i] || '--';
      }
    }

    torrentPopup.show = true;
  },

  [RENDER_GEO_RAIN_CHART](state, { key, eleDom, xArr, values, title }) {
    let geoPopup = state.geoPopup;
    geoPopup[key] = setRainChart(eleDom, xArr, values, title);
  },

  [RENDER_TORRENT_RAIN_CHART](state, { eleDom, data }) {
    const xArr = ['过去24小时', '过去12小时', '过去6小时', '过去3小时', '过去2小时', '过去1小时', '实况', '未来1小时', '未来2小时', '未来3小时'];
    state.torrentPopup.rainChart = renderTorrentChart(eleDom, xArr, data, '雨量信息');
  },

  [CLEAR_MODEL_SITES](state) {
    let modelPoiData = state.modelPoiData;
    let helper = new Helper(viewer);

    modelPoiData.info = {};
    if(modelPoiData.collection) {
      helper.removeCollection(modelPoiData.collection);
      delete modelPoiData.collection;
    }
    if(modelPoiData.handler !== null) {
      helper.removeAction(modelPoiData.handler, 'leftClick');
      modelPoiData.handler = null;
    }
    if(state.geoPopup.show)
      state.geoPopup.show = false;

    if(state.waterlogPopup.show)
      state.waterlogPopup.show = false;

    if(state.torrentPopup.show)
      state.torrentPopup.show = false;

    if(state.rainAndWindPopup.show)
      state.rainAndWindPopup.show = false;

    helper = null;
  },

  [CLOSE_MODEL_SITE_POPUP](state, model) {
    let popup = state[model];
    popup.show = false;
    popup.info = {};
    if(popup.rainChart) {
      popup.rainChart.destroy();
      popup.rainChart = null;
    }
    if(model === 'geoPopup') {
      popup.rainFstChart.destroy();
      popup.rainPastChart.destroy();
      popup.rainFstChart = null;
      popup.rainPastChart = null;
    }
  },

  [UPDATE_RAIN_AND_WIND_POI](state) {
    let collection = state.modelPoiData.collection,
        modelPoints = state.modelPoiData.info;

    const len = collection.length;
    for(let i = 0; i < len; i++) {
      let billboard = collection.get(i);
      let id = billboard.id.split("_")[1];
      let poi = modelPoints[id];
      let fstData = poi.fstData;
      fstData.forEach((v, index) => {
        if(v > poi.threshold[index]) {
          poi.modelColor = 'danger';
          return;
        }
      });
      const imgStrArr = billboard.image.split("/");
      imgStrArr.pop();
      imgStrArr.push(`${poi.modelColor}.png`);
      billboard.image = imgStrArr.join('/');
    }
  },

  [SHOW_RAIN_AND_WIND_POPUP](state, poiData) {
    let rainAndWindPopup = state.rainAndWindPopup;
    if(!poiData) {
      rainAndWindPopup.show = false;
      return;
    }
    rainAndWindPopup.poiAddress = poiData.name;
    rainAndWindPopup.poiData = poiData;
    rainAndWindPopup.show = true;
  },

  [CLOSE_RAIN_AND_WIND_POPUP](state) {
    state.rainAndWindPopup.show = false;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
