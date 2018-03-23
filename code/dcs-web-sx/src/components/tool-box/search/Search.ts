import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './Search.html?style=./Search.scss'

import { Helper } from '../../../util/Helper'
import { GeographyClient } from '../../../util/clientHelper'
import { MeteoMonitor } from '../../../util/MeteoMonitor'
import GeoPoi from '../../../util/GeoPoi'

let drawEntityArray: any[] = null   //绘制图形

@WithRender
@Component
export default class Search extends Vue {
  @Prop() closeFunc
  @Getter('systemStore/region_global') region_global
  @Action('basicInfoStore/addGeoPoiSet_global') addGeoPoiSet_global
  @Action('basicInfoStore/clearAllGeoPoi_global') clearAllGeoPoi_global
  @Action('basicInfoStore/matchGeoPoi_global') matchGeoPoi_global
  // @Action('basicInfoStore/changeDetatilData_global') changeDetatilData_global
  
  tabOpt: any = {
    poi: { text: 'POI', tip: '请输入POI名称' },
    station: { text: '监测站', tip: '请输入站点编号或名称' },
    drawtool: { text: '任意面' },
    town: { text: '按城镇' },
  }
  selectedTabOpt: 'poi' | 'station' | 'drawtool' | 'town' =  'poi'
  
  drawTool: any = {
    options: [
      { key: 'circle', text: '圆形' },
      { key: 'rect', text: '矩形' },
      { key: 'polygon', text: '多边形' },
      { key: 'cancel', text: '撤消' },
      { key: 'delete', text: '删除' }
    ],
  }
  poiNameArray: any = {
    School: '学校',
    Hospital: '医院',
    Reservoir: '水库',
    Chemical: '危化品企业',
    Loudspeaker: null,
    Openspace: '避难场所',
    // Economy: null,     //排除人口经济  (视频设备)
    Led: null,
    Electricity: '电力设施',
    RiskPoint: null,
    Material: null,
    Rescueteam: '救援队',
  }
  materialPurpose: any = {
    自然灾害: 'natural',
    公共卫生: 'public',
    事故灾难: 'disaster',
  }
  rescueteamPurpose: any = {
    事故灾难: 'disaster',
    社会安全: 'security',
    自然灾害: 'natural',
    公共卫生: 'public',
    综合: 'multiple',
    医疗救援队: 'medical',
  }
  poiCollection: any = {}         //所有数据点集合
  drawHelper: any = undefined
  matchPoiCollection: any = {}    //匹配数据点集合

  keyword: string = ''
  resultList: any[] = []      //搜索匹配数据
  poiLayer: any = {}
  stations: any[] = []

  clearKeyword() {
    this.keyword = '';
  }
  matchPOI(val) {     //POI搜索
    this.getMatchedPoi((poiSet, key) => {
      for(let i in poiSet) {
        let name, lon, lat, poi = poiSet[i];
        let poiType = this.poiNameArray[key];
        if(key === 'Material') {
          let keys = Object.keys(poi);
          let poiInfo = poi[keys[0]];
          if(!poiInfo[0].name) continue;
          name = (poiType ? poiType + '-' : '') + poiInfo[0].name;
          lon = poiInfo[0].gcjLon || poiInfo[0].lon;
          lat = poiInfo[0].gcjLat || poiInfo[0].lat;
        } else if(key === 'Rescueteam') {
          if(!poi[0].name) continue;
          name = (poiType ? poiType + '-' : '') + poi[0].name;
          lon = poi[0].gcjLon || poi[0].lon;
          lat = poi[0].gcjLat || poi[0].lat;
        } else {
          if(!poi.name) continue;
          name = (poiType ? poiType + '-' : '') + poi.name;
          lon = poi.gcjLon || poi.lon;
          lat = poi.gcjLat || poi.lat;
        }
        let matchPoi = { name, lon, lat, detail: poi };
        if(matchPoi.name && matchPoi.name.indexOf(val) >= 0) {
          this.resultList.push(matchPoi);
        }
      }
    });
  }
  matchStation(val) {       //监测站搜索
    const getMatch = () => {
      for(let item of this.stations) {
        if(item.stationid.indexOf(val) >= 0 || item.name.indexOf(val) >= 0) {
          this.resultList.push(item);
        }
      }
    };
    this.stations.length ? getMatch() : this.getStation(getMatch);
  }
  async getStation(callback) {    //获取检测站数据
    const city = this.region_global.cityName,
      county = this.region_global.countyName;
    let meteoMonitor = new MeteoMonitor;
    let data: any = await meteoMonitor.getStations(city, county);
    if(!data) return;
    this.stations = data;
    callback();
  }
  //点击查询数据列表的选项视角移到当前点
  flyToPoint(el) {
      let helper = new Helper;
      if(Object.keys(this.poiLayer).length) {
        helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
      }
      let lon = el.lon || el.longitude;
      let lat = el.lat || el.latitude;
      this.poiLayer.billboard = helper.addBillboard([lon, lat], './static/img/search_point.png', 'bottom');
      this.poiLayer.label = helper.addLabel(el.name, [lon, lat], .5, 'white', 'top', 'center', [0, 0], true, 'label', 'both', 5);
      helper.flyTo([lon, lat]);
      helper = null;
  }

