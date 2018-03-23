import * as actions from '../actions/realTimeAct'
import * as getters from '../getters/realTimeGetters'
import {
  INIT_METEO_CONTAINER,
  ADD_METEO_LAYER,
  REMOVE_METEO_LAYER,
  SET_STATION_REALDATA,
  ADD_STATION_EVENT,
  REMOVE_STATION_EVENT,
  ADD_REALTIME_STATION,
  REMOVE_REALTIME_STATION,
  ADD_AQI_STATION_EVENT,
  REMOVE_AQI_STATION_EVENT,
  SET_AQI_STATION_DATA,
  HIDE_AQI_POPUP,
  ADD_WATER_STATION,
  REMOVE_WATER_STATION,
  ADD_WATER_STATION_REALDATA,
  ADD_SHIP_MODEL,
  REMOVE_SHIP_MODEL,
  CLEAR_SHIP_DETAIL
} from '../mutation-types'

import { Helper } from '../../util/Helper'
import coordtransform from 'coordtransform'

const state = {
    menu: {
      meteorology: {
        text: '气象监测',
        enabled: true,
        menu: {
          station: { text: '地面监测', selected: false },
          radar: { text: '雷达监测', selected: false },
          cloud: { text: '卫星监测', selected: false },
          lightning: { text: '闪电监测', selected: false },
          qpf_60: { text: 'QPF1小时', selected: false },
          qpf_120: { text: 'QPF2小时', selected: false },
          qpf_180: { text: 'QPF3小时', selected: false }
        }
      },
      water: {
        text: '水情监测',
        enabled: true,
        menu: {
          water: { text: '水文监测', selected: false },
          //reservoir: { text: '水库监测', selected: false },
          //river: { text: '河流监测', selected: false },
          //lake: { text: '湖泊监测', selected: false },
        }
      },
      environment: {
        text: '环保监测',
        enabled: true,
        menu: {
          airquality: { text: '空气监测', selected: false }
        }
      },
      navigation: {
        text: '航线监测',
        enabled: true,
        menu: {
          ship: { text: '船舶监测', selected: false },
          //plane: { text: '飞机监测', selected: false }
        }
      },
      monitor: {
        text: '视频监控',
        enabled: false,
        menu: {
          marine: { text: '海事监控', selected: false },
          reservoir: { text: '水库视频', selected: false },
          fire: { text: '林火视频', selected: false },
          police: { text: '公安视频', selected: false },
          public: { text: '公共视频', selected: false },
          scene: { text: '天气实景', selected: false }
        }
      }
    },
    container: null,
    cameraMoveEvent: null,
    layers: {},
    station: {
        points: {},
        realData: {},
        elements: [
          { key: 'rfhour', color: 'blue', ver: 'bottom', hor: 'right', offset: [-10, -10], unit: 'mm' },
          { key: 'temp', color: 'red', ver: 'bottom', hor: 'left', offset: [10, -10], unit: '℃' },
          { key: 'ps', color: 'green', ver: 'top', hor: 'left', offset: [10, 10], unit: 'hpa' },
          { key: 'wd2df', color: 'black', ver: 'top', hor: 'right', offset: [-10, 10], unit: 'm/s' }
        ],
        handler: null,
        extremum: {
          maxRain: { type: 'maxRain', name: '最大雨量', value: 0, stationName: '', stationId: '', unit: 'mm' },
          maxWind: { type: 'maxWind', name: '最大风速', value: 0, stationName: '', stationId: '', unit: 'm/s' },
          maxTemp: { type: 'maxTemp', name: '最高温度', value: 0, stationName: '', stationId: '', unit: '℃' },
          minTemp: { type: 'minTemp', name: '最低温度', value: 0, stationName: '', stationId: '', unit: '℃' },
        }
    },
    realPopup: {
        show: false,
        detail: true,
        name: '',
        elements: [
            {key: 'rain', value: '', unit: 'mm'},
            {key: 'temp', value: '', unit: '℃'},
            {key: 'ps', value: '', unit: 'hpa'},
            {key: 'wind', value: '', unit: 'm/s'},
        ],
        pos: {
            top: '0px',
            left: '0px'
        }
    },
    aqiStation: {
        points: {},
        handler: null,
        realData: {},
        datetime: '',
        popup: {
            show: false,
            title: '',
            infos: {},
            AQI: {},
            elements: {}
        }
    },
    waterStation: {
        points: {},
        handler: null,
        collection: {},
        popup: {
            show: false,
            params: {
                stnm: { text: '站名', value: '' },
                rvnm: { text: '河流', value: '' },
                hnnm: { text: '水系', value: '' },
                bsnm: { text: '流域', value: '' },
                stlc: { text: '站址', value: '' },
                wz: { text: '最新水位', value: '', unit: 'm' },
                dyp: { text: '08时至今雨量', value: '', unit: 'mm' },
                drp: { text: '过去1小时雨量', value: '', unit: 'mm' },
                tm: { text: '数据时间', value: '' }
            }
        }
    },
    shipInfo: {
        handler: null,
        details: {}
    }
}

