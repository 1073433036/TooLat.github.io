import {
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
} from '../mutation-types'

export class State {
  basicInfoPopup: boolean = false
  collections: any = {}       //地图billboard
  poiCollection: any = {}     //数据
  poiDetail: any = {
      show: false,
      title: '',
      details: [],
      selected: ''
  }
  handler: any = null
  mouseoverHandler: any = null

  clickPrimitive: any = null

  matchPoiCollection: any = {}
  matchPoiInfoPopup: boolean = false

  isTitlePopupOn: boolean = false
  pointTitle: any = {}
}