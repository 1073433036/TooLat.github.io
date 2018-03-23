import * as actions from '../actions/modelAct'
import * as getters from '../getters/modelGetters'

import {
  TOGGLE_MODEL_MENU,
  SET_SELECTED_MODEL,
  STORE_MODEL_DATA,
  HIDE_GEO_SITE_POPUP,
  TOGGLE_GEO_FILE_POPUP,
  UPDATE_GEO_FILE_MSG,
  ADD_MODEL_LAYER,
  CLEAR_MODEL_DATA,
  UPDATE_RIVER_ROAD_DATA,
  STORE_RIVER_ROAD_TIP_DATA,
  RENDER_RIVER_ROAD_CHART,
  ADD_RIVER_DIRECTION_ARROW,
  ADD_ROAD_NAME_LABELS,
  CLOSE_MODEL_RESULT,
  STORE_RESERVOIR_STATRAIN,
  TOGGLE_RESERVOIR_STAT_TABLE,
  TOGGLE_WATERLOG_STAT_TABLE
} from '../mutation-types'

import { Helper } from '../../util/Helper'
import { renderRainChart } from '../../util/charts'

const state = {
    modelMenu: {
      tide: { text: '台风监控', selected: false, class: 'tide' },
      rain: { text: '暴雨监控', selected: false, class: 'rain' },
      wind: { text: '大风监控', selected: false, class: 'wind' },
      thunder: { text: '雷电监控', selected: false, class: 'thunder' },
      torrent: { text: '山洪监控', selected: false, class: 'torrent' },
      waterlogging: { text: '内涝监控', selected: false, class: 'waterlogging' },
      geology: { text: '地质风险', selected: false, class: 'geology' },
      fire: { text: '火情模拟', selected: false, class: 'fire' },
      airpollution: { text: '污染扩散', selected: false, class: 'airpollution' }
    },
    currentLevel: [],
    modelRequest: null,
    modelData: {
      selectedModel: null,
      isAnalyzing: false,
      ncInfo: null,
      gridNcInfo: null,
      startTime: null,
      seledTime: 0,
      ranges: [],
      townsIdList: [],
      townsData: null,
      countyData: null,
      riverHandler: null,
      analysisType: null,
      affectedTownsList: [],
      targetWarningData: {
        speakerNum: 0,
        LEDNum: 0,
      },
      riverData: null,  //河流流向数据
      riverRoadData: null,
      riverRoadTipData: {
        style: {
          top: 0,
          left: 0
        },
        info: null
      },
      roadNameLabels: {},
      reservoirData: {   //水库统计雨量信息
        list: [],
        namesList: [],
        columns: {
          'rain24': { text: 'P_24h', cname: '过去24h', threshold: 80, count: 0 },
          'rain12': { text: 'P_12h', cname: '过去12h', threshold: 50, count: 0 },
          'rain06': { text: 'P_6h', cname: '过去6h', threshold: 25, count: 0 },
          'rain03': { text: 'P_3h', cname: '过去3h', threshold: 15, count: 0 },
          'rain02': { text: 'P_2h', cname: '过去2h', threshold: 10, count: 0 },
          'rain01': { text: 'P_1h', cname: '过去1h', threshold: 8, count: 0 },
          'qpe': { text: '实况', cname: '实况', threshold: 8, count: 0 },
          't1': { text: 'F_1h', cname: '未来1h', threshold: 8, count: 0 },
          't2': { text: 'F_2h', cname: '未来2h', threshold: 10, count: 0 },
          't3': { text: 'F_3h', cname: '未来3h', threshold: 15, count: 0 }
        }
      },
      isShowStatRain: false,   //是否显示水库统计雨量表格
      isShowWaterlogStat: false, //是否显示内涝点雨量统计表格
    },

    gifDownloadPopup: false,
    geoFilePopup: {
        show: false,
        fileUrl: '',
        issue: '',
        issuer: ''
    },
    riverRoadChart: null
}