  @Watch('keyword')
  onkeywordChanged(val: any, oldVal: any): void {
    this.resultList = [];
    if(Object.keys(this.poiLayer).length) {
      let helper = new Helper;
      helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
      helper = null;
    }
    val = val.trim();
    if(!val) return;
    if(this.selectedTabOpt === 'poi')
      this.matchPOI(val);
    else if(this.selectedTabOpt === 'station')
      this.matchStation(val);
  }

  async getMatchedPoi(callback) {         //返回所有数据 函数回调
    let geoPoiHelper = new GeoPoi();
    for(let name in this.poiNameArray) {
      if(this.poiCollection.hasOwnProperty(name)) {
        callback(this.poiCollection[name], name);
        continue;
      }

      let res;
      if(name === 'Material')
        res = await geoPoiHelper.getAllMaterial();
      else if(name === 'Rescueteam')
        res = await geoPoiHelper.getAllRescueteam();
      else
        res = await geoPoiHelper.getPoi({type: name, subType: undefined });
      
      this.poiCollection[name] = res;
      callback(res, name);
    }
    console.log(this.poiCollection);
  }

  searchTool(key) {         //任意面
    let helper = new Helper;
    if(key === 'cancel') {
      let rmEntity = drawEntityArray.pop();
      if(rmEntity) {
        let keys = Object.keys(rmEntity);
        helper.removeCollection(rmEntity[keys[0]]);
      }
      this.clearAllGeoPoi_global();
      if(drawEntityArray.length)
        this.getMatchedByDraw();
      else
        this.matchPoiCollection = {};
    } else if(key === 'delete') {
      this.clearAllData();
    } else {
      if(this.drawHelper)
        this.drawHelper.stopDrawing();

      this.drawHelper = helper.startDrawing(key, true, (entity) => {
          if(!drawEntityArray)
              drawEntityArray = [];
          drawEntityArray.push({ [key]: entity });
          this.getMatchedByDraw();
          this.drawHelper = undefined;
      });
    }
  }
  getMatchedByDraw() {            //获取圈选范围内数据
    if(!drawEntityArray && !this.polygons.length) return;
    this.matchPoiCollection = {};
    let helper = new Helper;
    this.getMatchedPoi((poiData, key) => {      //先获取该类型所有点数据
      if(!poiData) return;
      let matchPois = {};       //范围内的点

      for(let i in poiData) {
        let poi = poiData[i];
        let lon, lat;

        if(key === 'Material') {
            const keys = Object.keys(poi);
            let poiInfo = poi[keys[0]][0];
            lon = poiInfo.gcjLon || poiInfo.lon;
            lat = poiInfo.gcjLat || poiInfo.lat;
        } else if(key === 'Rescueteam') {
            lon = poi[0].gcjLon || poi[0].lon;
            lat = poi[0].gcjLat || poi[0].lat;
        } else {
            lon = poi.gcjLon || poi.lon;
            lat = poi.gcjLat || poi.lat;
        }

        if(drawEntityArray) {
          for(let entity of drawEntityArray) {     //循环所有绘制图形
            if(entity.hasOwnProperty('circle')) {
              let center = entity.circle.getCenter(),
                radius = entity.circle.getRadius();
              const c = helper.getCoorFromCtn3(center);
              const d = helper.getDistance(c, [lon, lat]);
              if(d < radius)
                matchPois[i] = poi;
            }
            else if(entity.hasOwnProperty('rect')) {
              let extent = entity.rect.getExtent(),
                bound: any = {};
              ['east', 'west', 'south', 'north'].forEach(attr => {
                if(extent.hasOwnProperty(attr))
                  bound[attr] = helper.convertRadianToDegrees(extent[attr]);
              });
              if(lon > bound.west && lon < bound.east && lat > bound.south && lat < bound.north) {
                matchPois[i] = poi;
              }
            }
            else if(entity.hasOwnProperty('polygon')) {
              let positions = entity.polygon.getPositions();
              let polyArray = [];
              for(let p of positions) {
                polyArray.push(helper.getCoorFromCtn3(p));
              }
              let point = helper.getCtn2FromCtn3([lon, lat]);
              if(helper.isPointInPolygon(point, polyArray)) {
                matchPois[i] = poi;
              }
            }
          }
        }
        
        if (this.polygons.length) {
          let point = helper.getCtn2FromCtn3([lon, lat]);
          for (let polygonArea of this.polygons) {
            if(helper.isPointInPolygon(point, polygonArea)) {
              matchPois[i] = poi;
              break
            }
          }
        }
      }

      if(!Object.keys(matchPois).length) return;
      this.matchPoiCollection[key] = matchPois;
      this.matchPoiCollection = { ...this.matchPoiCollection };

      if(key === 'Material' || key === 'Rescueteam') {
        let poiSet = {};
        if(key === 'Material') {
          for(let i in matchPois) {
            let poi = matchPois[i];
            let keys = Object.keys(poi);
            const type = poi[keys[0]][0].purpose;
            if(poiSet.hasOwnProperty(type) === false) {
              poiSet[type] = {};
            }
            poiSet[type][i] = poi;
          }
        } else {
          for(let i in matchPois) {
            const type = matchPois[i][0].teamtype;
            if(poiSet.hasOwnProperty(type) === false) {
              poiSet[type] = {};
            }
            poiSet[type][i] = matchPois[i];
          }
        }

        for(let i in poiSet) {
          this.addGeoPoiSet_global({
            type: key,
            subType: i,
            subTypeEn: ( key === 'Material' ? this.materialPurpose[i] : this.rescueteamPurpose[i] ),
            data: poiSet[i]
          });
        }

      } else {

        this.addGeoPoiSet_global({
          type: key,
          subType: undefined,
          data: matchPois
        });

      }
    });
  }
  clearAllData() {        
    if(drawEntityArray && drawEntityArray.length) {
      let helper = new Helper;
      for(let entity of drawEntityArray) {
        let keys = Object.keys(entity);
        helper.removeCollection(entity[keys[0]]);   //清除绘制图形
      }
      drawEntityArray = [];
      this.matchPoiCollection = {};
      helper = null;
      this.clearAllGeoPoi_global();       //清除数据点
    }
  }

