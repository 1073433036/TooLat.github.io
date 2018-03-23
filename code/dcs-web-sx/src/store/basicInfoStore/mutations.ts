import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

import { Helper } from '../../util/Helper'
import GeoPoi from '../../util/GeoPoi'

export function TOGGLE_BASIC_INFO_POPUP (state: State, action) {
  state.basicInfoPopup = action;
}

export function ADD_GEO_COLLECTION (state: State, { type, subType=undefined, subTypeEn=undefined, data }) {
  if(!data) return;
  let helper = new Helper;
  let billboardCollection = helper.billboardCollection();

  let prefix = subType ? type+'_'+subType : type;
  let imgUrl = `static/img/geography/${subType ? type+'/'+subTypeEn : type}.png`;

  if(prefix in state.collections) {
    helper.removeCollection(state.collections[prefix]);
    delete state.collections[prefix];
  }

  for(let id in data) {
      let poi = data[id];
      let lon, lat;
      if(poi instanceof Array === true) {
          lon = poi[0].gcjLon || poi[0].lon;
          lat = poi[0].gcjLat || poi[0].lat;
      } else {
          if(poi.hasOwnProperty('gcjLon')) {
              lon = poi.gcjLon;
              lat = poi.gcjLat;
          } else if(poi.hasOwnProperty('lon')) {
              lon = poi.lon;
              lat = poi.lat;
          } else {
              let keys = Object.keys(poi);
              let arr = poi[keys[0]];
              lon = arr[0].lon;
              lat = arr[0].lat;
          }
      }
      let billboard = helper.billboard([lon, lat], imgUrl, `${prefix}_${id}`);
      billboardCollection.add(billboard);
  }

  helper.addCollection(billboardCollection);
  window["viewer"].scene.primitives.raiseToTop(billboardCollection);
  state.collections[prefix] = billboardCollection;
  state.poiCollection[prefix] = data;

  helper = null;
}

export function ADD_POI_CLICK_EVENT (state: State) {
  let helper = new Helper;
  if(state.handler === null) state.handler = helper.getNewHandler();
  if(Object.keys(state.collections).length > 1) return;
  console.log(state.collections);

  helper.setAction('leftClick', state.handler, null, (entity, index, movement, info) => {
    let pickedObj = window['viewer'].scene.pick(movement.position);
    if(window['Zearth'].defined(pickedObj) && typeof pickedObj.id === 'string') {
      let p = pickedObj.primitive;
      if(p && p.image) {
        if(state.clickPrimitive && state.clickPrimitive.image) {
          state.clickPrimitive.image = state.clickPrimitive.image.replace('_pre.png', '.png')
        }
        state.clickPrimitive = p
        state.clickPrimitive.image = pickedObj.primitive.image.replace('.png', '_pre.png')
      }
      
      let strArr = pickedObj.id.split('_');
      let type = strArr[0] + (strArr.length < 3 ? '' : ('_' + strArr[1])),
          poiId = strArr.length < 3 ? strArr[1] : strArr[2];
      let geoPoi = new GeoPoi;
      let poiData = geoPoi.getPoiDetail(type, poiId, state.poiCollection);
      if(!poiData) return;
      state.poiDetail.show = true;
      state.poiDetail.title = poiData.title;
      state.poiDetail.details = poiData.details;
    }
  });

  if(state.mouseoverHandler === null) state.mouseoverHandler = helper.getNewHandler();
  helper.setAction('mouseOver', state.mouseoverHandler, null, (entity, index, movement, info) => {
    let pickedObj = window['viewer'].scene.pick(movement.endPosition)
    if(window['Zearth'].defined(pickedObj) && typeof pickedObj.id === 'string') {
      let strArr = pickedObj.id.split('_');
      let type = strArr[0] + (strArr.length < 3 ? '' : ('_' + strArr[1])),
          poiId = strArr.length < 3 ? strArr[1] : strArr[2];
      let geoPoi = new GeoPoi;
      let poiData = geoPoi.getPoiDetail(type, poiId, state.poiCollection);
      if(!poiData) return;
      let obj = {
        x: movement.endPosition.x,
        y: movement.endPosition.y,
        name: poiData.title,
      }
      state.pointTitle = { ...obj }
      state.isTitlePopupOn = true
    } else {
      state.pointTitle = null
      state.isTitlePopupOn = false
    }
  });

  helper = null;
}

export function REMOVE_GEO_COLLECTION (state: State, { type, subType }) {
  let collections = state.collections;
  let id = subType ? type + '_' + subType : type;
  if(id in collections) {
    let helper = new Helper;
    helper.removeCollection(collections[id]);
    delete collections[id];
    helper = null;
  }
  if(id in state.poiCollection)
    delete state.poiCollection[id];
  if(!Object.keys(collections).length) 
    state.poiDetail.show = false;
}

export function REMOVE_POI_CLICK_EVENT (state: State) {
  if(Object.keys(state.collections).length === 0 && state.handler !== null) {     //地图上不存在数据点时 移除地图点击事件
    let helper = new Helper;
    helper.removeAction(state.handler, 'leftClick');
    helper.removeAction(state.mouseoverHandler, 'mouseOver');
    state.handler = null
    state.mouseoverHandler = null
    helper = null;
  }
}

export function SHOW_MATERIAL_LIST (state: State, key) {
  let selected = state.poiDetail.selected;
  state.poiDetail.selected = key === selected ? '' : key;
}

export function HIDE_POI_DETAIL_POPUP (state: State) {
  state.poiDetail.show = false;
}

export function CLEAR_ALL_GEO_POI (state: State) {
  let collections = state.collections,
      poiCollection = state.poiCollection;
  let helper = new Helper;

  state.poiDetail.show = false;

  for(let i in collections) {
      helper.removeCollection(collections[i]);
      delete collections[i];
      delete poiCollection[i];
  }
  helper.removeAction(state.handler, 'leftClick');
  helper = null;
}


export function MATCH_GEO_POI (state: State, data) {
  state.matchPoiCollection = { ...data };
  state.matchPoiInfoPopup = Object.keys(data).length ? true : false;
}

export function TOGGLE_GEO_INFO_POPUP (state: State, action) {
  state.matchPoiInfoPopup = action;
}

export function CLEAR_SELECTED_PRI (state: State) {
  if(state.clickPrimitive && state.clickPrimitive.image) {
    state.clickPrimitive.image = state.clickPrimitive.image.replace('_pre.png', '.png')
    state.clickPrimitive = null
  }
}

export function changeDetatilData (state: State, obj) {
  state.poiDetail.show = obj.show
  state.poiDetail.title = obj.title
  state.poiDetail.details = obj.details
  state.poiDetail = { ...state.poiDetail }
}

export function toggleTitlePopup (state: State, action: boolean) {
  state.isTitlePopupOn = action
}

export default <MutationTree<State>> {
    TOGGLE_BASIC_INFO_POPUP,
    ADD_GEO_COLLECTION,
    ADD_POI_CLICK_EVENT,
    REMOVE_GEO_COLLECTION,
    REMOVE_POI_CLICK_EVENT,
    SHOW_MATERIAL_LIST,
    HIDE_POI_DETAIL_POPUP,
    CLEAR_ALL_GEO_POI,
    MATCH_GEO_POI,
    TOGGLE_GEO_INFO_POPUP,
    CLEAR_SELECTED_PRI,
    changeDetatilData,
    toggleTitlePopup,
}