const mutations = {
    [INIT_METEO_CONTAINER](state, container) {
        state.container = container;
    },

    [ADD_REALTIME_STATION](state, {data, type}) {
        let helper = new Helper(viewer);
        let billboardCollection = helper.billboardCollection();

        let points = {};
        data.forEach((item) => {
            let id = item.id || item.station_id;
            points[id] = item;
            let lon = type === 'station' ? item.location.lon : item.longitude,
                lat = type ==='station' ? item.location.lat : item.latitude;
            let billboard = helper.billboard([Number(lon), Number(lat)],
                `static/img/station/${type}.png`, `${type}_${id}`);
            billboardCollection.add(billboard);
        });
        helper.addCollection(billboardCollection);
        state[type].collection = billboardCollection;
        state[type].points = points;

        helper = null;
    },

    [REMOVE_REALTIME_STATION](state, type) {
        let helper = new Helper(viewer);
        let stationObj = state[type];
        if(stationObj.collection){
            helper.removeCollection(stationObj.collection);
            delete stationObj.collection;
            stationObj.points = {};
            if(type === 'station') {
              stationObj.realData = {};
              stationObj.realCollection && helper.removeCollection(stationObj.realCollection);
              stationObj.arrowCollection && helper.removeCollection(stationObj.arrowCollection);
              delete stationObj.realCollection;
            }
        }
        helper = null;
    },

    [ADD_STATION_EVENT](state) {
        let station = state.station;
        let collection = station.collection;
        if(collection === undefined)
            return;
        let billboards = collection._billboards;
        let helper = new Helper(viewer);
        if(station.handler === null){
            station.handler = helper.getNewHandler();
        }

        helper.setAction('mouseOver', station.handler, billboards, (entities, index, pos, info) => {
            let realPopup = state.realPopup;
            if(index === undefined) {
                realPopup.show = false;
                return;
            }

            realPopup.show = true;
            realPopup.pos.top = pos.y - 75 + 'px';
            realPopup.pos.left = pos.x - 130 + 'px';

            let entity = entities[index];
            let id = entity.id.split('_')[1];
            if(id in station.realData === false) {
                realPopup.detail = false;
                realPopup.name = id in state.station.points ? state.station.points[id].name : '';
                return;
            }

            let data = station.realData[id];

            realPopup.detail = true;
            realPopup.name = data.name;

            realPopup.elements.forEach((ele) => {
                let key = ele.key;
                if(key === 'wind')
                    key = 'wind_vel';

                if(key in data){
                    let v = data[key].trim();
                    v = v==='' ? '缺测' : ((Number(v) ? Number(v) : 0) + ele.unit);
                    ele.value = v;
                }
            });

        });
        helper = null;
    },

    [REMOVE_STATION_EVENT](state) {
        let handler = state.station.handler;
        if(handler !== null){
            let helper = new Helper(viewer);
            helper.removeAction(handler, 'mouseOver');
            helper = null;
        }
    },

    [ADD_METEO_LAYER](state, {type, layer}) {
        let helper = new Helper(viewer);
        let imgLayer = state.layers[type] || null;
        state.layers[type] = helper.addImgLayer(layer.imgUrl, layer);

        setTimeout(() => {
          imgLayer && helper.removeImgLayer(imgLayer);
          helper = null;
        }, 200);
    },

    [REMOVE_METEO_LAYER](state, type) {
        let helper = new Helper(viewer);
        helper.removeImgLayer(state.layers[type]);
        delete state.layers[type];
        helper = null;
    },

    [SET_STATION_REALDATA](state, data) {
        let stationObj = state.station;
        let helper = new Helper(viewer);

        if(stationObj.realCollection) {
            helper.removeCollection(stationObj.realCollection);
            stationObj.realCollection = null;
        }
        if(stationObj.arrowCollection) {
            helper.removeCollection(stationObj.arrowCollection);
            stationObj.arrowCollection = null;
        }

        stationObj.realData = data;

        if(!Object.keys(data).length) {
            helper = null;
            return;
        }

        let points = stationObj.points,
            elements = stationObj.elements;
        let labelCollection = helper.labelCollection();
        let arrowCollection = helper.billboardCollection();
        let maxRain = null, maxTemp = null, minTemp = null, maxWind = null;

        for(let id in data) {
            if(id in points === false)
                continue;
            let p = data[id],
                point = points[id];
            for(let el of elements) {
                let key = el.key;

                if(key in p.elements === false)
                    continue;
                let v = p.elements[key];
                if(typeof v === 'number') {
                    if(key === 'rfhour' && v < 0)
                      continue;
                    v = v && ![999998, 9999, 99999, 999999, -999, -999.9, -9999, 333.29, -9999.9].includes(v) ? v.toFixed(1) : '0';
                    v = Number(v);
                    let label = helper.label(`${v}${el.unit}`, [point.location.lon, point.location.lat], 0.45, 'white',
                      'station_real', 'both', 6, el.color, el.ver, el.hor, el.offset);
                    labelCollection.add(label);
                    if(key === 'wd2df') {
                        let windArrow = helper.billboard([point.location.lon, point.location.lat], './static/img/station/windArrow.svg',
                          'wind_arrow', 'center', 'center', [0, 0], Number(p.elements.wd2dd));
                        arrowCollection.add(windArrow);
                        if((maxWind && maxWind.value < v) || !maxWind)
                          maxWind = { name: point.info.cname, id: point.station_id, value: v };
                    }
                    else if(key === 'rfhour') {
                      if((maxRain && maxRain.value < v) || !maxRain)
                        maxRain = {name: point.info.cname, id: point.station_id, value: v};
                    }
                    else if(key === 'temp') {
                      if((maxTemp && maxTemp.value < v) || !maxTemp)
                        maxTemp = {name: point.info.cname, id: point.station_id, value: v};
                      if((minTemp && minTemp.value > v) || !minTemp)
                        minTemp = {name: point.info.cname, id: point.station_id, value: v};
                    }
                }
            }
        }
        helper.addCollection(labelCollection);
        helper.addCollection(arrowCollection);
        stationObj.realCollection = labelCollection;
        stationObj.arrowCollection = arrowCollection;
        helper = null;
        let extremum = { maxRain, maxWind, maxTemp, minTemp };
        for(let i in extremum) {
          if(i in stationObj.extremum) {
            stationObj.extremum[i].value = extremum[i].value;
            stationObj.extremum[i].stationName = extremum[i].name;
            stationObj.extremum[i].stationId = extremum[i].id;
          }
        }
    },

    [ADD_AQI_STATION_EVENT](state) {
        let aqiStation = state.aqiStation;
        let collection = aqiStation.collection;
        if(collection === undefined)
            return;

        let aqiPopup = aqiStation.popup;
        let billboards = collection._billboards;
        let helper = new Helper(viewer);
        if(aqiStation.handler === null){
            aqiStation.handler = helper.getNewHandler();
        }

        helper.setAction('leftClick', aqiStation.handler, billboards, (entities, index, pos, info) => {
            if(index === undefined){
                return;
            }
            let entity = entities[index];
            let id = entity.id.split("_")[1];
            if(id in aqiStation.realData === false) {
                aqiPopup.show = false;
                return;
            }

            let aqiPoint = aqiStation.points[id];
            let aqiData = aqiStation.realData[id];

            aqiPopup.title = `空气质量监测-${aqiPoint.name}`;

            aqiPopup.infos = {
                '监测点编码': aqiPoint.stationid,
                '监测点名称': aqiPoint.name,
                '城市名称': aqiPoint.city,
                '发布时间': aqiStation.datetime
            };

            for(let i in aqiData) {
                if(typeof aqiData[i] !== 'object') {
                    aqiPopup.AQI[i] = aqiData[i];
                } else {
                    if(i === '一氧化碳') {
                        for(let j in aqiData[i]) {
                            let value = aqiData[i][j];
                            aqiData[i][j] = value ? Number(value).toFixed(1) : '--';
                        }
                    }
                    aqiPopup.elements[i] = aqiData[i];
                }
            }

            aqiPopup.show = true;
        });

        helper = null;
    },

    [REMOVE_AQI_STATION_EVENT](state) {
        let handler = state.aqiStation.handler;
        if(handler !== null) {
            let helper = new Helper(viewer);
            helper.removeAction(handler, 'leftClick');
            helper = null;
        }
    },

    [SET_AQI_STATION_DATA](state, {data, datetime}) {
        state.aqiStation.realData = data;
        state.aqiStation.datetime = datetime.substring(0, 16);
    },

    [HIDE_AQI_POPUP](state) {
        state.aqiStation.popup.show = false;
    },

    [ADD_WATER_STATION](state, { data, isAdd }) {
      let waterStation = state.waterStation;
      let helper=  new Helper(viewer);

      if(waterStation.collection.realData) {
        helper.removeCollection(waterStation.collection.realData);
        delete waterStation.collection.realData;
      }

      if(!Object.keys(data).length || (!isAdd && !Object.keys(waterStation.collection).length)) {
        helper = null;
        return;
      }

      let markerCollection, nameCollection;
      let realDataCollection = helper.labelCollection();
      if(isAdd) {
        markerCollection = helper.billboardCollection();
        nameCollection = helper.labelCollection();
      }
      console.log(data);
      //let points = {};
      for(let i in data) {
        //points[p.stcd] = p;
        let p = data[i];
        let pos = coordtransform.wgs84togcj02(Number(p.lgtd || p.lon), Number(p.lttd || p.lat));
        if(isAdd) {
          let billboard = helper.billboard(pos, `static/img/station/waterStation.png`, `water_${p.stcd || p.staid}`, 'bottom');
          let nameLabel = helper.label(p.stnm || p.name, pos, .4, 'white', 'name_label', 'both', 6, 'black', 'top');
          markerCollection.add(billboard);
          nameCollection.add(nameLabel);
        }
        if(p.hasOwnProperty('drp')) {
          let drp = Number(p.drp) ? Number(p.drp).toFixed(1) : String(p.drp);
          let rainLabel = helper.label(`${drp.indexOf('.0') !== -1 ? parseInt(drp) : drp}mm`, pos, .4, 'white',
            'rain_label', 'both', 6, 'blue', 'bottom', 'right', [-10, -10]);
          realDataCollection.add(rainLabel);
        }
        if(p.hasOwnProperty('z') || p.hasOwnProperty('rz')) {
          let levelLabel = helper.label(`${p.z || p.rz}m`, pos, .4, 'white', 'water_level', 'both', 6,
            'orange', 'bottom', 'left', [10, -10]);
          realDataCollection.add(levelLabel);
        }
      }

      if(isAdd) {
        helper.addCollection(markerCollection);
        helper.addCollection(nameCollection);
        waterStation.collection.marker = markerCollection;
        waterStation.collection.nameLabel = nameCollection;
      }
      helper.addCollection(realDataCollection);
      waterStation.collection.realData = realDataCollection;
      //waterStation.points = points;
      helper = null;
    },

    [REMOVE_WATER_STATION](state) {
      let helper = new Helper(viewer);
      for(let i in state.waterStation.collection) {
        helper.removeCollection(state.waterStation.collection[i]);
      }
      state.waterStation.collection = {};
      helper = null;
    },

    [ADD_WATER_STATION_REALDATA](state, data) {
        let waterStation = state.waterStation;
        let helper = new Helper(viewer);

        if(waterStation.collection.realData) {
            helper.removeCollection(waterStation.collection.realData);
            delete waterStation.collection.realData;
        }

        if(!Object.keys(data).length || !Object.keys(waterStation.collection).length) {
            helper = null;
            return;
        }
        let realDataCollection = helper.labelCollection();
        for(let i in data) {
            let d = data[i];
            let pos = coordtransform.wgs84togcj02(Number(d.lgtd), Number(d.lttd));
            if(d.hasOwnProperty('drp')) {
                let drp = Number(d.drp) ? Number(d.drp).toFixed(1) : d.drp;
                let rainLabel = helper.label(`${drp.indexOf('.0') !== -1 ? parseInt(drp) : drp}mm`, pos, .4, 'white',
                  'rain_label', 'both', 6, 'blue', 'bottom', 'right', [-10, -10]);
                realDataCollection.add(rainLabel);
            }
            if(d.hasOwnProperty('z') || d.hasOwnProperty('rz')) {
                let levelLabel = helper.label(`${d.z || d.rz}m`, pos, .4, 'white', 'water_level', 'both', 6,
                  'orange', 'bottom', 'left', [10, -10]);
                realDataCollection.add(levelLabel);
            }
        }
        helper.addCollection(realDataCollection);
        waterStation.collection.realData = realDataCollection;
        helper = null;
    },

    [ADD_SHIP_MODEL](state, shipData) {
        let shipInfo = state.shipInfo;
        let helper = new Helper(viewer);

        if(shipInfo.collection)
          helper.removeCollection(shipInfo.collection);
        if(shipInfo.pickedModel)
          shipInfo.pickedModel = null;

        let collection = helper.primitiveCollection();
        for(let i in shipData) {
            for(let ship of shipData[i]) {
                let shipVel = Number(ship.SOG || '0');
                let boatModel = 'boat_line0',
                    scale = 50;
                if(shipVel) {
                  let velRanges = [0, 8, 18, 24, 32];
                  for(let v = 1; v < velRanges.length; v++) {
                      if(shipVel > velRanges[v - 1] && shipVel <= velRanges[v]) {
                        boatModel = `boat_line${v}`;
                        break;
                      }
                  }
                  scale = 20;
                }

                let url = `http://10.148.83.229/model/${boatModel}.gltf`;
                let transCoor = coordtransform.wgs84togcj02(ship.V06001, ship.V05001);
                helper.addModel(url, transCoor, ship.COG / 10, 0, scale, getShipColor(i), collection, ship);
            }
        }
        helper.addCollection(collection);
        shipInfo.collection = collection;

        if(!shipInfo.handler) {
            shipInfo.handler = helper.getNewHandler();
            helper.pickModel('leftClick', shipInfo.handler, (position, idObj, pick) => {
                if(state.shipInfo.pickedModel)
                  state.shipInfo.pickedModel.primitive.silhouetteSize = 0;
                state.shipInfo.pickedModel = pick;
                state.shipInfo.pickedModel.primitive.silhouetteSize = 2;
                state.shipInfo.details = idObj || {};
            });
        }
        helper = null;

        function getShipColor(type) {
            let color = {
                '货船': '#00bf97',
                '未定义': '#a09e9c',
                '油船': '#ad652f',
                '客船': '#2ab4ff',
                '拖轮': '#8b00ff',
                '高速船': '#ffde55',
                '执法船': '#f44d31',
                '货船(x)': '#0f9172',
                '油船(x)': '#89491d',

                '渔船': '#2a6dff',
                '搜救船': '#f9f91c',
                '引航船': '#e90054',
                '其他船': '#ff8455',
                '疏浚或水下作业船': '#15ffdb',
                '拖带船': '#6dff17',
                '游艇': '#0021bf',
                '地效翼船': '#ffa67f',
                '港口供应船': '#15ff79',
                '帆船': '#be2ad8',
                '未定义(x)': '#777574',
                '客船(x)': '#10799e',
            };
            return color[type];
        }
    },

    [REMOVE_SHIP_MODEL](state) {
        let shipInfo = state.shipInfo;
        let helper = new Helper(viewer);
        if(shipInfo.collection) {
            helper.removeCollection(shipInfo.collection);
            delete shipInfo.collection;
        }
        if(shipInfo.handler) {
            helper.removeAction(shipInfo.handler, 'leftClick');
            shipInfo.handler = null;
        }
        if(shipInfo.pickedModel)
            delete shipInfo.pickedModel;
        shipInfo.details = {};
        helper = null;
    },

    [CLEAR_SHIP_DETAIL](state) {
        state.shipInfo.details = {};
        if(state.shipInfo.pickedModel) {
            state.shipInfo.pickedModel.primitive.silhouetteSize = 0;
            delete state.shipInfo.pickedModel;
        }
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