  @Watch('matchPoiCollection')
  onmatchPoiCollectionChanged(val: any, oldVal: any): void {
    this.matchGeoPoi_global(val);
  }

  clearDrawEntity() {
    this.clearAllData();
    if(this.drawHelper) {
      this.drawHelper.stopDrawing();
      this.drawHelper = undefined;
    }
  }
  
  @Watch('selectedTabOpt')
  onselectedTabOptChanged(val: any, oldVal: any): void {
    if(oldVal === 'drawtool') this.clearDrawEntity()
    if(oldVal === 'poi' || oldVal ===  'station') this.keyword = ''
    if(oldVal === 'town') this.clearTown()
    if(val === 'town') this.getTowns()
  }

  beforeDestroy () {
    this.clearDrawEntity()
    if(Object.keys(this.poiLayer).length) {
      let helper = new Helper;
      helper.removeEntity([this.poiLayer.billboard, this.poiLayer.label]);
      helper = null;
    }
    this.clearTown()
    this.matchGeoPoi_global({})
  }

  selTown: string = '选择镇'
  towns: any = {}
  polygons: any[] = []    //边界数据
  areas: any[] = []       //绘制entity
  async getTowns() {
    if(Object.keys(this.towns).length) {
      this.drawTown()
      return
    }
    let data = await GeographyClient.getTownsBound(this.region_global.countyId)
    if(!data) return
    for(let info of data) {
      this.towns[info.townId] = info
    }
    this.towns = { ...this.towns }
    this.selTown = data[0].townId + ''
  }

  @Watch('selTown')
  onselTownChanged(val: any, oldVal: any): void {
    this.drawTown()
  }

  drawTown() {
    this.clearTown()
    let helper = new Helper()
    for(let boundary of this.towns[this.selTown].boundary) {
      let pos = [];
      let polygonArea = []
      for(let info of boundary) {
        pos.push(info.x);
        pos.push(info.y);
        polygonArea.push([info.x, info.y])
      }
      this.polygons.push(polygonArea)
      this.areas.push(helper.addPolygonGeometry(pos));
      this.getMatchedByDraw()
    }
  }
  clearTown() {
    if(!this.areas.length) return
    let helper = new Helper()
    for(let area of this.areas)
      helper.removeCollection(area)
    helper = null
    this.areas = []
    this.polygons = []
    this.clearAllGeoPoi_global()
    this.matchPoiCollection = {}
  }
}