const mutations = {
    [TOGGLE_MODEL_MENU](state, key) {
        let modelMenu = state.modelMenu;
        let model = modelMenu[key];
        if(model.selected) {
            model.selected = false;
            model.class = key;
            state.modelData.selectedModel = null;
            return;
        }
        for(let i in modelMenu) {
            let item = modelMenu[i];
            item.selected = i === key;
        }
        state.modelData.selectedModel = key;
    },

    [SET_SELECTED_MODEL](state, model) {
        state.modelData.selectedModel = model;
    },

    [STORE_MODEL_DATA](state, data) {
        state.modelData[data.attr] = data.value;
    },

    [ADD_MODEL_LAYER](state, imgData) {
        let helper = new Helper(viewer);
        let imgLayer = state.modelData.imgLayer;
        state.modelData.imgLayer = imgData === null ? null : helper.addImgLayer(imgData.imgSrc, imgData);

        setTimeout(() => {
            imgLayer && helper.removeImgLayer(imgLayer);
        }, 200);
    },

    [HIDE_GEO_SITE_POPUP](state) {
        state.geoSitePopup.show = false;
    },

    [TOGGLE_GEO_FILE_POPUP](state, bool) {
        if(state.geoFilePopup.show === bool)
            return;

        state.geoFilePopup.show = bool;
        if (!state.geoFilePopup.show) {
            state.geoFilePopup.issue = '';
            state.geoFilePopup.issuer = '';
            state.geoFilePopup.fileUrl = '';
        }
    },

    [UPDATE_GEO_FILE_MSG](state, { key, value }) {
        state.geoFilePopup[key] = value;
    },

    [CLEAR_MODEL_DATA](state) {
        let modelData = state.modelData;
        let helper = new Helper(viewer);
        modelData.isAnalyzing = false;
        modelData.townsIdList = [];
        modelData.ncInfo = null;
        modelData.gridNcInfo = null;
        modelData.startTime = null;
        modelData.ranges = {};
        modelData.seledTime = 0;
        if(modelData.imgLayer) {
            helper.removeImgLayer(modelData.imgLayer);
            modelData.imgLayer = null;
        }
        if(modelData.riverHandler) {
            helper.removeAction(modelData.riverHandler, 'mouseOver');
            modelData.riverHandler = null;
        }
        if(modelData.reservoirData.list.length) {
            modelData.reservoirData.list = [];
            modelData.reservoirData.stat = {};
        }
        modelData.riverArrows && helper.removeDataSource(modelData.riverArrows);

        for(let i in modelData.roadNameLabels) {
            modelData.roadNameLabels[i] && helper.removeDataSource(modelData.roadNameLabels[i]);
        }
        helper = null;
    },

    [STORE_RIVER_ROAD_TIP_DATA](state, data) {
        let riverRoadData = state.modelData.riverRoadTipData;
        riverRoadData.style = data.style;
        riverRoadData.info = data.info;
    },

    [UPDATE_RIVER_ROAD_DATA](state, data) {
        state.modelData.riverRoadData = data;
    },

    [RENDER_RIVER_ROAD_CHART](state, { eleDom, data }) {
        const xArr = ['过去24小时', '过去12小时', '过去6小时', '过去3小时', '过去2小时', '过去1小时', '实况', '未来1小时', '未来2小时', '未来3小时'];
        renderRainChart(eleDom, xArr, data, '');
    },

    [ADD_RIVER_DIRECTION_ARROW](state, data) {
        let helper = new Helper(viewer);
        let dataSources = helper.customDataSource('river_arrow');

        const NUM = 3;
        for(let river of data) {
            let list = river.list;
            let len = parseInt(list.length/NUM),
                rd = list.length%NUM;
            for(let index = 0; index < len; index++) {
                if(index%2) {
                  continue;
                }
                let si = index*NUM;
                let ei = si + NUM;
                if(index === len - 1 && rd) {
                    ei += rd;
                }
                let arr = list.slice(si, si+NUM);
                let lnglats = [];
                for(let p of arr) {
                    lnglats.push(p.lon, p.lat);
                }
                let polylineArrow = helper.polylineArrow(lnglats);
                dataSources.entities.add(polylineArrow);
            }
        }
        helper.addCustomDataSource(dataSources);
        state.modelData.riverArrows = dataSources;
    },

    [ADD_ROAD_NAME_LABELS](state, { key, data }) {
        if(!data || !Object.keys(data).length)
            return;
        let helper = new Helper(viewer);
        let dataSources = helper.customDataSource('road_name');

        for(let p of data.features) {
            let name = p.attributes.NAME;
            let label = helper.label(name, [p.geometry.x, p.geometry.y], 0.4, 'white', name, 'both', 6, 'black');
            dataSources.entities.add(label);
        }
        helper.addCustomDataSource(dataSources);
        state.modelData.roadNameLabels[key] = dataSources;
    },

    [STORE_RESERVOIR_STATRAIN](state, data) {
      let columns = state.modelData.reservoirData.columns,
          namesList = state.modelData.reservoirData.namesList;

      const hasName = namesList.length > 0;

      for(let i in columns) {
        columns[i].count = 0;
      }

      if(data.length) {
        for(let p of data) {
          !hasName && namesList.push({ name: p.name, lon: p.lon, lat: p.lat });
          for(let i in p) {
            if(i.indexOf('rain') === -1 && i.indexOf('t') !== 0 && i !== 'qpe')
              continue;
            let v = Number(p[i]).toFixed(1);
            let rv = p[i] = Number(v) || 0;
            if(i in columns && rv >= columns[i].threshold) {
              columns[i].count++;
            }
          }
        }
      }

      state.modelData.reservoirData.list = data;
    },

    [CLOSE_MODEL_RESULT](state) {
        state.modelResult = false
    },

    [TOGGLE_RESERVOIR_STAT_TABLE](state) {
      state.modelData.isShowStatRain = !state.modelData.isShowStatRain;
    },

    [TOGGLE_WATERLOG_STAT_TABLE](state) {
      state.modelData.isShowWaterlogStat = !state.modelData.isShowWaterlogStat;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
