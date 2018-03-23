import * as actions from '../actions/geographyAct'
import * as getters from '../getters/geographyGetters'
import {
    ADD_GEO_COLLECTION,
    REMOVE_GEO_COLLECTION,
    ADD_POI_CLICK_EVENT,
    REMOVE_POI_CLICK_EVENT,
    SHOW_MATERIAL_LIST,
    HIDE_POI_DETAIL_POPUP,
    REMOVE_ALL_GEOPOI,
    UP_RESERVOIR_RAINFALL,
} from '../mutation-types'

import { Helper } from '../../util/Helper'
import GeoPoi from '../../util/GeoPoi'
import coordtransform from 'coordtransform'

const state = {
    menu: {
      baseInfo: {
        text: '地理信息',
        enabled: true,
        menu: {
          school: { text: '学校信息', selected: false },
          hospital: { text: '医院信息', selected: false },
          reservoir: { text: '水库信息', selected: false },
          chemical: { text: '危化物品', selected: false },
          //loudspeaker: { text: '省突喇叭', selected: false },
          shelter: { text: '避难场所', selected: false },
          economy: { text: '人口经济', selected: false }
        }
      },
      material: {
        text: '物资信息',
        enabled: false,
        menu: {
          civilAdmin: { text: '民政物资', selected: false },
          waterConservancy: { text: '水利物资', selected: false },
          threeAnti: { text: '三防物资', selected: false },
          publicsecurity: { text: '公安物资', selected: false },
          land: { text: '国土物资', selected: false },
          forestry: { text: '林业物资', selected: false },
          evnProtection: { text: '环保物资', selected: false },
          marine: { text: '海事物资', selected: false },
          safety: { text: '安监物资', selected: false },
          electric: { text: '电力物资', selected: false },
          communication: { text: '通讯物资', selected: false }
        }
      },
      rescueteam: {
        text: '救援队伍',
        enabled: true,
        menu: {
          traffic: { text: '交通运输', selected: false },
          fire: { text: '公安消防', selected: false },
          town: { text: '乡镇救援', selected: false },
          marine: { text: '海上救援', selected: false },
          electric: { text: '电力救援', selected: false },
          communication: { text: '通讯救援', selected: false },
          hospital: { text: '医疗救援', selected: false }
        }
      }
    },
    collections: {},
    poiCollection: {},
    poiDetail: {
        show: false,
        title: '',
        details: [],
        selected: '',
        type:'',
    },
    handler: null,
    reservoirRainfall: [],//水库降雨量
}

const mutations = {
    [ADD_GEO_COLLECTION](state, {type, subType, data}) {
        if(data === null)
            return;

        let helper = new Helper(viewer);
        let billboardCollection = helper.billboardCollection();

        let prefix = subType ? `${type}_${subType}` : type;
        let imgUrl = `./static/img/geography/${subType ? type+'/'+subType : type}.png`;

        if(prefix in state.collections) {
            helper.removeCollection(state.collections[prefix]);
            delete state.collections[prefix];
        }

        for(let id in data) {
            let poi = data[id];
            let lon, lat;
            if(poi instanceof Array === true) {
                lon = poi[0].lon;
                lat = poi[0].lat;
            } else {
                if(poi.hasOwnProperty('lon')) {
                    lon = poi.lon;
                    lat = poi.lat;
                } else {
                    let keys = Object.keys(poi);
                    let arr = poi[keys[0]];
                    lon = arr[0].lon;
                    lat = arr[0].lat;
                }
            }
            let transCoor = coordtransform.wgs84togcj02(lon, lat);
            let billboard = helper.billboard(transCoor, imgUrl, `${prefix}_${id}`);
            billboardCollection.add(billboard);
        }

        helper.addCollection(billboardCollection);
        viewer.scene.primitives.raiseToTop(billboardCollection);
        state.collections[prefix] = billboardCollection;
        state.poiCollection[prefix] = data;
        helper = null;
    },

    [REMOVE_GEO_COLLECTION](state, {type, subType}) {
        let collections = state.collections;
        let id = subType ? type+'_'+subType : type;
        if(id in collections){
            let helper = new Helper(viewer);
            helper.removeCollection(collections[id]);
            delete collections[id];
            helper = null;
        }
        if(id in state.poiCollection) {
            delete state.poiCollection[id];
        }
        if(!Object.keys(collections).length) {
            state.poiDetail.show = false;
        }
    },

    [ADD_POI_CLICK_EVENT](state, $http) {
        let helper = new Helper(viewer);
        if(state.handler === null) {
            state.handler = helper.getNewHandler();
        }
        if(Object.keys(state.collections).length > 1)
            return;

        helper.setAction('leftClick', state.handler, null, (entity, index, movement, info) => {
            let pickedObj = viewer.scene.pick(movement.position);
            if(Zearth.defined(pickedObj) && typeof pickedObj.id === 'string'){
                let strArr = pickedObj.id.split('_');
                let type = strArr[0] + (strArr.length < 3 ? '' : ('_' + strArr[1])),
                    poiId = strArr.length < 3 ? strArr[1] : strArr[2];
                let geoPoi = new GeoPoi($http);
                let poiData = geoPoi.getPoiDetail(type, poiId, state.poiCollection);
                geoPoi = null;
                if(!poiData)
                    return;
                let pickedPos = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                let pointCoor = helper.getCoorFromCtn3(pickedPos);
                state.poiDetail.show = true;
                state.poiDetail.title = poiData.title;
                state.poiDetail.details = poiData.details;
                state.poiDetail.type = type;
                state.poiDetail.position = pointCoor;
            }
        });
    },

    [REMOVE_POI_CLICK_EVENT](state) {
        if(Object.keys(state.collections).length === 0 && state.handler !== null) {
            let helper = new Helper(viewer);
            helper.removeAction(state.handler, 'leftClick');
            state.handler.destroy();
            state.handler = null;
            helper = null;
        }
    },

    [SHOW_MATERIAL_LIST](state, key) {
        let selected = state.poiDetail.selected;
        state.poiDetail.selected = key === selected ? '' : key;
    },

    [HIDE_POI_DETAIL_POPUP](state) {
        state.poiDetail.show = false;
    },

    [REMOVE_ALL_GEOPOI](state) {
        let collections = state.collections,
            poiCollection = state.poiCollection;
        let helper = new Helper(viewer);

        state.poiDetail.show = false;

        for(let i in collections) {
            helper.removeCollection(collections[i]);
            delete collections[i];
            delete poiCollection[i];
        }
        helper.removeAction(state.handler, 'leftClick');
        state.handler.destroy();
        state.handler = null;
        helper = null;
    },

    [UP_RESERVOIR_RAINFALL](state,model) {
      if(model == null) {
        state.reservoirRainfall = [[]];
      } else {
        model[0].forEach((v, i) => {
          if(v != 0) {
            v = v.toFixed(1) - 0;
          }
          model[0][i] = v;
          if(i == 10) {
            state.reservoirRainfall = model;
          }
        });
      }
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
